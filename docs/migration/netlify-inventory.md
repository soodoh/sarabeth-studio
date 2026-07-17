# Netlify-to-Amplify preflight inventory

Captured 2026-07-17 before repository changes. Raw Netlify API exports and browser artifacts are stored outside Git under `/tmp/sarabeth-amplify-migration` with restrictive permissions. No secret values appear below.

## Source and repository

- GitHub repository: `soodoh/sarabeth-studio` (public)
- Default branch: `main`; direct pushes allowed; no branch protection
- Local `main`: clean and one intentional commit ahead of `origin/main`
- Preserved local commit: `af073e0 fix: code review findings`
- Existing workflow: `.github/workflows/playwright.yaml`
- Existing GitHub Actions variables, secrets, and environments: none
- Generated route tree: `src/routeTree.gen.ts` (must not be edited)

## Verified production AWS account

- Explicit profile: `sarabeth-production`
- Account: `015989770400`
- Region for hosting, SES, secrets, and monitoring: `us-west-2`
- `sarabethbelon.com` is registered in this account through Amazon Registrar; auto-renew enabled; expiry 2027-06-30 PDT
- SES domain identity `sarabethbelon.com`: verified, DKIM successful, custom MAIL FROM `mail.sarabethbelon.com` successful
- `contact@sarabethbelon.com` is covered by the verified domain identity
- SES sending is enabled but the account remains in the sandbox (`ProductionAccessEnabled=false`); production-access approval is a migration blocker
- Existing GitHub OIDC providers: none
- Existing Amplify apps/candidate migration roles/secrets/SNS topics: none
- An old non-authoritative Route 53 zone exists (`Z33RTPCVC4GPAC`) with seven records. Its apex NS/SOA records incorrectly contain copied Netlify authority data and must not be reused as the production zone.

## Netlify site

- Site name: `sarabethbelon`
- Site ID: `d09a026c-bc0d-4898-8648-b3613726a7c5`
- Production URL/custom domain: `https://sarabethbelon.com`
- Repository: `https://github.com/soodoh/sarabeth-studio`, branch `main`
- Build: `yarn build`; publish directory `.next`; provider `github`; image `noble`
- Published deploy: Next.js production deploy from commit `783d200695050ca0381c72ffb7f44928b8a6bb50`, published 2026-01-06
- TLS forced; HTML pretty URLs enabled; HTML form detection ignored
- Build hook: `Contentful` on `main`
- Add-on/service instances: none
- Environment-variable names: `AWS_ACCESS`, `AWS_SECRET`, `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN`, `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`, `NEXT_PUBLIC_GOOGLE_ANALYTICS`
- Netlify integration hooks include deploy notifications and GitHub App status/comment hooks.

## Legacy AWS key

- Netlify `AWS_ACCESS` resolves to masked key `AKIA************MJ7V`
- IAM principal: user `paul`
- Key created 2022-10-03; status active; last-used service SES in `us-west-2` on 2026-07-15
- CloudTrail lookup history returned no events in the current 90-day event history
- Principal belongs to `Admins` with AWS managed `AdministratorAccess`; therefore the key is dangerously over-privileged and is not structurally site-only. Usage evidence currently indicates SES only, but decommissioning must not assume exclusivity without further audit.

## Authoritative Netlify DNS

Current registrar/authoritative nameservers:

- `dns1.p02.nsone.net`
- `dns2.p02.nsone.net`
- `dns3.p02.nsone.net`
- `dns4.p02.nsone.net`

Netlify API returned nine zone records:

| Host | Type | TTL | Priority | Value |
| --- | --- | ---: | ---: | --- |
| `sarabethbelon.com` | NETLIFY | 3600 | | `sarabethbelon.netlify.com` |
| `sarabethbelon.com` | NETLIFYv6 | 3600 | | `sarabethbelon.netlify.com` |
| `www.sarabethbelon.com` | NETLIFY | 3600 | | `sarabethbelon.netlify.com` |
| `www.sarabethbelon.com` | NETLIFYv6 | 3600 | | `sarabethbelon.netlify.com` |
| `mail.sarabethbelon.com` | MX | 3600 | 10 | `feedback-smtp.us-west-2.amazonses.com` |
| `mail.sarabethbelon.com` | TXT | 3600 | | `v=spf1 include:amazonses.com ~all` |
| `cdvixypkuk3bhikurkjjlpzhtdyvkxlu._domainkey.sarabethbelon.com` | CNAME | 3600 | | `cdvixypkuk3bhikurkjjlpzhtdyvkxlu.dkim.amazonses.com` |
| `f53nvk4kwn642ycmamvoee6qw4ukhofb._domainkey.sarabethbelon.com` | CNAME | 3600 | | `f53nvk4kwn642ycmamvoee6qw4ukhofb.dkim.amazonses.com` |
| `y7w6a6ou2nzlwdzd4dfkci5wxmkydzir._domainkey.sarabethbelon.com` | CNAME | 3600 | | `y7w6a6ou2nzlwdzd4dfkci5wxmkydzir.dkim.amazonses.com` |

Netlify's synthetic NETLIFY/NETLIFYv6 records resolve publicly to A and AAAA records. Netlify SOA/NS authority records are intentionally excluded from future Route 53 record imports.

## Live Netlify behavior baseline

| Request | Status/behavior |
| --- | --- |
| `/`, `/about`, `/contact`, `/engagements`, `/lessons`, `/media` | 200 |
| `/robots.txt`, `/sitemap.xml`, unknown route | 404 |
| GET `/api/email` | 405 |
| Invalid POST `/api/email` probes | 500 on the old Next.js deployment |
| `https://www.sarabethbelon.com/test/path?x=1` | 301 to `https://sarabethbelon.com/test/path?x=1` |

Observed headers include `Strict-Transport-Security: max-age=31536000` and `X-Content-Type-Options: nosniff`. The apex certificate covers `sarabethbelon.com` and `*.sarabethbelon.com`.

Desktop and mobile screenshots were captured for all six pages. Browser probes found no console errors. Two media-page audio requests appear as browser-aborted after metadata load but both assets successfully respond to ranged requests with `206 audio/mpeg`; the YouTube playlist iframe returns 200. Empty contact submission remains on `/contact`, leaves four invalid required fields, and sends no request. The lessons page's review link redirects successfully to its current Thumbtack destination. No Square booking link was present in the older live build; the TanStack build must still preserve its current external links.

## Lighthouse baseline

One Lighthouse 9.6.8 measurement was captured for each route/profile. Scores are performance/accessibility/best-practices/SEO:

| Profile/route | Scores |
| --- | --- |
| desktop `/` | 77 / 100 / 100 / 100 |
| desktop `/about` | 95 / 100 / 100 / 100 |
| desktop `/contact` | 85 / 98 / 100 / 100 |
| desktop `/engagements` | 88 / 100 / 100 / 100 |
| desktop `/lessons` | 84 / 97 / 100 / 100 |
| desktop `/media` | 95 / 91 / 92 / 100 |
| mobile `/` | 85 / 100 / 100 / 100 |
| mobile `/about` | 74 / 100 / 100 / 100 |
| mobile `/contact` | 76 / 98 / 100 / 100 |
| mobile `/engagements` | 77 / 97 / 100 / 100 |
| mobile `/lessons` | 89 / 97 / 100 / 100 |
| mobile `/media` | 86 / 91 / 92 / 100 |

The deployment policy must derive tolerances from these measurements and report Lighthouse regressions without triggering functional rollback.
