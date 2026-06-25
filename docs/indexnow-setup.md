# IndexNow Setup

Last updated: 2026-06-04

Essence Source has a ready-to-run IndexNow submission script at `infra/scripts/ping-indexnow.js`.

## What is already in the repo

- API key file: `a3b7d82b4c1a47f9a1f2e8b6c4d7f5e3.txt`
- Public key URL: `https://essencesourceusa.com/a3b7d82b4c1a47f9a1f2e8b6c4d7f5e3.txt`
- Submit command: `npm run seo:indexnow`
- Submitted host: `essencesourceusa.com`
- Submitted URLs: all root-level `.html` files, with `index.html` submitted as `/`

## Pre-submit checks

Run these checks before pinging IndexNow:

```bash
npm run seo:validate
node infra/scripts/generate-sitemap.js --check
curl -I https://essencesourceusa.com/a3b7d82b4c1a47f9a1f2e8b6c4d7f5e3.txt
```

The key URL should return `200 OK`.

## Submit URLs

After a content update is deployed, run:

```bash
npm run seo:indexnow
```

Successful responses are usually `200` or `202`. If an endpoint returns an error, retry after confirming that the key file is reachable on the live domain.

## Recommended operating rhythm

- Run after major content updates, new pages, sitemap changes, or product-page revisions.
- Do not run repeatedly for the same unchanged pages in a short period.
- Keep Google Search Console submission separate; IndexNow mainly helps participating engines such as Bing.
