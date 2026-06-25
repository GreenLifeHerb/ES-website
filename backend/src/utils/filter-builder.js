"use strict";

function buildProductFilters(query) {
  const filters = {};

  if (query.category) {
    filters.category = { slug: query.category };
  }

  if (query.warehouse_status) {
    filters.warehouse_status = query.warehouse_status;
  }

  if (query.tag) {
    filters.tags = { $contains: query.tag };
  }

  if (query.application) {
    filters.applications = { $contains: query.application };
  }

  if (query.locale) {
    filters.locale = query.locale;
  }

  return filters;
}

module.exports = {
  buildProductFilters,
};
