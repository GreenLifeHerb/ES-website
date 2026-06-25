# Essence Source USA Trust Asset Implementation Plan

This plan is for the next phase after real company materials are ready. Do not publish unverified claims, fake certificates, fake lab reports, fake customers, or invented warehouse details.

## Goal

Move the website from a professional content site to a more trustable B2B supplier site by adding real evidence:

- COA/TDS sample paths
- Third-party testing report examples
- Real certificates
- Warehouse and service-area details
- Office/company verification details
- Packaging, MOQ, lead time, and sample workflow information

## Asset Intake Checklist

### COA/TDS Samples

Required:

- Product name
- Grade/specification
- Whether the file is representative, sample-specific, or lot-specific
- Date range that can be shown publicly
- Redactions required before publishing
- Permission to publish screenshot/PDF sample

Where to use:

- `quality.html`
- `resources.html`
- `coa-tds-request-email-template.html`
- Product pages for the matching ingredient
- Contact page buyer request flow

Suggested module:

- "Example COA/TDS review path"
- "What buyers can request"
- "Representative vs sample-specific vs lot-specific document"

### Third-Party Test Report Examples

Required:

- Product name
- Test type
- Lab name if public
- Whether the report is full, partial, or redacted
- Date range
- Any fields that must be hidden

Where to use:

- `quality.html`
- `resources.html`
- Product pages with matching material

Suggested module:

- "Third-party test report example"
- "How to read the report"
- "Which tests are product-specific"

### Certificates

Required:

- Certificate type
- Issuer
- Valid date / expiration date
- Entity name on certificate
- Scope
- Public display permission

Where to use:

- `about.html`
- `quality.html`
- `resources.html`

Suggested module:

- "Certificate library"
- "Certificate scope note"
- "What this certificate does and does not cover"

### Warehouse / Fulfillment Materials

Required:

- Current warehouse service area
- Whether inventory is held in the U.S., available by inquiry, or routed case-by-case
- Products that can use U.S.-side support
- Photos approved for public use
- Packaging photos or examples
- Typical sample and shipment workflow

Where to use:

- `warehouse.html`
- `contact.html`
- `products.html`
- Relevant product pages

Suggested module:

- "Warehouse support by request type"
- "Sample path"
- "First order and replenishment path"
- "Service area note"

### Office / Company Verification

Required:

- Public address text to show
- Public office/meeting note
- Photos approved for public use
- LinkedIn or company profile links
- Any local directory or Google Business Profile links

Where to use:

- `about.html`
- `contact.html`
- `new-york-office.html` if applicable
- Footer / Organization Schema

Suggested module:

- "Company verification"
- "Public business profiles"
- "Office and sourcing desk note"

## Page-Level Implementation Map

| Page | Trust modules to add | Required assets |
| :--- | :--- | :--- |
| `quality.html` | COA/TDS examples, third-party report examples, certificate library, document workflow | COA/TDS, reports, certificates |
| `resources.html` | Buyer document examples, downloadable/checklist links, report-reading notes | COA/TDS, reports |
| `warehouse.html` | Service area, sample shipment path, packing examples, fulfillment notes | warehouse details, photos, packaging |
| `about.html` | Company story, team/office signal, certificate summary, public profiles | company details, photos, certificates |
| `contact.html` | What happens after inquiry, document/sample routing, verified contact details | sample workflow, service rules |
| Product pages | Matching COA/TDS example, grade-specific document path, sample note | product-specific documents |

## Schema Updates After Assets Arrive

Add or update only when the underlying claim is true:

- Organization `sameAs`
- Organization address and contactPoint
- Product additionalProperty for document availability
- ImageObject for certificate or report images if published
- Article/FAQ references to real document examples
- Breadcrumbs remain unchanged unless new library pages are created

## Publishing Rules

- Redact sensitive lot numbers, customer names, pricing, private lab IDs, and confidential addresses if needed.
- Do not imply a certificate covers all products if it only covers a site, process, partner, or specific scope.
- Do not publish medical or disease claims.
- Do not use SDS language unless the business later decides it is relevant. Current preference: focus on COA/TDS and third-party testing.
- Clearly label examples as representative, sample-specific, or lot-specific.

## First Implementation Batch When Assets Are Ready

1. Update `quality.html` with certificate/document proof modules.
2. Update `resources.html` with example document cards.
3. Update `warehouse.html` with real service-area and fulfillment notes.
4. Update `about.html` with verified company details and public trust signals.
5. Add matching document links to 5 priority product pages:
   - Green Coffee Bean Extract
   - Black Ginger Extract
   - Artichoke Extract
   - Black Garlic Extract
   - Apple Polyphenol Extract / product catalog card

## Open Questions for Owner

- Which certificates can be shown publicly?
- Which COA/TDS files can be redacted and published?
- Which third-party reports can be shown as examples?
- Which warehouse claims are currently accurate?
- Which product pages should receive document examples first?
- Can any customer/project cases be anonymized?
