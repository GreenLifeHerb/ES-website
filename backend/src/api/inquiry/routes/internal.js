"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/internal/inquiries/export",
      handler: "internal.exportCsv",
      config: {
        auth: false,
        policies: ["global::internal-api-key"],
      },
    },
  ],
};
