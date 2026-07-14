---
name: Krynn Tools Port
description: Lessons from porting Krynn Tools Next.js app to Replit Vite artifact
---

# Krynn Tools — Next.js → Vite conversion

## Key patterns used

**Routing:** wouter `Switch`/`Route`/`useParams`. `import.meta.glob('./app/**/page.tsx')` discovers all pages; a `Map` cache avoids recreating `lazy()` on each render.

**Why:** App has 150+ pages. Glob + lazy avoids listing every route; the cache ensures stable component identity across renders (React requires this for Suspense).

**How to apply:** `CategoryOrSlugRoute` checks `pageModules[./app/${slug}/page.tsx]` first (explicit category pages), falls back to `./app/[slug]/page.tsx` for the generic listing.

## Async component fix
Next.js had server components (`export default async function CategoryPage({ params })`). In Vite these cause React 19 "async client component" errors. **Fix:** remove `async`, use `useParams()` from wouter instead of awaiting `params`.

**Why:** React 19 rejects async client components; the error is thrown at render time.

**How to apply:** Any page.tsx with `async function` or `await params` must be converted to sync + `useParams()`.

## Explicit category pages
`app/pdf/page.tsx`, `app/image/page.tsx`, etc. originally called `<CategoryPageComponent params={Promise.resolve({ slug })} />`. After the port: each passes `slug` as a plain string prop to a sync `CategoryPage` component.

## Mass replacement (Node.js)
Script at `/tmp/fix_nextjs.mjs` handled 318 files:
- `import Link from "next/link"` → `import { Link } from "wouter"`
- `import dynamic from "next/dynamic"` → remove + `lazy` to react import
- `dynamic(` → `lazy(`
- Remove: `"use client"`, Metadata imports, metadata exports, generateStaticParams, generateMetadata

## CSS
`src/index.css` replaced entirely with Krynn's design system (from `src/app/globals.css`) + `@import "tw-animate-css"` + `@plugin "@tailwindcss/typography"`.
`src/app/globals.css` kept for reference but `index.css` is now canonical.

## Font
`index.html` uses Google Fonts `<link>` for Plus Jakarta Sans (weights 300–800, normal+italic). Dark mode FOUC prevention inline script added.

## Missing deps installed
`pdfjs-dist` and `tesseract.js` were missing from initial copy — installed via `pnpm add`.
