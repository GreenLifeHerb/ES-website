"use strict";

function buildProductSchema(product, options = {}) {
  const baseUrl = options.baseUrl || "https://essencesourceusa.com";
  const pagePath = product.pagePath || product.url || `/products/${product.slug || ""}`;
  const url = pagePath.startsWith("http") ? pagePath : `${baseUrl}${pagePath}`;
  const documents = Array.isArray(product.documents) ? product.documents : [];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name || "未指定",
    description: product.description || product.summary || "未指定",
    sku: product.sku || product.slug || "未指定",
    brand: {
      "@type": "Brand",
      name: product.brand || "Essence Source",
    },
    category: product.category || "未指定",
    url,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Botanical name",
        value: product.botanical_name || product.botanicalName || "未指定",
      },
      {
        "@type": "PropertyValue",
        name: "Specification",
        value: product.specification || "未指定",
      },
      {
        "@type": "PropertyValue",
        name: "Documentation available",
        value: documents.length ? documents.join(", ") : "Available by Inquiry",
      },
      {
        "@type": "PropertyValue",
        name: "Warehouse status",
        value: product.warehouse_status || product.warehouseStatus || "Available by Inquiry",
      },
    ],
  };
}

module.exports = {
  buildProductSchema,
};
