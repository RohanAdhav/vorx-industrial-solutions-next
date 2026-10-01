# Vorx Industrial Solutions (Next.js)

Next.js 16 (App Router, TypeScript, plain CSS). No UI libraries; all pages are statically prerendered.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Deploy on Vercel: import the repo and set `NEXT_PUBLIC_SITE_URL` (e.g. `https://vorxindustrial.com`) so canonical URLs, sitemap, robots and structured data use the real domain.

## Structure
- `app/page.tsx` home (server component), `app/floor-visualiser/page.tsx` visualiser page
- `app/globals.css` the approved design CSS, ported 1:1
- `components/Visualiser.tsx` + `lib/floorEngine.ts` canvas tool
- `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, JSON-LD on each page

## Client change requests
1. **Font**: Arial, Helvetica, sans-serif. Hero h1 = bold, `clamp(45px,7vw,82px)`, line-height .98, letter-spacing -.055em, max-width 820px, 48px on mobile (`--sans` in globals.css).
2. **Hero circle**: the client's `.hero::after` CSS is used verbatim; the old `::before`/`::after` circles were removed.
3. **Canvas quality**: a full-resolution off-screen `work` canvas (max 2400px) plus an on-screen canvas rendered at CSS size x devicePixelRatio with step-down resampling. Download exports the full-res canvas.
