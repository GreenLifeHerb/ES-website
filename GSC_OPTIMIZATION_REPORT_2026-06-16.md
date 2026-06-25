# GSC Optimization Report - 2026-06-16

## Current Performance

Data source: Google Search Console API.

- Last 90 days: 9 clicks, 273 impressions, 3.30% CTR, average position 41.8.
- Last 28 days: 8 clicks, 263 impressions, 3.04% CTR, average position 43.3.
- Last 7 days: 3 clicks, 116 impressions, 2.59% CTR, average position 41.0.
- Previous 7 days: 4 clicks, 84 impressions, 4.76% CTR, average position 50.7.

Interpretation: impressions are increasing and average position improved week over week, but the site is still in early discovery. Most pages need more crawl time, stronger internal links, and more off-site authority.

## Page Opportunities

| Page | Clicks | Impressions | Avg Position | Action |
| :--- | ---: | ---: | ---: | :--- |
| `/nutraceutical-ingredient-supplier.html` | 0 | 14 | 5.9 | Improve CTR and keep RFQ/COA intent clear. |
| `/about.html` | 0 | 18 | 8.2 | Already improved; monitor CTR. |
| `/custom-botanical-extract-manufacturing.html` | 0 | 18 | 18.9 | Add stronger RFQ template path and custom spec signals. |
| `/botanical-extract-supplier-usa.html` | 0 | 26 | 21.0 | Continue strengthening supplier-comparison links. |
| `/contact.html` | 0 | 71 | 48.7 | Many impressions are low-value email/contact searches. Avoid over-optimizing for generic contact queries. |
| `/cookies.html` | 0 | 24 | 5.2 | Noindex because it is not a commercial landing page. |

## Query Opportunities

| Query | Impressions | Avg Position | Action |
| :--- | ---: | ---: | :--- |
| `cosmetic botanical extract supplier california` | 4 | 10.8 | Strengthen cosmetic botanical extract supplier page title and RFQ language. |
| `wholesale botanical ingredient supplier` | 5 | 51.0 | Continue improving wholesale/RFQ paths. |
| `botanical extracts wholesale` | 4 | 56.8 | Strengthen bulk extract page and internal links. |
| `bulk botanical extracts` | 3 | 59.7 | Continue adding RFQ and MOQ content. |
| `botanical extract suppliers` | 20 | 87.6 | Needs authority and internal links; broad query is competitive. |
| `food-grade botanical isolates` | 9 | 92.1 | Consider a dedicated article only if this is a real business target. |

## Actions Taken

- Added `noindex,follow` to `cookies.html`.
- Excluded `cookies.html` from XML and image sitemap generation.
- Updated `cosmetic-botanical-ingredients.html` around the query `cosmetic botanical extract supplier`.
- Replaced remaining direct mailto CTA on the cosmetic page with a site RFQ path.
- Added stronger RFQ and COA/TDS template links to the custom botanical extract manufacturing page.
- Regenerated `sitemap.xml`, `sitemap-index.xml`, `image-sitemap.xml`, and `sitemap.html`.

## External Follow-Up

- In GSC, submit `https://essencesourceusa.com/sitemap-index.xml` manually. API submit requires a non-readonly OAuth scope.
- Monitor whether GSC sitemap discovered URL count updates from the old 48 URL snapshot.
- Keep building external authority: Google Business Profile, Bing Webmaster Tools, LinkedIn, company directories, and industry citations.

