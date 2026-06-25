# Essence Source USA Site Audit

Date: 2026-05-21
Auditor: Codex
Scope: Strategy, IA, UX, conversion, SEO, performance, compliance, security, analytics, deployment drift

## Executive Summary

The site is strategically coherent as a U.S.-focused B2B botanical ingredient sourcing website, not a DTC skincare storefront. The homepage, catalog structure, product details, warehouse messaging, and contact flow all support an inquiry-led sourcing model.

The strongest parts of the site today are:

- Clear B2B positioning
- Strong baseline performance
- Meaningful catalog depth with 49 products
- Good collection architecture
- Useful trust and compliance framing on product pages

The biggest business risks are:

1. The live RFQ / inquiry form is not functioning as a working conversion endpoint.
2. Production behavior and repository configuration are not fully aligned.
3. Product data and media governance are drifting, causing broken or mismatched live assets.
4. Security headers and analytics instrumentation are missing.
5. Product-to-RFQ routing is incomplete across the catalog.

## Current Business Model Assessment

Current site evidence strongly indicates a B2B inquiry-driven sourcing model:

- Homepage positioning is built around U.S. B2B buyers.
- Navigation emphasizes products, quality, warehouse support, and contact.
- Product pages emphasize quote, sample, and documentation workflows.
- Contact flow is oriented around RFQ rather than ecommerce checkout.

Conclusion:

- Current strategic positioning is correct if the business goal is botanical ingredient sourcing.
- If leadership expects a DTC skincare storefront, that would require a strategic rebuild, not incremental optimization.

## Page Inventory

| Page Family | Purpose | Conversion Role |
|---|---|---|
| Home | Positioning and top-level navigation | Entry point |
| Products | Full catalog discovery | Main research hub |
| Brand Ingredients | Hero branded ingredients | High-intent collection |
| Specialty Ingredients | Specialty actives | High-intent collection |
| Specification Extracts | Standard extract portfolio | Catalog cluster |
| Natural Mushrooms | Mushroom collection | Catalog cluster |
| 49 Product Pages | Product-level evaluation | Core conversion assist |
| Applications | Use-case framing | Supportive discovery |
| Quality | Documentation and QA trust | Trust builder |
| Warehouse | U.S. fulfillment credibility | Objection handling |
| Partner | Manufacturing credibility | Trust builder |
| Resources | FAQ and support content | Supportive content |
| Contact | RFQ / inquiry capture | Primary conversion endpoint |
| About | Company story | Secondary trust |
| Legal pages | Compliance support | Trust/compliance |

## Evidence Collected

Primary local files reviewed:

- [AGENT_SYNC.md](D:\work\projects\ES website\es-website\AGENT_SYNC.md)
- [assets/data/site-content.js](D:\work\projects\ES website\es-website\assets\data\site-content.js)
- [assets/data/products.json](D:\work\projects\ES website\es-website\assets\data\products.json)
- [contact.html](D:\work\projects\ES website\es-website\contact.html)
- [products.html](D:\work\projects\ES website\es-website\products.html)
- [server.js](D:\work\projects\ES website\es-website\server.js)
- [robots.txt](D:\work\projects\ES website\es-website\robots.txt)
- [sitemap.xml](D:\work\projects\ES website\es-website\sitemap.xml)

Temporary technical evidence captured:

- [tmp/lh-home.json](D:\work\projects\ES website\es-website\tmp\lh-home.json)
- [tmp/lh-products.json](D:\work\projects\ES website\es-website\tmp\lh-products.json)
- [tmp/lh-contact.json](D:\work\projects\ES website\es-website\tmp\lh-contact.json)

## Performance Snapshot

### Home

- Performance: 0.93
- Accessibility: 0.96
- Best Practices: 1.00
- SEO: 1.00
- LCP: ~1.5s
- CLS: 0

### Products

- Performance: 0.96
- Accessibility: 0.95
- Best Practices: 0.96
- SEO: 1.00
- LCP: ~1.4s
- CLS: 0

### Contact

- Performance: 0.92
- Accessibility: 0.95
- Best Practices: 1.00
- SEO: 0.69

Main reason for weak contact SEO:

- `contact.html` is blocked in `robots.txt` while also being included in sitemap.

## Prioritized Findings

### P0

#### P0-01: Live inquiry form is effectively broken

The live form appears usable, but POST requests to `/api/public/inquiries` return `410 Gone`.

Evidence:

- [contact.html](D:\work\projects\ES website\es-website\contact.html)
- [server.js](D:\work\projects\ES website\es-website\server.js)

Business impact:

- Direct lead loss
- Erodes trust at the most important conversion step

#### P0-02: Front-end form schema does not match backend schema

The current front-end uses fields such as:

- `product`
- `quantity`
- inquiry type `general`

The backend expects:

- `product_interest`
- `application`
- inquiry type `contact`

Evidence:

- [contact.html](D:\work\projects\ES website\es-website\contact.html)
- [server.js](D:\work\projects\ES website\es-website\server.js)

Business impact:

- Even after re-enabling the endpoint, submissions may still fail validation.

### P1

#### P1-01: Production and repo configuration are drifting

Repo configuration indicates mock mode in content config, but live inspection showed form behavior is not aligned with that state.

Evidence:

- [assets/data/site-content.js](D:\work\projects\ES website\es-website\assets\data\site-content.js)

Business impact:

- Makes debugging, QA, and deployment confidence much harder.

#### P1-02: Product/media governance drift

Broken or mismatched product assets were found during audit, including live missing resources and crossed image references.

Evidence:

- [products.html](D:\work\projects\ES website\es-website\products.html)
- [assets/data/products.json](D:\work\projects\ES website\es-website\assets\data\products.json)

Business impact:

- Damages product credibility
- Creates visual QA regressions

#### P1-03: Product-to-RFQ routing is incomplete

Many product pages route quote/doc/sample flows with `product=Other` instead of the actual product. The contact form product list only supports a subset of the catalog.

Evidence:

- Product detail pages
- [contact.html](D:\work\projects\ES website\es-website\contact.html)

Business impact:

- Weakens lead qualification
- Adds friction for buyers

#### P1-04: Security headers are missing

The following were not detected on key pages:

- Content-Security-Policy
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

Business impact:

- Unnecessary hardening gap

#### P1-05: No analytics instrumentation

No visible GA, GTM, Plausible, Clarity, PostHog, or similar measurement setup was detected.

Business impact:

- No reliable visibility into CTA clicks, form starts, or submission failures

#### P1-06: Public phone looks like placeholder content

The visible phone number pattern reads like placeholder data and should be replaced or removed.

Evidence:

- [assets/data/site-content.js](D:\work\projects\ES website\es-website\assets\data\site-content.js)

### P2

#### P2-01: Contact page sends mixed crawl signals

- `contact.html` is in sitemap
- `contact.html` is disallowed in robots

Evidence:

- [robots.txt](D:\work\projects\ES website\es-website\robots.txt)
- [sitemap.xml](D:\work\projects\ES website\es-website\sitemap.xml)

#### P2-02: Form consent lacks inline privacy links

The form includes consent text, but privacy/terms links are only in the footer, not next to the checkbox.

Evidence:

- [contact.html](D:\work\projects\ES website\es-website\contact.html)

#### P2-03: Shared identity assets are heavier than necessary

Logo and favicon assets are relatively large for every page request.

#### P2-04: Catalog architecture has too many parallel sources of truth

Product information currently exists across JSON, static HTML, generated pages, and scripts, which increases drift risk.

## Recommended Roadmap

### Next 30 Days

1. Restore a truthful RFQ state
   - Either make the form fully work
   - Or explicitly downgrade to email-only until SMTP/API is live
2. Align front-end and backend inquiry payload schema
3. Fix broken/mismatched product assets
4. Unify product source-of-truth
5. Add baseline security headers
6. Add core analytics events

### Next 60 Days

1. Make RFQ prefill work across all 49 products
2. Generate the contact form product list from product data
3. Add stronger inline trust around consent and privacy
4. Clean up production/repo config drift

### Next 90 Days

1. Add conversion testing and measurement
2. Improve workflow governance for media/content updates
3. Expand B2B SEO clustering and resource content

## Suggested Analytics Events

- `page_view`
- `catalog_filter_used`
- `product_detail_view`
- `cta_email_sales_click`
- `cta_request_quote_click`
- `cta_request_docs_click`
- `cta_request_sample_click`
- `rfq_form_start`
- `rfq_form_submit_success`
- `rfq_form_submit_error`

## Sign-off Checklist

- Business model confirmed as B2B sourcing
- Real contact details verified
- Live inquiry path works or is honestly downgraded
- Product image references validated before deploy
- Security headers enabled
- Analytics firing
- Contact crawl policy intentionally set
- Privacy and terms linked inline near consent
- Deployment config reconciled with repo config

## Bottom Line

This is not a redesign problem first. It is an operational reliability problem first.

The site is already directionally strong for B2B ingredient sourcing. The highest-value next work is:

1. Repair the live RFQ stack
2. Remove production drift
3. Tighten product/media governance
4. Add security and measurement
5. Make product-to-inquiry routing reliable across the full catalog
