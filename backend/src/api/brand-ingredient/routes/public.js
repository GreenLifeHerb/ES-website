"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/public/brand-ingredients",
      handler: "public.list",
      config: {
        auth: false,
      },
    },
  ],
};
