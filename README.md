# sarabeth-studio

Website for Sarabeth Belón's music studio, voice lessons, performances, media, Square booking, and SES-backed contact form.

Powered by TanStack Start, React, Contentful, AWS Amplify Hosting, Amazon SES, and the YouTube Data API v3.

## Local development

Use the pinned Node and Bun versions from `.nvmrc` and `Dockerfile.playwright`:

```bash
bun install --frozen-lockfile
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

Contentful-backed production builds require server-only `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` values. The runtime YouTube playlist endpoint reads its key from the SSM parameter named by `YOUTUBE_API_KEY_PARAMETER`; local development may instead use the server-only `YOUTUBE_API_KEY` fallback. Local values can be loaded from an ignored `.env` file. Never prefix secrets with `VITE_`, expose them to browser code, log them, or commit them.

Normal local production builds use Nitro's Node server preset:

```bash
bun run build
bun run start
```

To produce the AWS Amplify deployment bundle:

```bash
NITRO_PRESET=aws-amplify bun run build
```

The ignored output is written to `.amplify-hosting/`. Amplify receives only non-secret identifiers and parameter names as branch configuration. The build role retrieves the build-only Contentful token; runtime compute can retrieve only the exact YouTube key parameter and uses the AWS SDK default credential provider chain—not static AWS keys—for SSM, SES, and DynamoDB.

`/media` remains prerendered and static. After hydration, its client wrapper calls `/api/youtube-playlist`; that compute route queries only the configured playlist and returns normalized public video metadata. The API key is never bundled into React or accepted from the browser. Playwright intercepts the endpoint with [`tests/fixtures/youtube-playlist.json`](tests/fixtures/youtube-playlist.json), so CI never calls Google or SSM.

See [`docs/operations.md`](docs/operations.md) for deployment ordering, CMS rebuild, rollback, DNS, monitoring, quota, secret rotation, and disaster-recovery procedures. [`docs/privacy-policy.md`](docs/privacy-policy.md) records the owner-approved YouTube disclosure published at `/privacy`; it is not legal advice.
