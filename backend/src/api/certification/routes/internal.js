"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/internal/certifications/import",
      handler: "internal.importMany",
      config: {
        auth: false,
        policies: ["global::internal-api-key"],
      },
    },
  ],
};
