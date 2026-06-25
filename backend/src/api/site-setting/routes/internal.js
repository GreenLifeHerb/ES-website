"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/internal/revalidate",
      handler: "internal.revalidate",
      config: {
        policies: ["global::internal-api-key"],
      },
    },
  ],
};
