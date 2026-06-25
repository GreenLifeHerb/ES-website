"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/public/faqs",
      handler: "public.list",
      config: {
        auth: false,
      },
    },
  ],
};
