"use strict";

const { buildProductFilters } = require("../../../utils/filter-builder");
const { sanitizePublicProduct } = require("../../../utils/normalizers");

module.exports = {
  async list(ctx) {
    const page = Number(ctx.query.page || 1);
    const pageSize = Math.min(Number(ctx.query.pageSize || 24), 100);
    const filters = buildProductFilters(ctx.query);

    const [items, total] = await Promise.all([
      strapi.db.query("api::product.product").findMany({
        where: filters,
        populate: {
          category: true,
          partner: true,
        },
        limit: pageSize,
        offset: (page - 1) * pageSize,
        orderBy: { name: "asc" },
      }),
      strapi.db.query("api::product.product").count({
        where: filters,
      }),
    ]);

    ctx.body = {
      data: items.map(sanitizePublicProduct),
      meta: {
        pagination: {
          page,
          pageSize,
          total,
          pageCount: Math.ceil(total / pageSize) || 1,
        },
      },
    };
  },

  async findOneBySlug(ctx) {
    const item = await strapi.db.query("api::product.product").findOne({
      where: {
        slug: ctx.params.slug,
      },
      populate: {
        category: true,
        partner: true,
        certifications: true,
      },
    });

    if (!item) {
      return ctx.notFound("Product not found");
    }

    ctx.body = {
      data: sanitizePublicProduct(item),
    };
  },
};
