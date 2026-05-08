# Essence Source Static Website

Static multi-page website for `essencesourceusa.com`, built with native HTML, CSS, and JavaScript for a U.S. B2B botanical ingredients company.

## What is included

- Responsive multi-page marketing and inquiry site
- Desktop mega menu and mobile drawer navigation
- Data-driven product listing from `assets/data/products.json`
- Product filters by category, application, and stock tag
- Three product detail example pages with shared rendering logic
- Front-end inquiry form validation with live API wiring for `POST /api/public/inquiries`
- FAQ accordion, legal pages, and custom `404.html`
- Playwright end-to-end tests

## Project structure

```text
project/
  index.html
  products.html
  product-green-coffee.html
  product-black-ginger.html
  product-artichoke.html
  brand-ingredients.html
  applications.html
  warehouse.html
  quality.html
  partner.html
  about.html
  resources.html
  contact.html
  privacy.html
  terms.html
  cookies.html
  accessibility.html
  404.html
  package.json
  package-lock.json
  server.js
  playwright.config.js
  /tests
  /assets
    /css
    /js
    /img
    /data
```

## Commands

```bash
npm install
npm run dev
npm run format
npm run test:e2e
```

`npm run dev` starts a lightweight Node static server on `http://127.0.0.1:4173`.

To forward inquiry submissions from the static site to a deployed Strapi backend, set:

```bash
INQUIRY_API_URL=https://your-strapi-domain.com/api/public/inquiries
```

and then start the site server. The site server will proxy `POST /api/public/inquiries` to that backend URL.

## Content and handoff notes

- Shared site chrome and reusable text live in [site-content.js](</D:/work/projects/ES website/es-website/assets/data/site-content.js>).
- Product content is centralized in [products.json](</D:/work/projects/ES website/es-website/assets/data/products.json>).
- FAQ content is centralized in [faqs.json](</D:/work/projects/ES website/es-website/assets/data/faqs.json>).
- Inquiry submission is wired for a live backend. Set `window.ESSENCE_SOURCE_CONTENT.api.baseUrl` for cross-domain posting, or set `INQUIRY_API_URL` on the static site server to proxy requests server-side.
- Missing business details are intentionally written as `Available by Inquiry`.
