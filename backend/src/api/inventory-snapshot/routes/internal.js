"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/internal/inventory/sync",
      handler: "internal.sync",
      config: {
        auth: false,
        policies: ["global::internal-api-key"],
      },
    },
  ],
};
