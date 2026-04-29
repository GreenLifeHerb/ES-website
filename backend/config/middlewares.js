"use strict";

module.exports = [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  {
    name: "strapi::body",
    config: {
      formLimit: "2mb",
      jsonLimit: "2mb",
      textLimit: "2mb",
      formidable: {
        maxFileSize: 10 * 1024 * 1024,
      },
    },
  },
  "strapi::favicon",
  "strapi::public",
];
