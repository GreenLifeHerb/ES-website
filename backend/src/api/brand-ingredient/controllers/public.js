"use strict";

module.exports = {
  async list(ctx) {
    const items = await strapi.db.query("api::brand-ingredient.brand-ingredient").findMany({
      populate: {
        related_products: true,
      },
      orderBy: { brand_name: "asc" },
    });

    ctx.body = {
      data: items.map((item) => ({
        id: item.id ?? null,
        documentId: item.documentId ?? null,
        brand_name: item.brand_name ?? null,
        slug: item.slug ?? null,
        story: item.story ?? null,
        differentiators: item.differentiators ?? [],
        related_products: (item.related_products ?? []).map((product) => ({
          id: product.id ?? null,
          documentId: product.documentId ?? null,
          name: product.name ?? null,
          slug: product.slug ?? null,
        })),
        locale: item.locale ?? null,
      })),
    };
  },
};
