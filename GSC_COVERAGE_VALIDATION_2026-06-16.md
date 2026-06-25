# GSC Coverage Validation Check - 2026-06-16

Source export:

- Issue: `Discovered - currently not indexed`
- Exported URLs: 29
- Validation status: pending

## Technical Check Result

All 29 exported URLs were checked on the live site.

- HTTP status: all `200`
- Canonical: all self-referencing and correct
- Robots meta: no `noindex`
- Sitemap: all included in `sitemap.xml`

Conclusion: this is not a website blocking issue. Google has discovered the URLs but has not crawled or indexed them yet.

## Actions Taken

- Regenerated `sitemap.xml`
- Regenerated `sitemap-index.xml`
- Regenerated `image-sitemap.xml`
- Regenerated `robots.txt`
- Regenerated `llms.txt`
- Submitted IndexNow ping attempt
- Fixed Buyer Guides image-sitemap caption escaping
- Updated weekly GSC script default quota project to `es-seo-gsc-5056`

## Remaining External Items

- GSC API currently returns insufficient site permission for `sc-domain:essencesourceusa.com`.
- Add the API caller/service account as a user in Google Search Console before automated GSC pulls can run again.
- Bing IndexNow returns 403 even though the key file is live and accessible. Retest after deployment; if it persists, verify the domain in Bing Webmaster Tools.

## Recommended Next Step

In Google Search Console, use URL Inspection for the highest-priority URLs and click `Request indexing`:

- `https://essencesourceusa.com/product-black-ginger.html`
- `https://essencesourceusa.com/product-green-coffee.html`
- `https://essencesourceusa.com/products.html`
- `https://essencesourceusa.com/insights.html`
- `https://essencesourceusa.com/buyer-guides.html`
- `https://essencesourceusa.com/quality.html`
- `https://essencesourceusa.com/warehouse.html`

