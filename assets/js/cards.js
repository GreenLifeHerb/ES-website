(function () {
  function statusClass(status) {
    if (status === "US Warehouse Available")
      return "status-pill status-pill--warehouse";
    if (status === "Made to Order") return "status-pill status-pill--lead";
    return "status-pill status-pill--inquiry";
  }

  function createProductCard(product) {
    return `
      <article class="product-card surface" data-product-card data-category="${product.category}" data-stock="${product.warehouse_status}" data-applications="${product.applications.join("|")}">
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
            <a class="button button--primary" href="contact.html?product=${encodeURIComponent(product.name)}#inquiry-form">${product.cta}</a>
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
    };
    return fileMap[slug] || `products.html?product=${encodeURIComponent(slug)}`;
  }

  async function renderHomeProducts() {
    const container = document.querySelector("[data-featured-products]");
    if (!container) return;
    const products = await window.EssenceSource.fetchJson(
      "assets/data/products.json",
    );
    const featured = products.filter((product) => product.featured).slice(0, 4);
    container.innerHTML = featured.map(createProductCard).join("");
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
              <a class="button button--primary" href="contact.html?product=${encodeURIComponent(product.name)}#inquiry-form">${product.cta}</a>
            </div>
          </article>
        `,
      )
      .join("");
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
        <h2>Inquiry sidebar</h2>
        <p style="margin-top: 0.75rem;">Request a quote, sample, or document review for ${product.name}.</p>
        <div class="cluster" style="margin-top: 1rem;">
          <a class="button button--primary" href="contact.html?product=${encodeURIComponent(product.name)}#inquiry-form">${product.cta}</a>
          <a class="button button--secondary" href="quality.html#document-request">Ask for COA</a>
        </div>
      </div>
    `;

    const relatedProducts = products
      .filter((item) => product.related_slugs.includes(item.slug))
      .slice(0, 3);
    relatedNode.innerHTML = relatedProducts.map(createProductCard).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHomeProducts();
    renderBrandIngredients();
    renderProductDetail();
  });

  window.EssenceSourceCards = {
    createProductCard,
    statusClass,
  };
})();
