# GSC and PageSpeed Optimization Report - 2026-06-18

## Data access status

On 2026-06-18, the Google Search Console and PageSpeed Insights API refresh could not complete from this workstation because direct HTTPS connections to `www.googleapis.com:443` timed out. This appears to be a local/network connectivity issue rather than a site issue or code issue.

For this optimization pass, the analysis used:

- Latest available GSC weekly snapshot: `tmp/gsc-weekly-snapshot-2026-06-13.json`
- Local Lighthouse 12.6.1 runs against the live website: `https://essencesourceusa.com`
- Existing repo validation and structured-data checks

## GSC summary from latest available snapshot

Period: 2026-05-17 to 2026-06-13

| Metric | Value |
| --- | ---: |
| Clicks | 8 |
| Impressions | 263 |
| CTR | 3.04% |
| Average position | 43.27 |

Recent 7 days, 2026-06-07 to 2026-06-13:

| Metric | Value |
| --- | ---: |
| Clicks | 3 |
| Impressions | 116 |
| CTR | 2.59% |
| Average position | 41.04 |

Previous 7 days:

| Metric | Value |
| --- | ---: |
| Clicks | 4 |
| Impressions | 84 |
| CTR | 4.76% |
| Average position | 50.74 |

Interpretation: impressions increased and average position improved week over week, but clicks are still too low to judge stable SEO trend. The site is beginning to surface, especially for supplier and ingredient intent queries, but it still needs more authority, more indexed buyer content, and better CTR on pages with impressions.

## Highest-priority GSC page opportunities

| Page | Clicks | Impressions | CTR | Avg position | Action |
| --- | ---: | ---: | ---: | ---: | --- |
| `/` | 6 | 112 | 5.36% | 30.7 | Keep strengthening internal links to buyer pages and product guides. |
| `/botanical-ingredient-supplier.html` | 1 | 59 | 1.69% | 48.6 | Improve title/meta CTR, add stronger supplier proof and links to product/category pages. |
| `/bulk-botanical-extracts.html` | 1 | 32 | 3.13% | 39.8 | Add more bulk/RFQ language and internal links from products. |
| `/about.html` | 0 | 18 | 0.00% | 8.2 | Position is good; improve title/meta and add stronger company trust signals. |
| `/botanical-extract-supplier-usa.html` | 0 | 26 | 0.00% | 21.0 | Add clearer USA supplier wording and stronger CTA. |
| `/contact.html` | 0 | 71 | 0.00% | 48.7 | Searchers likely need supplier info before contact; link more context pages into contact. |

## Query opportunities from GSC

| Query | Impressions | Avg position | Suggested action |
| --- | ---: | ---: | --- |
| cosmetic botanical extract supplier california | 4 | 10.8 | Add California service coverage language to cosmetic ingredient content. |
| wholesale botanical ingredient supplier | 5 | 51.0 | Build stronger wholesale supplier landing-page copy and internal links. |
| botanical extracts wholesale | 4 | 56.8 | Add wholesale/bulk wording to Products and Bulk pages. |
| bulk botanical extracts | 3 | 59.7 | Expand bulk extract terms and RFQ content. |
| botanical extract suppliers | 20 | 87.6 | Needs authority plus more internal links from product and guide pages. |
| food-grade botanical isolates | 9 | 92.1 | Add a dedicated paragraph/FAQ if this is commercially relevant. |

## Lighthouse / PageSpeed substitute results

Official PageSpeed Insights API refresh was blocked by the same Google API timeout. Local Lighthouse mobile and desktop audits were run against the live site.

Mobile results:

| Page | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | Speed Index |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 93 | 100 | 100 | 100 | 1.5s | 1.6s | 260ms | 0 | 3.4s |
| `/products.html` | 97 | 100 | 100 | 100 | 1.2s | 1.3s | 190ms | 0 | 2.6s |
| `/botanical-ingredient-supplier.html` | 92 | 100 | 100 | 100 | 1.2s | 1.3s | 320ms | 0 | 2.7s |
| `/bulk-botanical-extracts.html` | 95 | 100 | 100 | 100 | 1.2s | 1.2s | 250ms | 0 | 2.5s |
| `/quality.html` | 94 | 100 | 100 | 100 | 1.2s | 1.3s | 270ms | 0 | 2.6s |
| `/insights.html` | 94 | 100 | 100 | 100 | 1.2s | 1.2s | 270ms | 0 | 2.7s |
| `/cosmetic-botanical-ingredients.html` | 94 | 100 | 100 | 100 | 1.2s | 1.6s | 250ms | 0 | 3.1s |

Desktop sample results: performance 99-100, accessibility 100, best practices 100, SEO 100, CLS 0.

## Fixes applied in this pass

1. Replaced the oversized header logo reference with a small optimized logo asset:
   - Previous asset: `assets/img/essence-source-logo.png`, about 81 KB
   - New asset: `assets/img/optimized/essence-source-logo-96.png`, about 1.1 KB

2. Added responsive image delivery for product cards and product detail media:
   - 480w image candidate
   - 768w image candidate
   - 1200w fallback candidate
   - Context-aware `sizes` attributes

3. Updated JS cache-busting query strings across HTML pages so browsers receive the optimized navigation and card scripts immediately after deploy.

## Remaining optimization plan

1. Re-run official PageSpeed Insights after Google API connectivity is restored, especially for mobile Home and Products.
2. Continue publishing supplier and ingredient Insight articles, because current GSC data shows impressions but not enough authority or click volume yet.
3. Strengthen external authority signals: Google Business Profile, Bing Webmaster Tools / IndexNow verification, industry directories, LinkedIn consistency, and real certificate/report pages when files are ready.
4. Improve CTR on pages already getting impressions: About, Contact, botanical supplier pages, and bulk extract pages.
5. Add more targeted content for queries already appearing in GSC: wholesale botanical ingredients, cosmetic botanical extract supplier, food-grade botanical isolates, and bulk botanical extracts.
6. Consider AVIF variants for large hero/product images in a future image pipeline pass. The current responsive image change is the faster, lower-risk improvement.
