"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/public/products",
      handler: "public.list",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/public/products/:slug",
      handler: "public.findOneBySlug",
      config: {
        auth: false,
      },
    },
  ],
};
