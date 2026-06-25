# GSC Indexing Priority URL List

Use this list in Google Search Console URL Inspection. Submit the sitemap first, then request indexing for these URLs in order.

## Step 1: Resubmit Sitemap

Submit this sitemap in Google Search Console:

`https://essencesourceusa.com/sitemap.xml`

Current XML sitemap contains 25 priority URLs.

## Latest URL Inspection Snapshot

Checked with the Google Search Console URL Inspection API on 2026-06-05 after Priority A manual submission.

- `8` URLs are submitted and indexed: homepage, five supplier-intent landing pages, About, and Contact.
- `15` URLs are discovered but currently not indexed.
- `2` URLs are still unknown to Google.

Manual URL Inspection should now prioritize the two unknown product pages first, then discovered-but-not-indexed collection and product pages.

## Manual Submission Log

Completed in Google Search Console on 2026-06-05:

- Priority A unknown-to-Google URLs were submitted through URL Inspection.
- Submitted pages: five supplier-intent landing pages, About, and Contact.
- Same-day follow-up check showed all seven submitted URLs moved to `Submitted and indexed`.
- Next check: re-run URL Inspection API after 3-7 days to see whether Priority B and Priority C move from unknown/discovered to indexed.

Run the local inspection command:

```powershell
$env:GSC_API_PROXY='http://127.0.0.1:10808'; $env:HTTPS_PROXY='http://127.0.0.1:10808'; $env:HTTP_PROXY='http://127.0.0.1:10808'; npm.cmd run query:gsc:inspection
```

## Immediate Manual Request Indexing Order

Use URL Inspection in Google Search Console and request indexing in this order.

### Priority A: Submitted And Indexed After Manual Request

1. `https://essencesourceusa.com/botanical-extract-supplier-usa.html`
2. `https://essencesourceusa.com/botanical-ingredient-supplier.html`
3. `https://essencesourceusa.com/nutraceutical-ingredient-supplier.html`
4. `https://essencesourceusa.com/bulk-botanical-extracts.html`
5. `https://essencesourceusa.com/custom-botanical-extract-manufacturing.html`
6. `https://essencesourceusa.com/about.html`
7. `https://essencesourceusa.com/contact.html`

### Priority B: Still Unknown To Google

1. `https://essencesourceusa.com/product-reishi-mushroom-extract.html`
2. `https://essencesourceusa.com/product-white-willow-bark.html`

### Priority C: Discovered But Not Indexed

1. `https://essencesourceusa.com/products.html`
2. `https://essencesourceusa.com/brand-ingredients.html`
3. `https://essencesourceusa.com/specialty-ingredients.html`
4. `https://essencesourceusa.com/specification-extracts.html`
5. `https://essencesourceusa.com/natural-mushrooms.html`
6. `https://essencesourceusa.com/quality.html`
7. `https://essencesourceusa.com/warehouse.html`
8. `https://essencesourceusa.com/resources.html`
9. `https://essencesourceusa.com/product-green-coffee.html`
10. `https://essencesourceusa.com/product-black-ginger.html`
11. `https://essencesourceusa.com/product-artichoke.html`
12. `https://essencesourceusa.com/product-fisetin.html`

## Tier 1: Core Discovery Pages

Request indexing for these first.

1. `https://essencesourceusa.com/`
2. `https://essencesourceusa.com/products.html`
3. `https://essencesourceusa.com/brand-ingredients.html`
4. `https://essencesourceusa.com/specialty-ingredients.html`
5. `https://essencesourceusa.com/specification-extracts.html`
6. `https://essencesourceusa.com/natural-mushrooms.html`

## Tier 2: Supplier Intent SEO Landing Pages

These pages target broader commercial searches where the homepage is too generic.

1. `https://essencesourceusa.com/botanical-extract-supplier-usa.html`
2. `https://essencesourceusa.com/botanical-ingredient-supplier.html`
3. `https://essencesourceusa.com/nutraceutical-ingredient-supplier.html`
4. `https://essencesourceusa.com/bulk-botanical-extracts.html`
5. `https://essencesourceusa.com/custom-botanical-extract-manufacturing.html`

## Tier 3: Highest-Intent Product Pages

These are the first product pages to push. Do not try to submit all product pages at once.

1. `https://essencesourceusa.com/product-green-coffee.html`
2. `https://essencesourceusa.com/product-black-ginger.html`
3. `https://essencesourceusa.com/product-artichoke.html`
4. `https://essencesourceusa.com/product-fisetin.html`
5. `https://essencesourceusa.com/product-reishi-mushroom-extract.html`
6. `https://essencesourceusa.com/product-white-willow-bark.html`

## Tier 4: Supporting Trust Pages

Submit these after Tier 1-3, especially if Google still indexes too few pages.

1. `https://essencesourceusa.com/quality.html`
2. `https://essencesourceusa.com/warehouse.html`
3. `https://essencesourceusa.com/resources.html`
4. `https://essencesourceusa.com/about.html`
5. `https://essencesourceusa.com/new-york-office.html`
6. `https://essencesourceusa.com/partner.html`
7. `https://essencesourceusa.com/contact.html`
8. `https://essencesourceusa.com/applications.html`

## Weekly Tracking

Record these once per week:

- Indexed page count
- Discovered - currently not indexed count
- Crawled - currently not indexed count
- Search impressions
- Clicks
- Average position
- Pages with impressions
- Queries with impressions

Expected early target:

- 7-14 days: excluded count starts changing, even if not all pages index.
- 2-4 weeks: impressions should grow beyond the first baseline.
- 1-2 months: some long-tail supplier/product terms should enter page 2 or page 3.
