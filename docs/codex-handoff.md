# Codex Handoff: Essence Source USA Website

Last updated: 2026-06-03

This document is the starting point for future Codex conversations about the Essence Source USA website.

## Project Snapshot

- Project: Essence Source USA static B2B botanical ingredients website.
- Local workspace: `D:\work\projects\ES website\es-website`
- GitHub repository: `https://github.com/GreenLifeHerb/ES-website`
- Production domain: `https://essencesourceusa.com`
- Google Cloud project currently used: `gen-lang-client-0420594192`
- Cloud Run service: `essencesource-website`
- Latest confirmed deployed commit during this handoff: `759e54d`
- Latest documentation-only commit before final optimization: `ec397b9`
- Default business email: `info@essencesourceusa.com`
- LinkedIn company page: `https://www.linkedin.com/company/essence-source-ingredients/`

## Business Goal

The site is for U.S. B2B buyers sourcing botanical extracts, nutraceutical ingredients, specialty actives, mushroom extracts, fruit and vegetable powders, documentation, samples, and RFQ support.

The main business needs are:

- Let customers contact the company by visible email, mailto links, and structured inquiry forms.
- Build enough trust for Google and buyers to treat the site as a real supplier website.
- Improve Google indexing and organic search visibility.
- Avoid consumer-health claims, misleading guarantees, fake reviews, fake prices, and unverified certification claims.

## Current Strategic Decision

Do not keep pushing all 70+ pages to Google at once.

The site has many static pages and around 49 product detail pages, but Google has only indexed a very small number so far. The current diagnosis is that Google has discovered many URLs but does not yet trust or prioritize the new site enough to crawl and index all of them.

The current SEO strategy is:

- Keep all pages available for users.
- Keep the full HTML sitemap for discoverability.
- Limit XML sitemap to 25 priority URLs.
- Focus first on getting 10-25 high-value pages indexed.
- Build trust signals before adding more ordinary product pages to XML sitemap.
- Pause mass page creation until indexing improves.

## Current XML Sitemap Strategy

The XML sitemap currently contains 25 priority URLs:

- Homepage
- Product overview
- Four collection pages
- Application / quality / warehouse / resources / about / office / partner / contact pages
- Five supplier-intent SEO landing pages
- Six highest-priority product pages

Important files:

- `sitemap.xml`
- `public/sitemap.xml`
- `sitemap.html`
- `infra/scripts/generate-sitemap.js`
- `infra/scripts/generate-html-sitemap.js`
- `GSC_INDEXING_PRIORITY_URLS.md`

Do not put all product pages back into XML sitemap unless there is clear GSC evidence that the priority pages are being indexed normally.

## Current GSC Action Plan

Manual GSC work is still required.

Submit this sitemap in Google Search Console:

`https://essencesourceusa.com/sitemap.xml`

Then use URL Inspection and request indexing in this order:

1. Tier 1: core discovery pages
2. Tier 2: supplier intent landing pages
3. Tier 3: highest-intent product pages
4. Tier 4: supporting trust pages

The exact URLs are documented in:

`GSC_INDEXING_PRIORITY_URLS.md`

Previous attempts to automate GSC sitemap submission through gcloud/API were blocked by scope and SSL/token instability. Browser/manual GSC submission is currently the reliable path.

When using Chrome for Google tools, use the profile associated with:

`cuiyuanlepowers@gmail.com`

On this machine, the correct Chrome profile was identified as `Default`.

## Current Known GSC Baseline

Historical GSC facts observed in this conversation:

- Average position was around `34`, effectively page 4.
- Search visibility was mostly carried by the homepage.
- Many product pages were `Discovered - currently not indexed`.
- Sitemap report previously showed a large mismatch: submitted pages were discovered but not indexed.
- URL Inspection showed homepage indexed, while important product pages such as `products.html`, `product-green-coffee.html`, `product-artichoke.html`, and `product-reishi-mushroom-extract.html` were discovered but not indexed at that time.

Interpretation:

- This is not primarily a robots/noindex problem.
- It is a new-site trust, crawl priority, and content-value problem.
- The fix is not to create unlimited pages, but to strengthen fewer priority pages, submit them manually, and build external trust signals.

## Completed Work

### Email / Contact

- Default email is `info@essencesourceusa.com`.
- Contact page supports multiple contact modes:
  - Visible copyable email
  - `mailto:` links
  - Structured inquiry form
- SMTP form routing was reported by the user as completed. Do not treat SMTP as currently blocked unless new evidence appears.

### Product and Collection Content

The site has many product pages and collection pages.

Major product categories include:

- Brand Ingredients
- Specialty Ingredients
- Specification Extracts
- Natural Mushrooms

Important pages:

- `products.html`
- `brand-ingredients.html`
- `specialty-ingredients.html`
- `specification-extracts.html`
- `natural-mushrooms.html`

Collection pages have been strengthened with:

- More procurement-oriented content
- Static priority product links
- FAQ sections or FAQPage JSON-LD
- Stronger internal linking

`natural-mushrooms.html` had an invalid nested `<picture>` issue that was fixed.

### SEO Landing Pages

Five supplier-intent SEO landing pages were created:

- `botanical-extract-supplier-usa.html`
- `botanical-ingredient-supplier.html`
- `nutraceutical-ingredient-supplier.html`
- `bulk-botanical-extracts.html`
- `custom-botanical-extract-manufacturing.html`

Each page includes:

- Title and meta description
- Canonical
- Open Graph metadata
- FAQPage JSON-LD
- RFQ/contact path
- Internal links to relevant product/category/trust pages

These pages exist to target broader search intent that the homepage is too generic to handle.

### Trust Pages

The following pages were strengthened:

- `about.html`
- `contact.html`
- `quality.html`
- `warehouse.html`
- `partner.html`

Changes included:

- LinkedIn `sameAs` signal on About and Contact structured data.
- Company verification content on Contact.
- Document verification workflow on Quality.
- More careful U.S. warehouse language on Warehouse.
- More realistic manufacturing support language on Partner.
- LinkedIn profile links added as external trust signals.

### Footer Trust Badge Risk Reduction

Footer badges were changed from potentially overbroad certification claims to safer B2B support signals.

Current footer trust badges:

- COA Available
- COA / TDS on Request
- B2B RFQ Support
- U.S. Warehouse Path

Avoid reintroducing broad claims like USDA Organic, Kosher, Halal, or cGMP unless there is clear evidence and exact scope.

### Images / Visual QA

Earlier work included extensive product image generation and replacement, especially for:

- Natural Mushrooms
- Specification Extracts
- Specialty Ingredients

Important lesson: images must match the exact product name and be realistic extract/product sourcing imagery, not generic illustrations.

### Mobile / Layout

Mobile layout issues were previously addressed, including button width and header behavior.

If further mobile issues are reported, verify visually around common widths:

- 360px
- 375px
- 390px
- 414px

### Logo

Logo loading was fixed earlier. The expected logo asset is:

`assets/img/essence-source-logo.png`

### Security / Google Safe Browsing

Google previously warned about a deceptive page/security issue. Content and risky wording were reviewed and softened. Current content should avoid:

- Fake urgency
- Misleading download wording
- Dangerous health claims
- Fake certifications
- Claims that imply guaranteed stock, approval, cure, treatment, or official endorsement

Final optimization work on 2026-06-03 further reduced risk:

- `sitemap.xml` is served as `application/xml; charset=utf-8` with `no-cache`.
- Product-page preload 404s were fixed.
- Overbroad cGMP, USP/FDA, ready-to-ship, absolute-safety, fixed-MOQ, free-sample, and regular-stock wording was softened.
- Product pages no longer show broad "Academic Literature & Research Citations" blocks; they use safer technical document review language.
- Generated product data no longer carries nonexistent `assets/docs/specs/*.pdf` datasheet URLs.
- Product query links with apostrophes are URL encoded.
- Homepage primary CTA now routes to the structured RFQ form instead of only `mailto:`.
- Title/meta description length, local links, H1 count, and static image sizing were rechecked.

## Directory Structure

High-level layout:

- Root `*.html`: static site pages.
- `assets/css/main.css`: global styling.
- `assets/js/main.js`: shared header/footer and common behavior.
- `assets/js/nav.js`: navigation behavior.
- `assets/js/cards.js`: product card rendering for collection/product pages.
- `assets/data/site-content.js`: shared site content, nav, contact, trust badges, product data.
- `assets/img/`: image assets.
- `assets/img/optimized/`: generated optimized image variants.
- `infra/scripts/`: SEO, sitemap, robots, PageSpeed, GSC, Ahrefs, image scripts.
- `backend/`: Strapi/CMS backend area, currently not the main path for the static production site.
- `public/`: public mirrors for sitemap/robots and static assets.
- `tests/`: Playwright tests.
- `docs/`: handoff and future project documentation.

Important root docs:

- `AGENT_SYNC.md`
- `GSC_INDEXING_PRIORITY_URLS.md`
- `COMPREHENSIVE_SEO_PERFORMANCE_AUDIT.md`
- `SITE_AUDIT_REPORT_GSC.md`
- `SITE_AUDIT_REPORT_PAGESPEED.md`

## Useful Commands

Run from:

`D:\work\projects\ES website\es-website`

Validation:

```powershell
npm.cmd run seo:validate
node infra\scripts\generate-sitemap.js --check
```

Regenerate SEO files:

```powershell
npm.cmd run seo:sitemap
node infra\scripts\generate-html-sitemap.js
```

Run local server:

```powershell
npm.cmd run dev
```

Run tests:

```powershell
npm.cmd run test:e2e
```

PageSpeed:

```powershell
npm.cmd run audit:pagespeed
```

GSC query:

```powershell
npm.cmd run query:gsc
```

GSC URL Inspection check for current XML sitemap URLs:

```powershell
$env:GSC_API_PROXY='http://127.0.0.1:10808'; $env:HTTPS_PROXY='http://127.0.0.1:10808'; $env:HTTP_PROXY='http://127.0.0.1:10808'; npm.cmd run query:gsc:inspection
```

The URL Inspection script writes local ignored reports to `tmp/gsc-url-inspection-latest.json` and `tmp/gsc-url-inspection-latest.md`.

Deploy trigger currently used:

```powershell
gcloud.cmd builds triggers run f506127e-50d7-4f04-9ce4-6123d4248132 --branch=main
```

Check Cloud Run service:

```powershell
gcloud.cmd run services describe essencesource-website --region=us-central1 --format="yaml(status.latestReadyRevisionName,status.url,metadata.labels.commit-sha)"
```

## Deployment Notes

Recent deployment flow:

1. Commit to `main`.
2. Push to GitHub.
3. Manually trigger Cloud Build trigger:

`f506127e-50d7-4f04-9ce4-6123d4248132`

4. Confirm Cloud Run `metadata.labels.commit-sha` matches pushed commit.
5. Verify live domain with `curl.exe` where possible.

Do not assume GitHub push automatically deploys immediately. Check Cloud Run.

## Important Commits

Recent important commits:

- `759e54d fix(seo): clean product trust and metadata signals`
- `1697c6d fix(seo): reduce sourcing claim risk`
- `3197465 fix(seo): serve sitemap with xml content type`
- `ec397b9 docs(seo): refresh indexing handoff`
- `4cb683e fix(seo): soften footer trust badges`
- `37e862e fix(seo): strengthen trust support pages`
- `cea28df feat(seo): add supplier intent landing pages`
- `38bb551 fix(seo): strengthen collection crawl paths`
- `d982cfb fix(seo): strengthen brand ingredients index page`
- `79aec27 fix(seo): focus xml sitemap on crawl-priority pages`
- `613c14c fix: improve mobile button layout`

## Unfinished Work

### Must Do Next

- Manually submit `https://essencesourceusa.com/sitemap.xml` in GSC.
- Use URL Inspection to request indexing for URLs in `GSC_INDEXING_PRIORITY_URLS.md`.
- Track GSC status weekly.

### External Trust Signals

LinkedIn company page is done.

Still useful:

- Google Business Profile or other public company profile.
- Industry/supplier directory listings.
- Partner/company mentions with links back to the website.
- Consistent company NAP information across external profiles.

### Monitoring

Every week, record:

- Indexed page count
- Discovered - currently not indexed count
- Crawled - currently not indexed count
- Impressions
- Clicks
- Average position
- Pages with impressions
- Queries with impressions

Expected targets:

- 7-14 days: excluded count starts changing, even if not all pages index.
- 2-4 weeks: impressions should grow beyond the initial baseline.
- 1-2 months: some long-tail supplier/product terms should reach page 2 or page 3.

## Cautions for Future Work

- Do not add fake ratings, fake reviews, fake prices, fake offers, fake inventory, or unverified certifications.
- Do not add health claims that imply treatment, cure, prevention, or guaranteed effect.
- Do not add all product pages back into XML sitemap too early.
- Do not rely only on generated pages; external trust signals are now more important.
- Do not overwrite user or Antigravity changes without checking git diff.
- Use `apply_patch` for manual edits.
- After changes, run `seo:validate` and sitemap check.
- For frontend or layout changes, verify mobile widths visually.
- If using Chrome for Google tools, ensure account/profile is `cuiyuanlepowers@gmail.com` / Chrome `Default`.

## Recommended Next Conversation Start

In a new conversation, start by reading this file:

`docs/codex-handoff.md`

Then check:

```powershell
git status --short
git log -5 --oneline
```

If the task is SEO/indexing, also read:

`GSC_INDEXING_PRIORITY_URLS.md`
