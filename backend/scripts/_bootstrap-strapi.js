"use strict";

async function loadStrapi() {
  const strapiModule = require("@strapi/strapi");

  if (typeof strapiModule.createStrapi === "function") {
    const app = await strapiModule.createStrapi();
    await app.load();
    return app;
  }

  if (typeof strapiModule === "function") {
    const app = await strapiModule();
    if (typeof app.load === "function") {
      await app.load();
    }
    return app;
  }

  throw new Error("Unable to bootstrap Strapi. Check the installed @strapi/strapi version.");
}

async function destroyStrapi(app) {
  if (app && typeof app.destroy === "function") {
    await app.destroy();
  }
}

module.exports = {
  loadStrapi,
  destroyStrapi,
};
