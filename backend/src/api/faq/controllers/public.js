"use strict";

const { sanitizeFaq } = require("../../../utils/normalizers");

module.exports = {
  async list(ctx) {
    const items = await strapi.db.query("api::faq.faq").findMany({
      orderBy: [{ sort_order: "asc" }, { createdAt: "asc" }],
    });

    ctx.body = {
      data: items.map(sanitizeFaq),
    };
  },
};
