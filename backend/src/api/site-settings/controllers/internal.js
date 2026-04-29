"use strict";

const { enforceRateLimit } = require("../../../utils/request-guards");

module.exports = {
  async revalidate(ctx) {
    if (
      !enforceRateLimit(ctx, {
        prefix: "internal-revalidate",
        defaultWindowMs: 60000,
        defaultMax: 30,
        windowEnvKey: "INTERNAL_RATE_LIMIT_WINDOW_MS",
        maxEnvKey: "INTERNAL_RATE_LIMIT_MAX",
      })
    ) {
      return;
    }

    const payload = ctx.request.body ?? {};

    ctx.body = {
      success: true,
      message: "Revalidation event accepted",
      payload: {
        paths: payload.paths ?? [],
        locale: payload.locale ?? null,
      },
    };
  },
};
