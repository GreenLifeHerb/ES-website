(function () {
  async function initProductFilters() {
    const root = document.querySelector("[data-product-filters]");
    const grid = document.querySelector("[data-products-grid]");
    if (!root || !grid) return;

    const [products, categories] = await Promise.all([
      window.EssenceSource.fetchJson("assets/data/products.json"),
      window.EssenceSource.fetchJson("assets/data/categories.json"),
    ]);

    const categorySelect = document.querySelector("#filter-category");
    const applicationSelect = document.querySelector("#filter-application");
    const stockSelect = document.querySelector("#filter-stock");
    const countNode = document.querySelector("[data-filter-count]");

    fillSelect(categorySelect, categories.categories);
    fillSelect(applicationSelect, categories.applications);
    fillSelect(stockSelect, categories.stock_tags);

    const params = new URLSearchParams(window.location.search);
    if (params.get("category")) categorySelect.value = params.get("category");
    if (params.get("application"))
      applicationSelect.value = params.get("application");
    if (params.get("stock")) stockSelect.value = params.get("stock");

    function render() {
      const filtered = products.filter((product) => {
        const categoryMatch =
          !categorySelect.value ||
          categorySelect.value === "All Categories" ||
          product.category === categorySelect.value;
        const applicationMatch =
          !applicationSelect.value ||
          applicationSelect.value === "All Applications" ||
          product.applications.includes(applicationSelect.value);
        const stockMatch =
          !stockSelect.value ||
          stockSelect.value === "All Stock Tags" ||
          product.warehouse_status === stockSelect.value;
        return categoryMatch && applicationMatch && stockMatch;
      });

      grid.innerHTML = filtered.length
        ? filtered.map(window.EssenceSourceCards.createProductCard).join("")
        : '<div class="empty-state"><h2>No matching products</h2><p>Try a broader filter or contact us for an inquiry-based match.</p></div>';
      countNode.textContent = `${filtered.length} products shown`;
    }

    [categorySelect, applicationSelect, stockSelect].forEach((select) => {
      select.addEventListener("change", render);
    });

    render();
  }

  function fillSelect(select, values) {
    if (!select) return;
    select.innerHTML = values
      .map((value) => `<option value="${value}">${value}</option>`)
      .join("");
  }

  document.addEventListener("DOMContentLoaded", initProductFilters);
})();
