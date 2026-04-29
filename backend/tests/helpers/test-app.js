"use strict";

const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");

const productController = require("../../src/api/product/controllers/public");
const partnerController = require("../../src/api/partner-profile/controllers/public");
const inquiryController = require("../../src/api/inquiry/controllers/public");
const inventoryController = require("../../src/api/inventory-snapshot/controllers/internal");
const internalApiKeyPolicy = require("../../src/policies/internal-api-key");

function createApiApp(strapiMock) {
  global.strapi = strapiMock;

  const app = new Koa();
  const router = new Router();

  app.use(async (ctx, next) => {
    ctx.notFound = (message) => {
      ctx.status = 404;
      ctx.body = {
        error: message || "Not found",
      };
    };
    await next();
  });

  app.use(bodyParser());

  router.get("/api/public/products", async (ctx) => productController.list(ctx));
  router.get("/api/public/products/:slug", async (ctx) => productController.findOneBySlug(ctx));
  router.get("/api/public/partner/:slug", async (ctx) => partnerController.findOneBySlug(ctx));
  router.post("/api/public/inquiries", async (ctx) => inquiryController.create(ctx));
  router.post("/api/internal/inventory/sync", async (ctx) => {
    const allowed = await internalApiKeyPolicy({ request: ctx.request }, {}, { strapi: strapiMock });

    if (!allowed) {
      ctx.status = 403;
      ctx.body = {
        success: false,
        message: "Forbidden",
      };
      return;
    }

    await inventoryController.sync(ctx);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app.callback();
}

function createQueryRegistry(handlers) {
  return {
    db: {
      query(uid) {
        if (!handlers[uid]) {
          throw new Error(`Missing query mock for ${uid}`);
        }
        return handlers[uid];
      },
    },
    log: {
      error: jest.fn(),
    },
    config: {
      get(key) {
        if (key === "server.internalApiKey") {
          return "internal-secret";
        }
        return undefined;
      },
    },
  };
}

module.exports = {
  createApiApp,
  createQueryRegistry,
};
