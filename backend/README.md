# Essence Source Backend

Strapi + PostgreSQL backend for the Essence Source B2B botanical ingredients website. This backend is designed for a content-led company site and inquiry workflow, not retail checkout.

## Stack

- Node.js 20+
- Strapi 5
- PostgreSQL
- Optional Redis profile in Docker Compose
- Nodemailer-compatible email adapter
- Jest + Supertest for API tests

As of April 27, 2026, this scaffold pins to Strapi `5.42.1`, matching the latest stable release line surfaced by the official Strapi GitHub releases page. If your registry mirrors a newer compatible 5.x patch, upgrading within Strapi 5 should be straightforward.

## Features

- CMS-managed products, categories, branded ingredients, warehouse locations, partner profile, FAQs, resources, and site settings
- Public API layer shaped for frontend consumption
- Internal inventory sync, certification import, inquiry export, and revalidation placeholder endpoints
- Server-side validation for inquiries
- Honeypot and in-memory rate limit placeholder for POST endpoints
- Seed scripts for categories, products, GL Herb partner content, FAQs, and settings
- CSV/JSON inventory sync script
- i18n-ready content model structure

## File Map

```text
backend/
  package.json
  README.md
  .env.example
  docker-compose.yml
  /config
  /database
  /src
    /api
    /components
    /extensions
    /middlewares
    /policies
    /utils
  /scripts
    _bootstrap-strapi.js
    seed.js
    inventory-sync.js
    partner-seed.js
  /sample-data
    inventory.json
  /tests
    /helpers
    product.spec.js
    inquiry.spec.js
    inventory-sync.spec.js
```

## Environment

1. Install dependencies:

```bash
npm install
```

2. Create your env file:

```bash
cp .env.example .env
```

3. Start PostgreSQL:

```bash
docker compose up -d postgres
```

4. Run Strapi in development:

```bash
npm run develop
```

5. Seed example content:

```bash
npm run seed
```

6. Sync sample inventory:

```bash
npm run inventory:sync -- ./sample-data/inventory.json
```

7. Run tests:

```bash
npm test
```

## Public API

- `GET /api/public/site-settings`
- `GET /api/public/categories`
- `GET /api/public/products`
- `GET /api/public/products/:slug`
- `GET /api/public/brand-ingredients`
- `GET /api/public/warehouse`
- `GET /api/public/partner/gl-herb`
- `GET /api/public/faqs`
- `POST /api/public/inquiries`

### Product list filters

`GET /api/public/products?category=botanical-extracts&application=Dietary%20Supplements&warehouse_status=in_us_stock&tag=us-warehouse&locale=en`

## Internal API

- `POST /api/internal/inventory/sync`
- `POST /api/internal/certifications/import`
- `POST /api/internal/revalidate`
- `GET /api/internal/inquiries/export`

Pass the internal key with either:

- `x-internal-api-key: <INTERNAL_API_KEY>`
- `Authorization: Bearer <INTERNAL_API_KEY>`

## Content Models

Implemented content types:

1. `ProductCategory`
2. `Product`
3. `BrandedIngredient`
4. `WarehouseLocation`
5. `Certification`
6. `PartnerProfile`
7. `Inquiry`
8. `InventorySnapshot`
9. `Resource`
10. `FAQ`
11. `SiteSettings`

### Notes

- `warehouse_status` is limited to `in_us_stock`, `available_by_inquiry`, `pilot_lot_available`, `made_to_order`.
- Product content avoids disease-treatment fields and claims.
- Documentation is modeled as document type availability plus optional links, not assumed downloadable assets for every SKU.
- GL Herb content is stored in CMS records and seeded locally. There is no runtime dependency on scraping `gl-herb.com`.
- Public inquiry uses honeypot + rate limiting. Internal POST endpoints use API key + rate limiting placeholders so they can later move to Redis or edge enforcement without changing the controller contract.

## Seed Scripts

### `npm run seed`

Seeds:

- product categories
- warehouse locations
- certifications
- GL Herb partner profile
- example products
- branded ingredients
- FAQs
- resources
- site settings

### `npm run seed:partner`

Seeds or updates the `gl-herb` partner profile only.

### `npm run inventory:sync -- ./sample-data/inventory.json`

Accepts JSON or CSV.

JSON example:

```json
{
  "warehouse": "US-East",
  "items": [
    {
      "sku": "GCBE-50-HPLC",
      "slug": "green-coffee-bean-extract",
      "status": "in_us_stock",
      "lead_time": "2-5 business days"
    }
  ]
}
```

CSV columns:

```text
warehouse,sku,slug,status,lead_time,updated_at
US-East,GCBE-50-HPLC,green-coffee-bean-extract,in_us_stock,2-5 business days,2026-04-27T00:00:00.000Z
```

## Key Implementation Snippets

### 1) Product content type schema

File: `src/api/product/content-types/product/schema.json`

```json
{
  "attributes": {
    "name": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "name", "required": true },
    "warehouse_status": {
      "type": "enumeration",
      "enum": ["in_us_stock", "available_by_inquiry", "pilot_lot_available", "made_to_order"]
    }
  }
}
```

### 2) Inquiry validation schema

File: `src/utils/inquiry-validation.js`

```js
if (!INQUIRY_TYPES.includes(payload.inquiry_type)) {
  errors.inquiry_type = "inquiry_type must be one of contact, quote, sample, docs.";
}

if (payload.consent !== true) {
  errors.consent = "consent must be accepted.";
}
```

### 3) Inventory sync controller/service

File: `src/api/inventory-snapshot/services/inventory-sync.js`

```js
await strapi.db.query("api::product.product").update({
  where: { id: product.id },
  data: {
    warehouse_status: item.status,
    lead_time: item.lead_time ?? product.lead_time ?? null,
  },
});
```

### 4) Public product list controller with filters

File: `src/api/product/controllers/public.js`

```js
const filters = buildProductFilters(ctx.query);
const items = await strapi.db.query("api::product.product").findMany({
  where: filters,
  populate: { category: true, partner: true },
});
```

### 5) Email notification service

File: `src/utils/email-service.js`

```js
await transporter.sendMail({
  from: process.env.MAIL_FROM || "no-reply@essencesourceusa.com",
  to: process.env.MAIL_TO || "hello@essencesourceusa.com",
  replyTo: inquiry.email,
  subject: `[Essence Source] ${inquiry.inquiry_type} inquiry from ${inquiry.company}`,
});
```

### 6) Seed script for example products

File: `scripts/seed.js`

```js
await upsertByQuery(app.db.query("api::product.product"), { slug: product.slug }, {
  ...product,
  category: categoryMap.get(product.category) ?? null,
  partner: partnerId,
  certifications: certificationIds,
});
```

### 7) GL Herb partner data seed

File: `scripts/partner-seed.js`

```js
const partnerData = {
  partner_name: "GL Herb",
  slug: "gl-herb",
  overview: "Manufacturing partner supporting Essence Source with botanical extract production..."
};
```

### 8) API key policy example

File: `src/policies/internal-api-key.js`

```js
const normalizedProvided = providedKey.replace(/^Bearer\\s+/i, "");
return normalizedProvided === expectedKey;
```

## Testing Coverage

Current tests cover:

1. public product list
2. product detail by slug
3. inquiry success path
4. inquiry validation errors
5. inventory sync service update behavior
6. internal sync API key rejection
7. public API sanitization of product fields
8. `partner/gl-herb` CMS response

## Deployment Notes

- Recommended deployment: Strapi service + PostgreSQL, with object storage added later for managed certificate assets or product documents.
- Add a persistent Redis-backed limiter if inquiry volume grows beyond the in-memory limiter placeholder.
- Replace the default email transport envs with your transactional provider credentials or adapter.
- Keep internal endpoints off the public frontend and protect them with API key rotation.
