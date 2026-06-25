"use strict";

const frontendOrigins = (
  process.env.FRONTEND_ORIGINS ||
  "http://127.0.0.1:4173,http://localhost:4173,https://essencesourceusa.com"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      origin: frontendOrigins,
      headers: ["Content-Type", "Authorization", "Origin", "Accept"],
      methods: ["GET", "POST", "OPTIONS"],
      keepHeaderOnError: true,
    },
  },
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
