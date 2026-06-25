"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/public/inquiries",
      handler: "public.create",
      config: {
        auth: false,
      },
    },
  ],
};
