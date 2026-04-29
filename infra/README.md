# Essence Source Deployment, SEO, and Performance

This folder contains the production deployment and verification layer for the Essence Source B2B botanical ingredients website.

## Architecture

Recommended path:

- `web`: Nginx serves the static multi-page frontend, `sitemap.xml`, `robots.txt`, optimized images, and 404 page.
- `cms`: Strapi runs as the headless CMS/API for products, inquiries, inventory snapshots, FAQs, resources, and partner content.
- `postgres`: PostgreSQL stores CMS content and inquiry records.

Alternative path:

- Host the static frontend on a CDN platform such as Cloudflare Pages, Netlify, Vercel static output, or S3 + CloudFront.
- Deploy Strapi and PostgreSQL separately on a container host or managed platform.
- Keep the same SEO scripts in CI so sitemap, robots, JSON-LD validation, and Lighthouse checks remain portable.

## First Deploy

From `infra/`:

```bash
cp .env.example .env
docker compose up -d
```

From the project root:

```bash
node infra/scripts/generate-sitemap.js
node infra/scripts/generate-robots.js
node infra/scripts/optimize-images.js
bash infra/scripts/deploy.sh
npm run lighthouse
```

The generated files are written to the static web root:

- `sitemap.xml`
- `robots.txt`
- optimized images under `assets/img/optimized/`

## Required Commands

```bash
docker compose up -d
node scripts/generate-sitemap.js
node scripts/generate-robots.js
node scripts/optimize-images.js
bash scripts/deploy.sh
npm run lighthouse
```

When running the script commands exactly as above, execute them from `infra/`. When running from the project root, prefix scripts with `infra/`.

## SEO System

### Sitemap

`scripts/generate-sitemap.js` reads:

- the static route allowlist for core pages
- optional CMS products from `CMS_API_URL=/api/public/products`

It outputs canonical production URLs for:

- home
- products
- product details
- warehouse
- quality
- GL Herb partner page
- contact
- resources
- legal pages

### Robots

`scripts/generate-robots.js` allows public pages and blocks:

- `/admin`
- `/api/internal`
- `/backend`
- `/infra`
- `/node_modules`
- `/test-results`

It always writes the configured sitemap URL.

### Meta and Canonical

Each public page should include:

- `<title>`
- meta description
- `rel="canonical"`
- Open Graph title, description, type, and URL
- Twitter Card title and description

Defaults live in `seo/meta-defaults.json`.

### Hreflang

The system is ready for multilingual alternates. If `/en` and `/zh` are enabled later, each language page should output reciprocal alternates plus `x-default`.

Example:

```html
<link rel="alternate" hreflang="en" href="https://essencesourceusa.com/en/" />
<link rel="alternate" hreflang="zh" href="https://essencesourceusa.com/zh/" />
<link rel="alternate" hreflang="x-default" href="https://essencesourceusa.com/" />
```

## Structured Data

Templates live in `seo/`:

- `organization-schema.json`
- `product-schema-template.js`
- `faq-schema-template.js`
- `breadcrumb-schema-template.js`

Implemented page mapping:

- Home: `Organization`
- Product pages: `Product` + `BreadcrumbList`
- Resources: `FAQPage`
- Contact: `Organization` with `ContactPoint`

The Product template intentionally avoids retail pricing and checkout fields. Unknown values should remain `未指定`, `Available by Inquiry`, `null`, or an empty array.

## Product JSON-LD Example

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Green Coffee Bean Extract",
  "description": "Standardized green coffee ingredient for supplement and beverage development with documentation-ready supply.",
  "sku": "green-coffee-bean-extract",
  "brand": {
    "@type": "Brand",
    "name": "Essence Source"
  },
  "category": "Botanical Extracts",
  "url": "https://essencesourceusa.com/product-green-coffee.html",
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Documentation available",
      "value": "COA, TDS, SDS"
    }
  ]
}
```

## Image Optimization

`scripts/optimize-images.js` uses `sharp` to generate:

- WebP outputs
- JPEG fallbacks
- widths: `480`, `768`, `1200`

Example HTML pattern:

```html
<picture>
  <source
    type="image/webp"
    srcset="assets/img/optimized/product-green-coffee-480.webp 480w, assets/img/optimized/product-green-coffee-768.webp 768w"
    sizes="(max-width: 700px) 90vw, 420px"
  />
  <img
    src="assets/img/optimized/product-green-coffee-768.jpg"
    alt="Green coffee bean extract ingredient visual"
    loading="lazy"
    width="768"
    height="512"
  />
</picture>
```

## Performance Defaults

- Nginx caches static assets for one year with `immutable`.
- HTML stays no-cache friendly by default.
- Gzip is enabled in Nginx.
- Brotli should be enabled at CDN or edge proxy level, or by swapping to an Nginx image with the Brotli module.
- JavaScript is already split by page purpose and loaded with `defer`.
- Images default to lazy loading in page markup.
- The static pages use system font stacks by default. Add web fonts only after measuring the LCP impact, and prefer self-hosted `woff2` files with `font-display: swap`.

## Lighthouse Targets

Configured in `lighthouserc.json`:

- Performance >= 90
- Accessibility >= 95
- Best Practices >= 95
- SEO >= 95

Run:

```bash
npm run lighthouse
```

## Health Checks

- Nginx: `GET /healthz` returns `ok`.
- Strapi service: Docker healthcheck calls `/api/public/site-settings`.
- PostgreSQL: Docker healthcheck uses `pg_isready`.

Suggested external uptime checks:

- `https://essencesourceusa.com/healthz`
- `https://essencesourceusa.com/sitemap.xml`
- `https://essencesourceusa.com/api/public/site-settings`

## Redirects, 404, and Headers

Nginx examples are implemented in `nginx/default.conf`:

- `www.essencesourceusa.com` redirects to `https://essencesourceusa.com`
- missing pages render `/404.html`
- static assets get `Cache-Control`
- hidden files and internal folders are denied
- security headers include `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Content-Security-Policy`

## Backups and Restore

From `infra/`:

```bash
bash scripts/backup-db.sh
bash scripts/restore-db.sh ./backups/essence-source-YYYYMMDD-HHMMSS.sql
```

Keep database backups off the application server after creation.

## CI/CD

Workflows are provided in both:

- `infra/.github/workflows/`
- `.github/workflows/`

The root `.github` copy is what GitHub executes. The `infra/.github` copy is kept to match the requested infrastructure bundle.

CI runs:

- install dependencies
- install Playwright Chromium
- generate sitemap and robots
- validate structured data
- run Playwright tests
- run Lighthouse CI

Deploy workflow expects these secrets:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PATH`

## Validation Checklist

Automated coverage includes:

1. `sitemap.xml` exists and contains key URLs
2. `robots.txt` exists and declares sitemap
3. product page has Product JSON-LD
4. resources page has FAQPage JSON-LD
5. canonical is non-empty
6. all static images have alt text
7. image optimizer generates WebP
8. Lighthouse thresholds are configured
9. 404 page is reachable
10. Nginx static asset cache headers are configured
11. robots blocks admin/internal paths
12. hreflang pairs are checked when enabled
