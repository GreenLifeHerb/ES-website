# Essence Source Static Website

Static multi-page website for `essencesourceusa.com`, built with native HTML, CSS, and JavaScript for a U.S. B2B botanical ingredients company.

## What is included

- Responsive multi-page marketing and inquiry site
- Desktop mega menu and mobile drawer navigation
- Data-driven product listing from `assets/data/products.json`
- Product filters by category, application, and stock tag
- Three product detail example pages with shared rendering logic
- Front-end inquiry form validation with placeholder `fetch` integration
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

## Content and handoff notes

- Shared site chrome and reusable text live in [site-content.js](</D:/work/projects/ES website/es-website/assets/data/site-content.js>).
- Product content is centralized in [products.json](</D:/work/projects/ES website/es-website/assets/data/products.json>).
- FAQ content is centralized in [faqs.json](</D:/work/projects/ES website/es-website/assets/data/faqs.json>).
- Inquiry submission currently runs in front-end mock mode and is ready for a future real `fetch` endpoint.
- Missing business details are intentionally written as `Available by Inquiry`.
