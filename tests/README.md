# Playwright tests

The test server is built with the committed Contentful snapshot and local image,
audio, and font assets. The application selects the snapshot once at its data
boundary; the individual Contentful fetchers remain live-only. This keeps page
content and rendering independent from live Contentful updates and external font
delivery.

Run tests in the same ARM64 Linux/Chromium environment used by CI:

```sh
docker compose -f compose.playwright.yaml run --rm playwright
```

Create or update Linux screenshot baselines after an intentional UI change:

```sh
docker compose -f compose.playwright.yaml run --rm playwright bun run test:e2e:update
```

Refresh the Contentful snapshot intentionally (requires the Contentful variables
in `.env`), review the resulting content/assets, and then regenerate screenshots.
The recorder validates the data and assets, publishes them under a content-based
version, and atomically switches `public/contentful-snapshot/manifest.json` only
after the new version is complete:

```sh
bun run contentful:snapshot
docker compose -f compose.playwright.yaml build playwright
docker compose -f compose.playwright.yaml run --rm playwright bun run test:e2e:update
```

Local `bun run test:e2e` is useful for debugging, but visual baselines should only
be recorded in the container so host OS font and browser rendering differences
do not enter the snapshots.
