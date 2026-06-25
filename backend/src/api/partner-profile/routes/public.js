"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/public/partner/:slug",
      handler: "public.findOneBySlug",
      config: {
        auth: false,
      },
    },
  ],
};
