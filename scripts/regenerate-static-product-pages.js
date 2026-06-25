"use strict";

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const products = JSON.parse(
  fs.readFileSync(path.join(rootDir, "assets", "data", "products.json"), "utf8"),
);

const notesTerms = [
  "Minimum order quantities (MOQ) apply per product. Please contact us for details.",
  "All specifications listed represent available grades; custom specifications can be arranged.",
  "COA, TDS, and third-party testing reports are available upon request.",
  "Products are suitable for dietary supplement, functional food, and cosmetic applications.",
  "For pricing, availability, and sample requests, please reach out via our official contact channels.",
];

const salesEmail = "info@essencesourceusa.com";

const productFileMap = {
  "green-coffee-bean-extract": "product-green-coffee.html",
  "black-ginger-extract": "product-black-ginger.html",
  "artichoke-extract": "product-artichoke.html",
  "black-garlic-extract": "product-black-garlic.html",
  "apple-fruit-powder": "product-apple-fruit.html",
  "beet-root-powder": "product-beet-root-powder.html",
  "ashwagandha-root-extract": "product-ashwagandha-root-extract.html",
  "elderberry-extract": "product-elderberry-extract.html",
  "rosemary-extract": "product-rosemary-extract.html",
  "grape-seed-extract": "product-grape-seed-extract.html",
  "roxburgh-rose-extract": "product-roxburgh-rose.html",
  "ivy-extract": "product-ivy-extract.html",
  "fisetin-cotinus-coggygria-extract": "product-fisetin.html",
  "echinacea-extract": "product-echinacea.html",
  "dioscorea-nipponica-extract": "product-dioscorea-nipponica.html",
  "ginger-root-extract": "product-ginger-root.html",
  "aloe-extract": "product-aloe-extract.html",
  "st-johns-wort-extract": "product-st-johns-wort.html",
  "shilajit-extract": "product-shilajit.html",
  "white-willow-bark-extract": "product-white-willow-bark.html",
  "cinnamon-extract": "product-cinnamon-extract.html",
  "kelp-extract": "product-kelp-extract.html",
  "soybean-extract": "product-soybean-extract.html",
  "horsetail-extract": "product-horsetail-extract.html",
  "apple-cider-vinegar-powder": "product-apple-cider-vinegar-powder.html",
  "dandelion-leaf-extract": "product-dandelion-leaf-extract.html",
  "dandelion-root-extract": "product-dandelion-root-extract.html",
  "cinnamon-extract-4-1": "product-cinnamon-extract-4-1.html",
  "astragalus-extract": "product-astragalus-extract.html",
  "thyme-extract": "product-thyme-extract.html",
  "alfalfa-extract": "product-alfalfa-extract.html",
  "maca-extract": "product-maca-extract.html",
  "burdock-extract": "product-burdock-extract.html",
  "nettle-extract": "product-nettle-extract.html",
  "saw-palmetto-extract": "product-saw-palmetto-extract.html",
  "marshmallow-extract": "product-marshmallow-extract.html",
  "celery-seed-extract": "product-celery-seed-extract.html",
  "hibiscus-flower-extract": "product-hibiscus-flower-extract.html",
  "rosehip-extract": "product-rosehip-extract.html",
  "lemon-balm-extract": "product-lemon-balm-extract.html",
  "valerian-extract": "product-valerian-extract.html",
  "kelp-extract-4-1": "product-kelp-extract-4-1.html",
  "eyebright-extract": "product-eyebright-extract.html",
  "wolfberry-extract": "product-wolfberry-extract.html",
  "reishi-mushroom-extract": "product-reishi-mushroom-extract.html",
  "chaga-extract": "product-chaga-extract.html",
  "shiitake-mushroom-extract": "product-shiitake-mushroom-extract.html",
  "lions-mane-extract": "product-lions-mane-extract.html",
  "turkey-tail-mushroom-extract": "product-turkey-tail-mushroom-extract.html",
};

const slugsToRegenerate = Object.keys(productFileMap);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildMailto(subject) {
  return `mailto:${salesEmail}?subject=${encodeURIComponent(subject)}`;
}

function buildProductMailto(productName, intent = "sales") {
  const subjectMap = {
    sales: `Essence Source inquiry - ${productName}`,
    docs: `Essence Source document request - ${productName}`,
  };
  return buildMailto(subjectMap[intent] || subjectMap.sales);
}

function eyebrowForCategory(category) {
  const map = {
    "Specification Extracts": "Specification extract",
    "Natural Mushrooms": "Natural mushroom",
    "Specialty Ingredients": "Specialty ingredient",
    "Botanical Extracts": "Botanical extract",
    "Nutraceutical Ingredients": "Nutraceutical ingredient",
    "Fruit & Vegetable Powders": "Fruit & vegetable powder",
    "Cosmetic Ingredients": "Cosmetic ingredient",
  };
  return map[category] || "Product detail";
}

function fitHeading(product) {
  if (product.category === "Natural Mushrooms") return "Commercial fit";
  if (product.category === "Specification Extracts") return "Typical review points";
  return "Commercial fit";
}

function fitCopy(product) {
  return product.detail_intro;
}

function resolveHref(slug) {
  return productFileMap[slug] || "products.html";
}

function buildRelatedCards(product) {
  return product.related_slugs
    .map((slug) => products.find((item) => item.slug === slug))
    .filter(Boolean)
    .slice(0, 3)
    .map(
      (item) => `
              <article class="product-card surface">
                <div class="product-card__media">
                  <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}" width="1200" height="900" loading="lazy">
                </div>
                <div class="product-card__body">
                  <div class="product-card__meta">
                    <span class="tag">${escapeHtml(item.category)}</span>
                  </div>
                  <div>
                    <h3><a href="${escapeHtml(resolveHref(item.slug))}">${escapeHtml(item.name)}</a></h3>
                    <p>${escapeHtml(item.summary)}</p>
                  </div>
                </div>
              </article>`,
    )
    .join("");
}

function mapProductPrefillValue(product) {
  return product.name;
}

function schemaAvailability(product) {
  if (product.warehouse_status === "US Warehouse Available") {
    return "https://schema.org/InStock";
  }
  if (product.warehouse_status === "Made to Order") {
    return "https://schema.org/PreOrder";
  }
  return "https://schema.org/LimitedAvailability";
}

function buildProductPage(product) {
  const mappedProduct = mapProductPrefillValue(product);
  const encodedProduct = encodeURIComponent(mappedProduct);
  const canonical = `https://essencesourceusa.com/${resolveHref(product.slug)}`;
  const applications = product.applications
    .map((item) => `<li class="tag">${escapeHtml(item)}</li>`)
    .join("");
  const notes = notesTerms.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const related = buildRelatedCards(product);
  const docs = escapeHtml(product.documents.join(", "));
  const statusClass =
    product.warehouse_status === "US Warehouse Available"
      ? "status-pill status-pill--warehouse"
      : product.warehouse_status === "Made to Order"
        ? "status-pill status-pill--lead"
        : "status-pill status-pill--inquiry";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(product.name)} Supplier in USA | Essence Source</title>
    <meta name="description" content="${escapeHtml(product.summary)}" />
    <meta property="og:title" content="${escapeHtml(product.name)} Supplier in USA | Essence Source" />
    <meta property="og:description" content="${escapeHtml(product.detail_intro)}" />
    <meta property="og:type" content="product" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="https://essencesourceusa.com/${escapeHtml(product.image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(product.name)} Supplier in USA | Essence Source" />
    <meta name="twitter:description" content="${escapeHtml(product.summary)}" />
    <meta name="twitter:image" content="https://essencesourceusa.com/${escapeHtml(product.image)}" />
    <link rel="canonical" href="${canonical}" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": ${JSON.stringify(product.name)},
        "description": ${JSON.stringify(product.summary)},
        "sku": ${JSON.stringify(product.slug)},
        "image": ${JSON.stringify(`https://essencesourceusa.com/${product.image}`)},
        "brand": {
          "@type": "Brand",
          "name": "Essence Source"
        },
        "manufacturer": {
          "@type": "Organization",
          "name": "Essence Source"
        },
        "category": ${JSON.stringify(product.category)},
        "url": ${JSON.stringify(canonical)},
        "offers": {
          "@type": "Offer",
          "url": ${JSON.stringify(`https://essencesourceusa.com/contact.html?inquiry_type=quote&product=${encodedProduct}#contact-form`)},
          "availability": ${JSON.stringify(schemaAvailability(product))},
          "businessFunction": "https://schema.org/Sell",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "priceCurrency": "USD",
            "description": "Commercial pricing is provided by RFQ based on specification, volume, document needs, and shipment path."
          },
          "seller": {
            "@type": "Organization",
            "name": "Essence Source"
          }
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Botanical name",
            "value": ${JSON.stringify(product.botanical_name)}
          },
          {
            "@type": "PropertyValue",
            "name": "Specification",
            "value": ${JSON.stringify(product.specification)}
          },
          {
            "@type": "PropertyValue",
            "name": "Documentation available",
            "value": ${JSON.stringify(product.documents.join(", "))}
          },
          {
            "@type": "PropertyValue",
            "name": "Warehouse status",
            "value": ${JSON.stringify(product.warehouse_status)}
          }
        ]
      }
    </script>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://essencesourceusa.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://essencesourceusa.com/products.html"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": ${JSON.stringify(product.name)},
            "item": ${JSON.stringify(canonical)}
          }
        ]
      }
    </script>
    <link rel="stylesheet" href="assets/css/main.css" />
  </head>
  <body data-page="${escapeHtml(resolveHref(product.slug))}">
    <div class="site-shell">
      <div data-site-header></div>
      <main class="site-main" id="main-content">
        <section class="page-hero">
          <div class="container page-grid">
            <div class="stack">
              <div class="section-heading">
                <div class="section-heading__eyebrow">${escapeHtml(eyebrowForCategory(product.category))}</div>
                <h1>${escapeHtml(product.detail_heading)}</h1>
                <p class="lede">${escapeHtml(product.detail_intro)}</p>
              </div>
              <div class="image-frame">
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt)}" width="1200" height="900" loading="eager" fetchpriority="high" />
              </div>
              <span class="${statusClass}">${escapeHtml(product.warehouse_status)}</span>
              <table class="spec-table" aria-label="Product specification table">
                <caption>Product specification table</caption>
                <tbody>
                  <tr><th scope="row">Product name</th><td>${escapeHtml(product.name)}</td></tr>
                  <tr><th scope="row">Botanical name</th><td>${escapeHtml(product.botanical_name)}</td></tr>
                  <tr><th scope="row">Part used</th><td>${escapeHtml(product.part_used)}</td></tr>
                  <tr><th scope="row">Specification</th><td>${escapeHtml(product.specification)}</td></tr>
                  <tr><th scope="row">Warehouse availability</th><td>${escapeHtml(product.warehouse_status)}</td></tr>
                  <tr><th scope="row">Documentation available</th><td>${docs}</td></tr>
                </tbody>
              </table>
              <section class="info-card buying-snapshot-card">
                <h2>Buying Snapshot</h2>
                <div class="card-grid card-grid--3" style="margin-top: 1rem">
                  <article class="metric-card">
                    <span>Target grade</span>
                    <strong>${escapeHtml(product.specification)}</strong>
                  </article>
                  <article class="metric-card">
                    <span>Document path</span>
                    <strong>COA / TDS</strong>
                  </article>
                  <article class="metric-card">
                    <span>Stock path</span>
                    <strong>${escapeHtml(product.warehouse_status)}</strong>
                  </article>
                </div>
                <ul class="warehouse-checklist warehouse-checklist--dense" style="margin-top: 1rem">
                  <li>Use RFQ to confirm current lot, MOQ, packing, and lead-time range.</li>
                  <li>Sample review can be arranged by product, grade, and project fit.</li>
                  <li>Available testing files can be reviewed for qualified B2B inquiries.</li>
                </ul>
              </section>
              <section class="info-card">
                <h2>Applications</h2>
                <ul class="tag-list" style="margin-top: 1rem" role="list">${applications}</ul>
              </section>
              <section class="info-card" style="border: 1px solid rgba(67, 59, 53, 0.2); background-color: var(--color-stone-50); padding: 1.25rem; border-radius: var(--radius-sm); margin-top: 1rem;">
                <p style="font-size: 0.8rem; line-height: 1.4; color: var(--color-stone-700); margin: 0; font-weight: 500; font-family: var(--font-body);">
                  <strong>FDA DSHEA Disclaimer (21 CFR 101.93):</strong> These statements have not been evaluated by the Food and Drug Administration. This product is a bulk raw material intended for research, formulation, and manufacturing of dietary supplements or functional foods. It is not intended to diagnose, treat, cure, or prevent any disease.
                </p>
              </section>
              <section class="info-card scientific-spec-card">
                <h2>Scientific Specifications</h2>
                <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 1.25rem; margin-top: 1rem;">
                  <div>
                    <div class="spec-scientific-label">CAS Registry Number:</div>
                    <div class="spec-scientific-value font-semibold">${escapeHtml(product.cas_number || "Complex Mixture")}</div>
                  </div>
                  <div>
                    <div class="spec-scientific-label">Active Component:</div>
                    <div class="spec-scientific-value font-semibold">${escapeHtml(product.specification)}</div>
                  </div>
                  <div>
                    <div class="spec-scientific-label">Testing Methodology:</div>
                    <div class="spec-scientific-value">${escapeHtml(product.testing_methodology || "HPLC / TLC Identity Testing")}</div>
                  </div>
                  <div>
                    <div class="spec-scientific-label">Chemical Profile:</div>
                    <div class="spec-scientific-value">${escapeHtml(product.chemical_formula || "Complex Organic Matrix")}</div>
                  </div>
                </div>
              </section>
              <section class="info-card citations-card">
                <h2>Technical Document Review</h2>
                <p style="font-size: 0.88rem; color: var(--color-stone-600); margin-top: 0.25rem;">
                  Product-specific composition notes, marker methods, COA, TDS, and available third-party testing files can be reviewed during qualified B2B inquiry. Use the RFQ path to confirm the exact lot, specification, and document package.
                </p>
              </section>
              <section class="info-card">
                <h2>${escapeHtml(fitHeading(product))}</h2>
                <p>${escapeHtml(fitCopy(product))}</p>
              </section>
            </div>
            <aside class="stack">
              <div class="sidebar-card" data-inquiry-sidebar>
                <h2>Contact Sourcing Desk</h2>
                <p style="margin-top: 0.75rem;">Request pricing quotes, spec sheets, and physical samples of ${escapeHtml(product.name)}.</p>
                <div class="cluster" style="margin-top: 1rem;">
                  <a class="button button--primary" href="contact.html?inquiry_type=quote&amp;product=${encodedProduct}#contact-form">Request Quote</a>
                  <a class="button button--secondary" href="contact.html?inquiry_type=docs&amp;product=${encodedProduct}#contact-form">Request COA</a>
                </div>
                <div class="download-spec-btn-wrapper" style="border-top: 1px solid rgba(67, 59, 53, 0.1); margin-top: 1.25rem; padding-top: 1.25rem;">
                  <a class="button button--secondary button--download" href="contact.html?inquiry_type=docs&amp;product=${encodedProduct}#contact-form" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Request Spec Sheet &amp; COA Pack
                  </a>
                </div>
              </div>
              <section class="sidebar-card notes-terms-card">
                <h2>Notes & Terms</h2>
                <ul class="notes-terms-list" role="list">${notes}</ul>
              </section>
              <section class="sidebar-card">
                <h2>Related products</h2>
                <div class="card-grid" style="margin-top: 1rem">${related}</div>
              </section>
            </aside>
          </div>
        </section>
      </main>
      <div data-site-footer></div>
    </div>
    <script src="assets/data/site-content.js?v=20260604-coa-tds" defer></script>
    <script src="assets/js/main.js" defer></script>
    <script src="assets/js/nav.js" defer></script>
  </body>
</html>
`;
}

for (const slug of slugsToRegenerate) {
  const product = products.find((item) => item.slug === slug);
  if (!product) continue;
  const target = productFileMap[slug];
  fs.writeFileSync(path.join(rootDir, target), buildProductPage(product), "utf8");
}

console.log(`Regenerated ${slugsToRegenerate.length} static product pages.`);
