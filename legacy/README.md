# Quirkle legacy app

This folder preserves the app as it existed before the August 2026 redesign.

From the repository root:

```bash
npm run start:0
```

The legacy app runs on [http://localhost:3001](http://localhost:3001). The new
app runs with `npm start` on port 3000, so both can be open at the same time.

The legacy app uses the root project's dependencies and links to the root
`.env` file for the existing Firebase configuration.
