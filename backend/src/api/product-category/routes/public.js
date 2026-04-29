"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/public/categories",
      handler: "public.list",
      config: {
        auth: false,
      },
    },
  ],
};
