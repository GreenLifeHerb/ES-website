"use strict";

const inventorySyncService = require("../services/inventory-sync");
const { enforceRateLimit } = require("../../../utils/request-guards");

module.exports = {
  async sync(ctx) {
    if (
      !enforceRateLimit(ctx, {
        prefix: "internal-inventory-sync",
        defaultWindowMs: 60000,
        defaultMax: 60,
        windowEnvKey: "INTERNAL_RATE_LIMIT_WINDOW_MS",
        maxEnvKey: "INTERNAL_RATE_LIMIT_MAX",
      })
    ) {
      return;
    }

    const result = await inventorySyncService.syncInventory(ctx.request.body);
    ctx.body = result;
  },
};
