# Repository Guidelines

## Project Structure & Module Organization

- `src/routes/`: TanStack Start file routes (`about`, `lessons`, `media`, etc.) and server route handlers (for example `src/routes/api.email.ts`).
- `src/router.tsx`: TanStack Router instance; `src/routeTree.gen.ts` is generated and must not be edited manually.
- `components/`: Reusable React components, organized by feature; shared UI primitives live in `components/ui/`.
- `utils/`: External integrations and data shaping (`contentful.ts`, `fetchers/*`, `types/*`).
- `styles/`: Global styling (`styles/globals.css`).
- `public/`: Static assets (favicons and images).
- `lib/`: Small shared helpers (`lib/utils.ts`).

## Build, Test, and Development Commands

- `bun dev`: Start local dev server at `http://localhost:3000`.
- `bun build`: Create production build.
- `bun start`: Run the production server locally.
- `bun lint`: Run Biome across the repository.
- `bun lint:fix`: Auto-fix lint issues where possible.

## Coding Style & Naming Conventions

- Language: TypeScript + React function components.
- Indentation: 2 spaces; keep files Prettier-friendly.
- Components use PascalCase folders/files with `index.tsx` (example: `components/Header/index.tsx`).
- Route segments use lowercase names in `src/routes/`.
- Use path alias imports (`@/...`) for cross-folder imports.
- Keep imports sorted and grouped consistently.

## Testing Guidelines

- Playwright coverage lives under `tests/`.
- Minimum verification is `bun lint`, then `docker compose -f compose.playwright.yaml run --build --rm playwright` for affected browser behavior.
- For new tests, prefer colocated `*.test.ts` or `*.test.tsx` files near the code they cover.

## Commit & Pull Request Guidelines

- Commits must follow Conventional Commits with no scope (`scope-empty` is enforced in commitlint).
- Format: `type: summary`.
- Examples: `feat: add form validation`, `fix: handle missing asset fields`.
- PRs should include: concise description, linked issue (if any), test steps, and screenshots for UI changes.

## Security & Configuration Tips

- Keep secrets in `.env` only; never commit credentials.
- Required environment variables include server-only Contentful keys (`CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`) and SES credentials (`AWS_ACCESS`, `AWS_SECRET`).
