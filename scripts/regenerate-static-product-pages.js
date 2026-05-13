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
  "COA, MSDS, and third-party testing reports are available upon request.",
  "Products are suitable for dietary supplement, functional food, and cosmetic applications.",
  "For pricing, availability, and sample requests, please reach out via our official contact channels.",
];

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

const slugsToRegenerate = [
  "aloe-extract",
  "alfalfa-extract",
  "apple-cider-vinegar-powder",
  "ashwagandha-root-extract",
  "astragalus-extract",
  "beet-root-powder",
  "burdock-extract",
  "celery-seed-extract",
  "chaga-extract",
  "cinnamon-extract-4-1",
  "cinnamon-extract",
  "dandelion-leaf-extract",
  "dandelion-root-extract",
  "dioscorea-nipponica-extract",
  "echinacea-extract",
  "elderberry-extract",
  "eyebright-extract",
  "fisetin-cotinus-coggygria-extract",
  "ginger-root-extract",
  "grape-seed-extract",
  "hibiscus-flower-extract",
  "horsetail-extract",
  "ivy-extract",
  "kelp-extract-4-1",
  "kelp-extract",
  "lemon-balm-extract",
  "lions-mane-extract",
  "maca-extract",
  "marshmallow-extract",
  "nettle-extract",
  "reishi-mushroom-extract",
  "rosemary-extract",
  "rosehip-extract",
  "roxburgh-rose-extract",
  "saw-palmetto-extract",
  "shiitake-mushroom-extract",
  "shilajit-extract",
  "soybean-extract",
  "st-johns-wort-extract",
  "thyme-extract",
  "turkey-tail-mushroom-extract",
  "valerian-extract",
  "white-willow-bark-extract",
  "wolfberry-extract",
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

function buildProductPage(product) {
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
    <meta name="description" content="${escapeHtml(product.name)} for ${escapeHtml(product.applications.join(" and ").toLowerCase())} with U.S.-market inquiry support." />
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
    <link rel="stylesheet" href="assets/css/reset.css" />
    <link rel="stylesheet" href="assets/css/tokens.css" />
    <link rel="stylesheet" href="assets/css/layout.css" />
    <link rel="stylesheet" href="assets/css/components.css" />
    <link rel="stylesheet" href="assets/css/pages.css" />
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
              <table class="spec-table">
                <caption>Specification and documentation overview</caption>
                <tbody>
                  <tr><th scope="row">Product name</th><td>${escapeHtml(product.name)}</td></tr>
                  <tr><th scope="row">Botanical name</th><td>${escapeHtml(product.botanical_name)}</td></tr>
                  <tr><th scope="row">Part used</th><td>${escapeHtml(product.part_used)}</td></tr>
                  <tr><th scope="row">Specification</th><td>${escapeHtml(product.specification)}</td></tr>
                  <tr><th scope="row">Warehouse availability</th><td>${escapeHtml(product.warehouse_status)}</td></tr>
                  <tr><th scope="row">Documentation available</th><td>${docs}</td></tr>
                </tbody>
              </table>
              <section class="info-card">
                <h2>Applications</h2>
                <ul class="tag-list" style="margin-top: 1rem" role="list">${applications}</ul>
              </section>
              <section class="info-card">
                <h2>${escapeHtml(fitHeading(product))}</h2>
                <p>${escapeHtml(fitCopy(product))}</p>
              </section>
            </div>
            <aside class="stack">
              <div class="sidebar-card">
                <h2>Inquiry sidebar</h2>
                <p style="margin-top: 0.75rem;">Request a quote, sample, or document review for ${escapeHtml(product.name)}.</p>
                <div class="cluster" style="margin-top: 1rem;">
                  <a class="button button--primary" href="contact.html?product=${encodeURIComponent(product.name)}#inquiry-form">${escapeHtml(product.cta)}</a>
                  <a class="button button--secondary" href="contact.html?product=${encodeURIComponent(product.name)}&inquiry_type=docs#inquiry-form">Ask for COA</a>
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
    <script src="assets/data/site-content.js" defer></script>
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
