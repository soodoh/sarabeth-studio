# sarabeth-studio

Website for Sarabeth Belón's music studio, voice lessons, performances, media, Square booking, and SES-backed contact form.

Powered by TanStack Start, React, Contentful, AWS Amplify Hosting, and Amazon SES.

## Local development

Use the pinned Node and Bun versions from `.nvmrc` and `Dockerfile.playwright`:

```bash
bun install --frozen-lockfile
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

Contentful-backed production builds require server-only `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` values. Local development can load them from an ignored `.env` file. Never prefix them with `VITE_`, expose them to browser code, or commit them.

Normal local production builds use Nitro's Node server preset:

```bash
bun run build
bun run start
```

To produce the AWS Amplify deployment bundle:

```bash
NITRO_PRESET=aws-amplify bun run build
```

The ignored output is written to `.amplify-hosting/`. Amplify retrieves Contentful build credentials from AWS Secrets Manager. Runtime compute receives no Contentful secret and uses its IAM role—not static AWS keys—to send contact email through SES.

See [`docs/operations.md`](docs/operations.md) for deployment, CMS rebuild, rollback, DNS, monitoring, secret rotation, and disaster-recovery procedures.
