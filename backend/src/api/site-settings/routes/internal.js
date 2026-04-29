"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/internal/revalidate",
      handler: "internal.revalidate",
      config: {
        auth: false,
        policies: ["global::internal-api-key"],
      },
    },
  ],
};
