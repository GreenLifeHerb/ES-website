"use strict";

const { sanitizeWarehouse } = require("../../../utils/normalizers");

module.exports = {
  async list(ctx) {
    const items = await strapi.db.query("api::warehouse-location.warehouse-location").findMany({
      orderBy: [{ is_primary: "desc" }, { name: "asc" }],
    });

    ctx.body = {
      data: items.map(sanitizeWarehouse),
    };
  },
};
