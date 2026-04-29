"use strict";

const { sanitizeSiteSettings } = require("../../../utils/normalizers");

module.exports = {
  async find(ctx) {
    const item = await strapi.db.query("api::site-settings.site-settings").findOne({
      where: {},
    });

    ctx.body = {
      data: sanitizeSiteSettings(item ?? {}),
    };
  },
};
