"use strict";

function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

function nullable(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return value;
}

function sanitizePublicProduct(product) {
  return {
    id: product.id ?? null,
    documentId: product.documentId ?? null,
    name: product.name ?? null,
    slug: product.slug ?? null,
    short_description: nullable(product.short_description),
    full_description: nullable(product.full_description),
    botanical_name: nullable(product.botanical_name),
    part_used: nullable(product.part_used),
    main_component: nullable(product.main_component),
    specification: nullable(product.specification),
    test_method: nullable(product.test_method),
    applications: asArray(product.applications),
    documentation_available: asArray(product.documentation_available),
    documentation_links: product.documentation_links ?? [],
    warehouse_status: nullable(product.warehouse_status),
    lead_time: nullable(product.lead_time),
    moq: nullable(product.moq),
    tags: asArray(product.tags),
    category: product.category
      ? {
          id: product.category.id ?? null,
          documentId: product.category.documentId ?? null,
          name: product.category.name ?? null,
          slug: product.category.slug ?? null,
        }
      : null,
    partner: product.partner
      ? {
          id: product.partner.id ?? null,
          documentId: product.partner.documentId ?? null,
          partner_name: product.partner.partner_name ?? null,
          slug: product.partner.slug ?? null,
        }
      : null,
    seo: product.seo ?? null,
    updatedAt: product.updatedAt ?? null,
    locale: product.locale ?? null,
  };
}

function sanitizeCategory(category) {
  return {
    id: category.id ?? null,
    documentId: category.documentId ?? null,
    name: category.name ?? null,
    slug: category.slug ?? null,
    description: nullable(category.description),
    applications: asArray(category.applications),
    seo: category.seo ?? null,
    locale: category.locale ?? null,
  };
}

function sanitizeWarehouse(warehouse) {
  return {
    id: warehouse.id ?? null,
    documentId: warehouse.documentId ?? null,
    name: warehouse.name ?? null,
    country: nullable(warehouse.country),
    state: nullable(warehouse.state),
    city: nullable(warehouse.city),
    display_address: nullable(warehouse.display_address),
    coverage_note: nullable(warehouse.coverage_note),
    is_primary: Boolean(warehouse.is_primary),
    locale: warehouse.locale ?? null,
  };
}

function sanitizeFaq(faq) {
  return {
    id: faq.id ?? null,
    question: faq.question ?? null,
    answer: faq.answer ?? null,
    sort_order: faq.sort_order ?? 0,
    locale: faq.locale ?? null,
  };
}

function sanitizeSiteSettings(settings) {
  return {
    id: settings.id ?? null,
    global_cta_labels: settings.global_cta_labels ?? {},
    legal_disclaimers: settings.legal_disclaimers ?? {},
    social_links: settings.social_links ?? {},
    seo_defaults: settings.seo_defaults ?? null,
    locale: settings.locale ?? null,
  };
}

module.exports = {
  asArray,
  nullable,
  sanitizeCategory,
  sanitizeFaq,
  sanitizePublicProduct,
  sanitizeSiteSettings,
  sanitizeWarehouse,
};
