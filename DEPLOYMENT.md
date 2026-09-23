# Deploy the MOVE / home-visits site

The source of truth is the root `index.html` and its linked assets. Local ports
are preview servers, not separate deployable builds.

Run `npm run build`. The build validates the MOVE hero, home-visits-only content,
script syntax and required assets, then copies the site into `dist/`. It does
not publish unrelated documents, source notes, or component examples.

`vercel.json` sets framework to Other (`null`), build command to `npm run build`,
and output directory to `dist`. In Vercel, the project's Root Directory must
point to this repository root (the directory containing `vercel.json`). The
connected Git repository and production branch must match the branch you push.

Commit and push all changed site files, `scripts/build-site.cjs`, `package.json`,
`vercel.json`, and `.gitignore`. Do not commit `dist`; Vercel generates it.

For an exact production-output preview:

```sh
npm run build
python -m http.server 8766 --bind 127.0.0.1 --directory dist
```

Open http://localhost:8766/ . Use Ctrl+Shift+R to discard a cached earlier page.
Port 8765 is currently serving `dist/` as well. After editing source files, run
`npm run build` again to update that preview.
