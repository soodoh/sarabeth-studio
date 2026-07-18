# AWS Amplify production operations

This runbook covers the production-only deployment of `soodoh/sarabeth-studio` in `us-west-2`. It must be used with an explicit production AWS profile; never rely on the CLI default profile.

```bash
export AWS_PROFILE=sarabeth-production
export AWS_REGION=us-west-2
export AWS_DEFAULT_REGION=us-west-2
aws sts get-caller-identity
```

The verified account must be `015989770400` and must own the `sarabethbelon.com` registration before any mutation. Never place Contentful, GitHub, Netlify, or AWS credentials in command arguments, committed files, workflow logs, or CloudFormation parameters other than the temporary `NoEcho` GitHub authorization parameter described below.

## Stack layout and bootstrap

The native CloudFormation templates live under `infrastructure/cloudformation/`:

1. `bootstrap.yaml` — account-level GitHub OIDC provider and the protected infrastructure role.
2. `hosting.yaml` — Contentful secret container, Amplify build/compute roles, Amplify app and `main` branch, deployment role, CMS webhook, logging, SNS, and alarms.
3. `dns.yaml` — a clean Route 53 public hosted zone and the complete non-authoritative record import.
4. `domain.yaml` — optional Amplify production-domain association, enabled only at approved cutover.

Use change sets for manual bootstrap and inspect them before execution. Bootstrap changes remain a break-glass administrator operation because the protected workflow is intentionally unable to rewrite its own OIDC or CloudFormation execution roles. The bootstrap stack creates a workload permissions boundary; the execution role can manage only the four exact application-role names and must attach that boundary. The manually dispatched infrastructure workflow applies hosting, DNS, and optional domain changes through the protected `production-infrastructure` GitHub environment.

Termination protection is enabled on the bootstrap, hosting, and DNS stacks. The infrastructure workflow re-enables it for the stacks it manages. Disable it only during a reviewed recovery or decommissioning operation. Before the first deployment of the contact rate-limit table and last-known-good marker, manually reapply the bootstrap stack so the execution role and workload boundary include the checked-in DynamoDB and SSM permissions; only then run the protected infrastructure workflow.

The GitHub repository authorization token is temporary. Read it from the authenticated `gh` process into a mode-0600 temporary file or standard input, pass it only to the `NoEcho` stack parameter during initial app creation, and securely remove the temporary file immediately afterward. Amplify uses the token to authorize its GitHub App and does not store it.

Populate the generated Secrets Manager secret separately after stack creation. Do not pass its value through CloudFormation:

```bash
umask 077
secret_file="$(mktemp)"
# Write the JSON object interactively without echoing it:
# {"CONTENTFUL_SPACE_ID":"...","CONTENTFUL_ACCESS_TOKEN":"..."}
aws secretsmanager put-secret-value \
  --secret-id sarabeth-studio/production/contentful \
  --secret-string "file://$secret_file"
rm -f "$secret_file"
```

## Application deployment

Pull requests and pushes run lint and type checking, build the production data-provider graph against deterministic external Contentful fixtures, build and validate a deterministic Amplify fixture bundle, build a separate deterministic Playwright target, and then run Playwright against that target. A successful push to `main` assumes the narrow deployment role through GitHub OIDC and starts an Amplify `RELEASE` job. Amplify—not GitHub Actions—runs `amplify.yml`, fetches the Contentful secret with its build role, builds `.amplify-hosting`, and validates the deployment bundle.

Repository auto-builds and preview branches are disabled. Deployment concurrency allows only one production release. CI starts the release with `--commit-id "$GITHUB_SHA"` and rejects any different commit returned by `StartJob`. During pre-build, Amplify reads `job.summary.commitId` and `job.summary.jobType` from `GetJob`; a `RELEASE` must provide the same concrete 40-character SHA as the checked-out `git rev-parse HEAD`. The job reason remains diagnostic metadata and is not a source-verification input. Every Contentful `WEB_HOOK` job fetches the immutable commit from the live Amplify deployment metadata and proceeds only when its checkout matches that CI attestation, whether Amplify reports `HEAD` or a concrete SHA. Content publishing therefore cannot deploy code newer than the last CI-attested release. The build writes its checked-out SHA to `__deployment.json`, and post-deployment smoke testing requires that immutable value to equal the expected GitHub SHA.

The deployment manifest routes only `/api/email` to compute. Prerendered pages, assets, and the catch-all are static-only, so unknown requests return a hosting 404 without invoking server rendering or requiring build-only Contentful credentials.

Functional smoke tests run against the Amplify URL without sending email. Only after those checks pass, CI writes the validated SHA to the protected durable SSM parameter `/sarabeth-studio/production/last-known-good-sha`; the deployment role can read and overwrite only that parameter and cannot delete it. A failed release wait, commit mismatch, functional smoke test, or marker update stops an active job when possible and fails the workflow while reporting the stored last-known-good SHA. The live `__deployment.json` remains source attestation for the currently deployed release, not rollback history, because an Amplify release that succeeds but fails smoke has already replaced it. Lighthouse CI runs only after functional checks; a Lighthouse regression fails/reports the workflow but never triggers rollback.

### One-time last-known-good bootstrap

Before the first rollout that can update the marker, seed it from the deployment already being served. Set `DEPLOYMENT_URL` to the canonical Amplify production URL, then run the following from a reviewed checkout with dependencies installed. The initial `get-parameter` is a safety gate: if the parameter exists, stop and inspect its value and AWS metadata instead of replacing it.

```bash
parameter_name=/sarabeth-studio/production/last-known-good-sha

if existing_parameter=$(aws ssm get-parameter \
  --name "$parameter_name" \
  --output json 2>&1); then
  printf '%s\n' "$existing_parameter" | jq '{Parameter: {Name: .Parameter.Name, Type: .Parameter.Type, Value: .Parameter.Value, Version: .Parameter.Version, LastModifiedDate: .Parameter.LastModifiedDate}}'
  echo "Last-known-good state already exists; inspect it and do not replace it during bootstrap." >&2
  exit 1
elif [[ "$existing_parameter" != *"ParameterNotFound"* ]]; then
  printf '%s\n' "$existing_parameter" >&2
  exit 1
fi

deployment_metadata=$(curl --fail --silent --show-error \
  -H 'Cache-Control: no-cache' \
  "$DEPLOYMENT_URL/__deployment.json?bootstrap=$(date +%s)")
current_sha=$(jq -er '.commit | select(test("^[0-9a-f]{40}$"))' <<< "$deployment_metadata")
printf 'Currently served deployment: %s\n' "$current_sha"

bun scripts/smoke-deployment.ts "$DEPLOYMENT_URL" "$current_sha"
aws ssm put-parameter \
  --name "$parameter_name" \
  --type String \
  --value "$current_sha" >/dev/null
```

Do not add `--overwrite` to this bootstrap command. A concurrent creation must fail rather than replace a marker that another operator or deployment wrote.

## CMS rebuilds

A CloudFormation custom resource manages the Amplify build webhook because CloudFormation has no native `AWS::Amplify::Webhook` resource. Its URL is configured in Contentful through a temporary Management API token. Publish and unpublish events invoke the webhook and start a production build on `main`. Webhook rotation creates the replacement first and returns a new physical ID; CloudFormation deletes the old webhook only after the replacement succeeds. The token is needed only to configure or rotate the Contentful webhook and must not be stored in Amplify, GitHub, or CloudFormation.

To test the integration, trigger one controlled Contentful publish/unpublish event, record the resulting Amplify job ID and commit, wait for success, then restore the entry if necessary. Do not include the webhook URL in public logs even though it is not an AWS credential.

## Rollback

### Deployment rollback

This is an explicit operator-gated path. Read the durable last-known-good SHA, verify that it names the intended repository commit, restore that source tree with a new Conventional Commit on `main`, review the diff, and push it:

```bash
last_known_good_sha=$(aws ssm get-parameter \
  --name /sarabeth-studio/production/last-known-good-sha \
  --query 'Parameter.Value' \
  --output text)
git cat-file -e "${last_known_good_sha}^{commit}"
printf 'Last-known-good deployment: %s\n' "$last_known_good_sha"
```

Let the protected production workflow build, deploy, validate, and advance the marker. Use the live `__deployment.json` only to attest the source currently served; do not treat it as rollback history. Do not use Amplify's `RETRY` job type as a rollback mechanism for this repository-connected app: a retry clones the current `HEAD` and does not restore the original job artifact.

### CloudFormation rollback recovery

Inspect stack events before taking action. For `UPDATE_ROLLBACK_FAILED`, repair the minimum failed permission or resource first, then run `cloudformation continue-update-rollback`; skip a resource only when its live state is understood and the next reviewed update will reconcile the drift. Reapply the checked-in template through the protected infrastructure workflow and run drift detection afterward. Never delete a stack merely to clear a rollback state.

### DNS rollback before Netlify deletion

Before cutover, record the exact Netlify apex and `www` answers and the registrar's four NS values. If production validation fails while Netlify remains available, dispatch the protected infrastructure workflow with `rollback_to_netlify=true`. It first declaratively restores the captured Netlify A/AAAA records, then removes the Amplify domain association so a later failure cannot leave DNS pointing at a detached target. Wait for TTL expiry and rerun the status/header/visual checks. Do not delete the Netlify site or zone until approval gate 2. A failed domain-association deployment uses the same DNS-first recovery order before failing the workflow.

If Route 53 delegation itself causes mail or web failure before the Amplify domain is attached, restore the registrar nameservers to:

- `dns1.p02.nsone.net`
- `dns2.p02.nsone.net`
- `dns3.p02.nsone.net`
- `dns4.p02.nsone.net`

Use the exact `route53domains update-domain-nameservers` rollback document generated immediately before cutover; do not reconstruct it from memory.

## DNS and domain cutover

The DNS stack must contain every Netlify-exported record except Netlify's SOA and authoritative NS records. Initially, apex and `www` continue to resolve to Netlify. Compare normalized record sets programmatically and resolve every mismatch before requesting approval gate 1.

After approval gate 1:

1. Change registrar delegation to the new Route 53 nameservers while web traffic still targets Netlify.
2. Verify authoritative and recursive propagation, web health, SES DKIM, MAIL FROM MX/SPF, and email health.
3. Dispatch the protected infrastructure workflow with the approval confirmation. It first applies the domain association while the DNS stack continues serving Netlify, retrieves Amplify's certificate-validation and CloudFront targets, then updates the existing apex and `www` record resources atomically from Netlify addresses to Amplify aliases and adds the ACM validation record.
4. Wait for the Amplify certificate/domain association. If any association, DNS, or stabilization step fails, the workflow restores the same record resources to Netlify before removing the failed association. The app-level domain rule keeps the apex canonical and sends a path/query-preserving 301 from `www` to the apex.
5. Repeat the complete production validation. Future DNS workflow runs retain the stack's existing `WebTarget` unless an explicit approved cutover override is supplied.

No WAF is provisioned. The contact endpoint instead uses DynamoDB-backed limits of 10 validation-compliant requests per caller and 100 requests globally per five-minute window before SES is called. The counters fail closed if DynamoDB is unavailable, expire automatically, and apply across all Amplify compute instances.

## Monitoring and logs

Amplify SSR logs are delivered to CloudWatch Logs through the Amplify service role with finite retention. Confirm that `/api/email` non-sending probes create runtime log events without exposing request bodies or credentials.

CloudWatch alarms monitor Amplify Hosting 5xx errors and latency/error signals. Missing data is non-breaching for this low-traffic site. Alarm actions publish to the SNS topic subscribed by `paul@diloreto.com`; the email subscription must be confirmed before cutover. Test notifications and alarm state transitions without sending a real contact-form email.

## Contact email validation

Routine tests cover GET 405/`Allow: POST` and invalid POST 400/413/415 cases only. Exactly one clearly labeled real contact-form message is sent through the Amplify default URL during pre-cutover validation and its receipt is recorded. Do not send another routine real message during cutover or deployment CI.

Amplify compute uses its least-privilege IAM role and the AWS SDK default credential provider chain. It can call only the required SES send action from `contact@sarabethbelon.com` when every recipient is `sarabethstudio@gmail.com`, plus `dynamodb:UpdateItem` on the contact rate-limit table; it cannot read Secrets Manager and has no static AWS key.

## Secret rotation

1. Create a mode-0600 temporary JSON file containing the new Contentful values.
2. Call `secretsmanager put-secret-value` with `file://...` and securely remove the file.
3. Trigger an Amplify release and verify production Contentful content.
4. Revoke the previous Contentful token only after the build succeeds.

No runtime restart is needed because Contentful credentials are build-only. Rotate the temporary Contentful Management token and GitHub authorization token by revoking them after their one-time use.

## Disaster recovery

- Recreate AWS resources from the CloudFormation templates in the verified production account. Bootstrap is applied manually; hosting/DNS/domain changes use the protected workflow after bootstrap.
- The Contentful secret and fixed-name log groups are retained on normal stack deletion. Import retained resources into a recovery stack, or deliberately rename them after preserving their data, rather than attempting a conflicting create.
- Restore the Contentful secret through an out-of-band mode-0600 file.
- Reauthorize the Amplify GitHub App with a temporary token and repopulate GitHub repository variables from stack outputs.
- Restore Route 53 records from the sanitized inventory and current stack template, never from copied SOA/NS records.
- Trigger a `main` release, validate the default Amplify URL, then attach the domain.
- If Amplify is unavailable while the retained Netlify site still exists, use the documented pre-decommission DNS rollback. After Netlify deletion, restore a previously validated source revision through `main` or recreate the app from CloudFormation.

## Decommissioning controls

After successful production validation, present approval gate 2 evidence before changing Netlify or the legacy key. Only after approval:

- unlink/delete the Netlify site, repository integration, DNS zone, environment variables, and build hooks;
- revoke temporary integration tokens;
- confirm the Route 53 delegation remains authoritative;
- audit the masked legacy key `AKIA************MJ7V`, verify no non-site usage, disable it, validate production, then delete it;
- remove all temporary raw exports and tokens securely.

The legacy key belongs to the administrator user `paul`, so its IAM attachment is not least privilege. Current last-use evidence is SES-only, but deletion requires explicit usage verification because the principal itself is not site-only.
