"use strict";

module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  url: env("PUBLIC_BASE_URL", "http://127.0.0.1:1337"),
  internalApiKey: env("INTERNAL_API_KEY"),
});
