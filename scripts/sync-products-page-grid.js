const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const productsPath = path.join(root, "assets", "data", "products.json");
const pagePath = path.join(root, "products.html");

const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
let html = fs.readFileSync(pagePath, "utf8");

function statusClass(status) {
  if (status === "US Warehouse Available") {
    return "status-pill status-pill--warehouse";
  }
  if (status === "Made to Order") {
    return "status-pill status-pill--lead";
  }
  return "status-pill status-pill--inquiry";
}

function resolveProductHref(slug) {
  const fileMap = {
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

  return fileMap[slug] || `products.html?product=${encodeURIComponent(slug)}`;
}

function buildMailto(productName) {
  return `mailto:info@essencesourceusa.com?subject=${encodeURIComponent(
    `Essence Source inquiry - ${productName}`,
  )}`;
}

function createProductCard(product) {
  return `              <article class="product-card surface" data-product-card data-slug="${product.slug}" data-category="${product.category}" data-stock="${product.warehouse_status}" data-applications="${product.applications.join("|")}">
                <div class="product-card__media">
                  <img src="${product.image}" alt="${product.alt}" width="1200" height="900" loading="lazy">
                </div>
                <div class="product-card__body">
                  <div class="product-card__meta">
                    <span class="tag">${product.category}</span>
                    <span class="${statusClass(product.warehouse_status)}">${product.warehouse_status}</span>
                  </div>
                  <div>
                    <h3><a href="${resolveProductHref(product.slug)}">${product.name}</a></h3>
                    <p>${product.summary}</p>
                  </div>
                  <div class="tag-list">
                    ${product.applications.map((application) => `<span class="tag">${application}</span>`).join("")}
                  </div>
                  <div class="cluster">
                    <a class="button button--secondary" href="${resolveProductHref(product.slug)}">View details</a>
                    <a class="button button--primary" href="${buildMailto(product.name)}">Email sales</a>
                  </div>
                </div>
              </article>`;
}

const newGrid = `            <div class="card-grid card-grid--3" data-products-grid>
${products.map(createProductCard).join("\n")}
            </div>`;

html = html.replace(
  /            <div class="card-grid card-grid--3" data-products-grid>[\s\S]*?            <\/div>\r?\n            <div class="empty-state"/,
  `${newGrid}\n            <div class="empty-state"`,
);

fs.writeFileSync(pagePath, html);
console.log(`Synced products grid with ${products.length} products.`);
