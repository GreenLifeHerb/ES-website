"use strict";

const { sanitizeCategory } = require("../../../utils/normalizers");

module.exports = {
  async list(ctx) {
    const items = await strapi.db.query("api::product-category.product-category").findMany({
      orderBy: { name: "asc" },
    });

    ctx.body = {
      data: items.map(sanitizeCategory),
    };
  },
};
