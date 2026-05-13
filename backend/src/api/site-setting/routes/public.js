"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/public/site-settings",
      handler: "public.find",
      config: {
        auth: false,
      },
    },
  ],
};
