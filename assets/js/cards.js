(function () {
  const salesEmail = "info@essencesourceusa.com";

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

  function statusClass(status) {
    if (status === "US Warehouse Available")
      return "status-pill status-pill--warehouse";
    if (status === "Made to Order") return "status-pill status-pill--lead";
    return "status-pill status-pill--inquiry";
  }

  function createProductCard(product) {
    return `
      <article class="product-card surface" data-product-card data-slug="${product.slug}" data-category="${product.category}" data-stock="${product.warehouse_status}" data-applications="${product.applications.join("|")}">
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
            <a class="button button--primary" href="${buildProductMailto(product.name)}">Email sales</a>
          </div>
        </div>
      </article>
    `;
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

  async function renderHomeProducts() {
    const container = document.querySelector("[data-brand-ingredient-cards]");
    if (!container) return;
    const items = window.ESSENCE_SOURCE_CONTENT.brandIngredients || [];
    container.innerHTML = items
      .map(
        (item) => `
          <article class="product-card surface product-card--brand">
            <div class="product-card__media">
              <img src="${item.image}" alt="${item.alt}" width="1200" height="900" loading="lazy">
            </div>
            <div class="product-card__body">
              <div class="brand-kicker">${item.brand}</div>
              <div>
                <h3><a href="${item.href}">${item.ingredient}</a></h3>
                <p>${item.summary}</p>
              </div>
              <div class="tag-list">
                ${item.markers.map((marker) => `<span class="tag">${marker}</span>`).join("")}
              </div>
              <div class="product-card__applications">
                <strong>Applications</strong>
                <ul class="product-card__application-list">
                  ${item.applications.map((application) => `<li>${application}</li>`).join("")}
                </ul>
              </div>
              <div class="cluster product-card__actions">
                <a class="button button--secondary" href="${item.href}">${item.cta}</a>
                <a class="button button--primary" href="${buildProductMailto(item.ingredient)}">Email sales</a>
              </div>
            </div>
          </article>
        `,
      )
      .join("");
  }

  async function renderBrandIngredients() {
    const container = document.querySelector("[data-brand-products]");
    if (!container) return;
    const products = await window.EssenceSource.fetchJson(
      "assets/data/products.json",
    );
    const featured = products.filter((product) => product.featured);
    container.innerHTML = featured
      .map(
        (product) => `
          <article class="info-card">
            <div class="cluster">
              <span class="tag">${product.category}</span>
              <span class="${statusClass(product.warehouse_status)}">${product.warehouse_status}</span>
            </div>
            <h3 style="font-family: var(--font-display); font-size: 1.7rem; margin-top: 0.9rem;">${product.name}</h3>
            <p style="margin-top: 0.8rem;">${product.summary}</p>
            <div class="tag-list" style="margin-top: 1rem;">
              ${product.applications.map((application) => `<span class="tag">${application}</span>`).join("")}
            </div>
            <div class="cluster" style="margin-top: 1rem;">
              <a class="button button--secondary" href="${resolveProductHref(product.slug)}">View ingredient</a>
              <a class="button button--primary" href="${buildProductMailto(product.name)}">Email sales</a>
            </div>
          </article>
        `,
      )
      .join("");
  }

  async function renderWarehouseProducts() {
    const container = document.querySelector("[data-warehouse-products]");
    if (!container) return;
    const products = await window.EssenceSource.fetchJson(
      "assets/data/products.json",
    );
    const warehouseProducts = products
      .filter((product) => product.warehouse_status === "US Warehouse Available")
      .slice(0, 3);
    container.innerHTML = warehouseProducts.map(createProductCard).join("");
  }

  async function renderProductDetail() {
    const detailRoot = document.querySelector("[data-product-detail]");
    if (!detailRoot) return;

    const slug = detailRoot.dataset.productDetail;
    const products = await window.EssenceSource.fetchJson(
      "assets/data/products.json",
    );
    const product = products.find((item) => item.slug === slug);
    if (!product) return;

    const titleNode = detailRoot.querySelector("[data-product-name]");
    const introNode = detailRoot.querySelector("[data-product-intro]");
    const tableBody = detailRoot.querySelector("[data-spec-body]");
    const applicationsNode = detailRoot.querySelector(
      "[data-product-applications]",
    );
    const documentsNode = detailRoot.querySelector("[data-product-documents]");
    const statusNode = detailRoot.querySelector("[data-product-status]");
    const inquiryNode = detailRoot.querySelector("[data-inquiry-sidebar]");
    const relatedNode = detailRoot.querySelector("[data-related-products]");
    const mediaNode = detailRoot.querySelector("[data-product-image]");
    const notesTerms = window.ESSENCE_SOURCE_CONTENT.notesTerms;

    titleNode.textContent = product.detail_heading;
    introNode.textContent = product.detail_intro;
    statusNode.className = statusClass(product.warehouse_status);
    statusNode.textContent = product.warehouse_status;
    mediaNode.innerHTML = `<img src="${product.image}" alt="${product.alt}" width="1200" height="900" loading="eager" fetchpriority="high">`;

    tableBody.innerHTML = `
      <tr><th scope="row">Product name</th><td>${product.name}</td></tr>
      <tr><th scope="row">Botanical name</th><td>${product.botanical_name}</td></tr>
      <tr><th scope="row">Part used</th><td>${product.part_used}</td></tr>
      <tr><th scope="row">Specification</th><td>${product.specification}</td></tr>
      <tr><th scope="row">Warehouse availability</th><td>${product.warehouse_status}</td></tr>
      <tr><th scope="row">Documentation available</th><td>${product.documents.join(", ")}</td></tr>
    `;

    applicationsNode.innerHTML = product.applications
      .map((application) => `<li class="tag">${application}</li>`)
      .join("");
    documentsNode.innerHTML = product.documents
      .map((documentName) => `<li class="tag">${documentName}</li>`)
      .join("");

    inquiryNode.innerHTML = `
      <div class="sidebar-card">
        <h2>Contact sales</h2>
        <p style="margin-top: 0.75rem;">Email our team for pricing, samples, specification review, or document support for ${product.name}.</p>
        <div class="cluster" style="margin-top: 1rem;">
          <a class="button button--primary" href="${buildProductMailto(product.name)}">Email sales</a>
          <a class="button button--secondary" href="${buildProductMailto(product.name, "docs")}">Email for documents</a>
        </div>
      </div>
      <section class="sidebar-card notes-terms-card">
        <h2>${notesTerms.title}</h2>
        <ul class="notes-terms-list" role="list">
          ${notesTerms.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </section>
    `;

    const relatedProducts = products
      .filter((item) => product.related_slugs.includes(item.slug))
      .slice(0, 3);
    relatedNode.innerHTML = relatedProducts.map(createProductCard).join("");
  }

  async function renderProductCollectionPage() {
    const collectionRoot = document.querySelector("[data-product-collection]");
    if (!collectionRoot) return;

    const category = collectionRoot.dataset.productCollection;
    const gridNode = collectionRoot.querySelector("[data-collection-grid]");
    const countNode = collectionRoot.querySelector("[data-collection-count]");
    if (!gridNode) return;

    const products = await window.EssenceSource.fetchJson(
      "assets/data/products.json",
    );
    const matchedProducts = products.filter(
      (product) => product.category === category,
    );

    gridNode.innerHTML = matchedProducts.map(createProductCard).join("");
    if (countNode) {
      countNode.textContent = `${matchedProducts.length} products in this collection`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHomeProducts();
    renderBrandIngredients();
    renderWarehouseProducts();
    renderProductDetail();
    renderProductCollectionPage();
  });

  window.EssenceSourceCards = {
    createProductCard,
    statusClass,
  };
})();
