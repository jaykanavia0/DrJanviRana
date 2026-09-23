Glyph Portal is adapted from `newcomponent.txt` for the site's native HTML runtime.
The supplied ink measurement, SVG clipping, scroll camera,
resize handling and accessibility fallbacks are retained. Letter selection is disabled
for a simpler opening, and the word is capped at 880px wide and 190px tall. The opening word and
care content live in `index.html`; layout lives in `css/glyph-portal.css`.

Edit `js/glyph-portal.ts`, then rebuild its dependency-free browser script:

```sh
npx --yes esbuild js/glyph-portal.ts --outfile=js/glyph-portal.js --target=es2020 --format=iife
```

Short viewports and reduced-motion preferences use a static opening and show
the care section immediately below. Without JavaScript, the opening word and
care content remain visible.

Glyph Portal © 2026 Christian Katzmann. MIT.
Origin: UsefulPortal.astro on https://ktzm.dk → UsefulPortal.tsx → ClarityPortal.tsx.
