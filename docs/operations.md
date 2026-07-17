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

Termination protection is enabled on the bootstrap, hosting, and DNS stacks. The infrastructure workflow re-enables it for the stacks it manages. Disable it only during a reviewed recovery or decommissioning operation.

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

Pull requests and pushes run lint, type checking, a normal Node build, and Playwright. A successful push to `main` then assumes the narrow deployment role through GitHub OIDC and starts an Amplify `RELEASE` job. Amplify—not GitHub Actions—runs `amplify.yml`, fetches the Contentful secret with its build role, builds `.amplify-hosting`, and validates the deployment bundle.

Repository auto-builds and preview branches are disabled. Deployment concurrency allows only one production release. The workflow checks that the SHA is still current and rejects any concrete mismatched commit returned by `StartJob`. Manual Amplify `RELEASE` jobs report the literal `HEAD` rather than a Git SHA, so the Amplify build writes the checked-out `git rev-parse HEAD` to `__deployment.json`; post-deployment smoke testing requires that immutable value to equal the expected GitHub SHA.

Functional smoke tests run against the Amplify URL without sending email. A failed release wait, commit mismatch, or functional smoke test causes the workflow to retry the previously successful Amplify job, verify that rollback, and fail. The first successful production release has no predecessor; monitor it directly before relying on automatic rollback for later releases. Lighthouse CI runs only after functional checks; a Lighthouse regression fails/reports the workflow but never triggers rollback.

## CMS rebuilds

A CloudFormation custom resource manages the Amplify build webhook because CloudFormation has no native `AWS::Amplify::Webhook` resource. Its URL is configured in Contentful through a temporary Management API token. Publish and unpublish events invoke the webhook and start a production build on `main`. Webhook rotation creates the replacement first and returns a new physical ID; CloudFormation deletes the old webhook only after the replacement succeeds. The token is needed only to configure or rotate the Contentful webhook and must not be stored in Amplify, GitHub, or CloudFormation.

To test the integration, trigger one controlled Contentful publish/unpublish event, record the resulting Amplify job ID and commit, wait for success, then restore the entry if necessary. Do not include the webhook URL in public logs even though it is not an AWS credential.

## Rollback

### Deployment rollback

Find the last successful job for `main`, then use Amplify's `RETRY` job type for that job ID. Wait for completion and run the non-sending functional smoke suite. The deployment workflow performs this automatically for release-validation and functional failures, but not for Lighthouse-only failures.

### CloudFormation rollback recovery

Inspect stack events before taking action. For `UPDATE_ROLLBACK_FAILED`, repair the minimum failed permission or resource first, then run `cloudformation continue-update-rollback`; skip a resource only when its live state is understood and the next reviewed update will reconcile the drift. Reapply the checked-in template through the protected infrastructure workflow and run drift detection afterward. Never delete a stack merely to clear a rollback state.

### DNS rollback before Netlify deletion

Before cutover, record the exact Netlify apex and `www` answers and the registrar's four NS values. If production validation fails while Netlify remains available, dispatch the protected infrastructure workflow with `rollback_to_netlify=true`. It removes the Amplify domain association first and then declaratively restores the captured Netlify A/AAAA records. Wait for TTL expiry and rerun the status/header/visual checks. Do not delete the Netlify site or zone until approval gate 2. A failed domain-association deployment automatically restores `WebTarget=Netlify` before failing the workflow.

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
3. Dispatch the protected infrastructure workflow with the approval confirmation. It changes the DNS stack's `WebTarget` parameter from `Netlify` to `Amplify`, removing only the temporary Netlify A/AAAA records, then applies the domain stack. The Amplify domain association declaratively manages the replacement aliases.
4. Wait for the Amplify certificate/domain association. The app-level domain rule keeps the apex canonical and sends a path/query-preserving 301 from `www` to the apex.
5. Repeat the complete production validation. Future DNS workflow runs retain the stack's existing `WebTarget` unless an explicit approved cutover override is supplied.

No WAF is provisioned.

## Monitoring and logs

Amplify SSR logs are delivered to CloudWatch Logs through the Amplify service role with finite retention. Confirm that `/api/email` non-sending probes create runtime log events without exposing request bodies or credentials.

CloudWatch alarms monitor Amplify Hosting 5xx errors and latency/error signals. Missing data is non-breaching for this low-traffic site. Alarm actions publish to the SNS topic subscribed by `paul@diloreto.com`; the email subscription must be confirmed before cutover. Test notifications and alarm state transitions without sending a real contact-form email.

## Contact email validation

Routine tests cover GET 405/`Allow: POST` and invalid POST 400/413/415 cases only. Exactly one clearly labeled real contact-form message is sent through the Amplify default URL during pre-cutover validation and its receipt is recorded. Do not send another routine real message during cutover or deployment CI.

Amplify compute uses its least-privilege IAM role and the AWS SDK default credential provider chain. It can call only the required SES send actions from `contact@sarabethbelon.com`; it cannot read Secrets Manager and has no static AWS key.

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
- If Amplify is unavailable while the retained Netlify site still exists, use the documented pre-decommission DNS rollback. After Netlify deletion, restore a prior successful Amplify job or recreate the app from CloudFormation.

## Decommissioning controls

After successful production validation, present approval gate 2 evidence before changing Netlify or the legacy key. Only after approval:

- unlink/delete the Netlify site, repository integration, DNS zone, environment variables, and build hooks;
- revoke temporary integration tokens;
- confirm the Route 53 delegation remains authoritative;
- audit the masked legacy key `AKIA************MJ7V`, verify no non-site usage, disable it, validate production, then delete it;
- remove all temporary raw exports and tokens securely.

The legacy key belongs to the administrator user `paul`, so its IAM attachment is not least privilege. Current last-use evidence is SES-only, but deletion requires explicit usage verification because the principal itself is not site-only.
