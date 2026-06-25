"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/public/warehouse",
      handler: "public.list",
      config: {
        auth: false,
      },
    },
  ],
};
