"use strict";

const { enforceRateLimit } = require("../../../utils/request-guards");

module.exports = {
  async importMany(ctx) {
    if (
      !enforceRateLimit(ctx, {
        prefix: "internal-certification-import",
        defaultWindowMs: 60000,
        defaultMax: 30,
        windowEnvKey: "INTERNAL_RATE_LIMIT_WINDOW_MS",
        maxEnvKey: "INTERNAL_RATE_LIMIT_MAX",
      })
    ) {
      return;
    }

    const items = ctx.request.body?.items ?? [];
    let imported = 0;

    for (const item of items) {
      await strapi.db.query("api::certification.certification").create({
        data: {
          name: item.name,
          issuer: item.issuer ?? null,
          valid_until: item.valid_until ?? null,
          applies_to: item.applies_to ?? [],
        },
      });
      imported += 1;
    }

    ctx.body = {
      success: true,
      imported,
    };
  },
};
