# Playwright tests

The Playwright server uses the committed Contentful fixture in
`tests/fixtures/contentful` and the public playlist response fixture in
`tests/fixtures/youtube-playlist.json`. Its explicit Vite configuration aliases
the production Contentful provider and current-date modules to deterministic
test implementations; canonical production builds exclude fixture code. Browser
contexts intercept `/api/youtube-playlist`, YouTube thumbnails, and activated
iframes, so CI never contacts Google or SSM. Focused contract tests run every
Contentful fetcher against raw entry-shaped data, while browser routes intercept
the fixture's absolute image and audio URLs to exercise production media markup.

CMS-backed server functions use TanStack's static-function middleware. Their
build-time results are emitted as static assets, so client-side navigation does
not introduce a runtime Contentful dependency. The Playwright launcher gives
build and production-server children an allowlisted environment and binds to
loopback.

Run tests in the same ARM64 Linux/Chromium environment used by CI:

```sh
docker compose -f compose.playwright.yaml run --build --rm playwright
```

`bun run test:e2e` uses `--update-snapshots=none` and cannot create or update
baselines. After an intentional, reviewed UI change, the only recording command
is:

```sh
docker compose -f compose.playwright.yaml run --build --rm playwright bun run test:e2e:update
```

Refresh the Contentful fixture intentionally with real Contentful variables in
`.env`. The recorder retains live CDN URLs, validates each downloaded WebP,
creates one ID-named synthetic WAV per audio asset, validates the staged fixture,
and swaps it into place while retaining the previous fixture for rollback:

```sh
bun run contentful:snapshot
docker compose -f compose.playwright.yaml run --build --rm playwright bun run test:e2e:update
```

Visual baselines should only be recorded in the container so host font and
browser differences do not enter screenshots.
