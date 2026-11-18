# Google Form Auto Filler website

React landing page with an interactive demo and tutorials. The Node.js Express server serves the production build and a read-only tutorials API.

## Run locally

Use Node.js 22.12+ (or a supported Node.js 20 release, starting at 20.19).

```sh
npm ci
npm test
npm run build
npm start
```

Open http://127.0.0.1:3000. Set `HOST` and `PORT` to override the default bind address and port.

For live editing, run `npm run dev:api` and `npm run dev` in separate terminals. Open the URL printed by Vite. Its development proxy expects Express at port 3000.

## API

- `GET /api/health` returns server status.
- `GET /api/guides` lists tutorials.
- `GET /api/guides/:id` returns one tutorial.

The site ships with the same tutorial content as the API so guides remain readable if the API is temporarily unavailable. The demo runs entirely in the page. This release has no account, billing, or Supabase setup.

## Project layout

The site uses feature folders, also called vertical slices. Each folder owns the components, content, and styles for one part of the site.

- `src/app/` assembles the page.
- `src/features/` contains the autofill demo, screenshots, tutorials, and FAQ.
- `src/shared/components.jsx` contains the shared button, section, and expandable panel.
- `server/features/guides/` contains the tutorial content and API routes.
