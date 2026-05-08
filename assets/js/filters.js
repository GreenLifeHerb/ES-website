(function () {
  async function initProductFilters() {
    const root = document.querySelector("[data-product-filters]");
    const grid = document.querySelector("[data-products-grid]");
    if (!root || !grid) return;

    const categorySelect = document.querySelector("#filter-category");
    const applicationSelect = document.querySelector("#filter-application");
    const stockSelect = document.querySelector("#filter-stock");
    const countNode = document.querySelector("[data-filter-count]");
    const productCards = Array.from(grid.querySelectorAll("[data-product-card]"));
    const emptyState = document.querySelector("[data-products-empty]");
    if (!productCards.length) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("category")) categorySelect.value = params.get("category");
    if (params.get("application"))
      applicationSelect.value = params.get("application");
    if (params.get("stock")) stockSelect.value = params.get("stock");

    function render() {
      let visibleCount = 0;

      productCards.forEach((product) => {
        const categoryMatch =
          !categorySelect.value ||
          categorySelect.value === "All Categories" ||
          product.dataset.category === categorySelect.value;
        const applicationMatch =
          !applicationSelect.value ||
          applicationSelect.value === "All Applications" ||
          (product.dataset.applications || "")
            .split("|")
            .includes(applicationSelect.value);
        const stockMatch =
          !stockSelect.value ||
          stockSelect.value === "All Stock Tags" ||
          product.dataset.stock === stockSelect.value;

        const isVisible = categoryMatch && applicationMatch && stockMatch;
        product.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
      countNode.textContent = `${visibleCount} products shown`;
    }

    [categorySelect, applicationSelect, stockSelect].forEach((select) => {
      select.addEventListener("change", render);
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", initProductFilters);
})();
