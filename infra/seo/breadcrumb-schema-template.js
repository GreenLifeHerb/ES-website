"use strict";

function buildBreadcrumbSchema(items, options = {}) {
  const baseUrl = options.baseUrl || "https://essencesourceusa.com";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: (items || []).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name || "未指定",
      item: item.url && item.url.startsWith("http") ? item.url : `${baseUrl}${item.url || "/"}`,
    })),
  };
}

module.exports = {
  buildBreadcrumbSchema,
};
