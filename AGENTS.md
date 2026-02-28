# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Quirkle is a React-based quiz/flashcard learning platform with spaced repetition. It has two npm packages:

- **Root** (`/workspace`): React 19 frontend (CRA) + Express/WebSocket server for the Study Room feature
- **`quirkle-functions/`**: Firebase Cloud Functions for Stripe subscription management

### Running the app

- `npm run dev` — starts both the WebSocket server (port 8080) and React dev server (port 3000) concurrently via `concurrently`
- `npm start` — starts only the React dev server (port 3000)
- `npm run server` — starts only the WebSocket server (port 8080) via nodemon

### Linting

- Root: `npm run lint` (uses `eslint.config.mjs` flat config). Pre-existing lint errors exist due to JSX parsing issues in the flat config (missing babel parser); the CRA-internal eslint config in `package.json` → `eslintConfig` handles JSX correctly during `npm run build`.
- Functions: `cd quirkle-functions && npm run lint` (clean)

### Testing

- `CI=true npm test` runs Jest via react-scripts. The default `App.test.js` is the CRA boilerplate and has a pre-existing failure (module resolution issue with `react-router-dom` v7 and the Jest version bundled in react-scripts 5.0.1).
- Cypress E2E tests: `npm run cypress:run` (requires the app running on port 3000)

### Building

- `CI='' npm run build` — the `CI=''` prefix prevents CRA from treating lint warnings as errors.

### Environment variables

- The React app requires `REACT_APP_FIREBASE_*` env vars (see `.github/workflows/deploy.yaml` for the full list). Copy `.env.example` to `.env` and add Firebase config values. Placeholder values allow the dev server to start, but Firebase operations will fail at runtime.
- `quirkle-functions/` needs Stripe keys — copy `quirkle-functions/.env.example` to `quirkle-functions/.env`.

### Known issues

- The WebSocket server (`server.js`) crashes on Node 22 with `TypeError: WebSocket.Server is not a constructor` — this is a pre-existing ESM import issue with the `ws` library. The React dev server starts fine regardless since `concurrently` runs them independently.
- `npm run build` produces lint warnings but succeeds (the `CI=''` prefix is used in CI to avoid treating warnings as errors).
