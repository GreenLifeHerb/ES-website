"use strict";

const request = require("supertest");

const inventoryService = require("../src/api/inventory-snapshot/services/inventory-sync");
const { createApiApp, createQueryRegistry } = require("./helpers/test-app");

describe("inventory sync", () => {
  test("syncInventory updates warehouse status and lead time", async () => {
    const products = [
      {
        id: 11,
        slug: "green-coffee-bean-extract",
        warehouse_status: "available_by_inquiry",
        lead_time: "Please confirm",
      },
    ];

    const inventorySnapshots = [];

    global.strapi = createQueryRegistry({
      "api::warehouse-location.warehouse-location": {
        findOne: jest.fn(() => Promise.resolve({ id: 101, name: "US-East" })),
      },
      "api::product.product": {
        findOne: jest.fn(({ where }) =>
          Promise.resolve(products.find((item) => item.slug === where.slug) || null),
        ),
        update: jest.fn(({ where, data }) => {
          const product = products.find((item) => item.id === where.id);
          Object.assign(product, data);
          return Promise.resolve(product);
        }),
      },
      "api::inventory-snapshot.inventory-snapshot": {
        findOne: jest.fn(({ where }) =>
          Promise.resolve(
            inventorySnapshots.find(
              (item) =>
                item.sku === where.sku &&
                item.product === where.product &&
                item.warehouse === where.warehouse,
            ) || null,
          ),
        ),
        create: jest.fn(({ data }) => {
          inventorySnapshots.push({ id: 1, ...data });
          return Promise.resolve({ id: 1, ...data });
        }),
        update: jest.fn(({ where, data }) => {
          const snapshot = inventorySnapshots.find((item) => item.id === where.id);
          Object.assign(snapshot, data);
          return Promise.resolve(snapshot);
        }),
      },
    });
    global.strapi.log = { error: jest.fn() };

    const result = await inventoryService.syncInventory({
      warehouse: "US-East",
      items: [
        {
          sku: "GCBE-50-HPLC",
          slug: "green-coffee-bean-extract",
          status: "in_us_stock",
          lead_time: "2-5 business days",
        },
      ],
    });

    expect(result).toEqual({
      success: true,
      updated: 1,
      failed: 0,
    });
    expect(products[0].warehouse_status).toBe("in_us_stock");
    expect(products[0].lead_time).toBe("2-5 business days");
    expect(inventorySnapshots[0].quantity_status).toBe("in_us_stock");
  });

  test("POST /api/internal/inventory/sync rejects requests without API key", async () => {
    const strapiMock = createQueryRegistry({
      "api::warehouse-location.warehouse-location": {
        findOne: jest.fn(() => Promise.resolve({ id: 101, name: "US-East" })),
      },
      "api::product.product": {
        findOne: jest.fn(() => Promise.resolve(null)),
        update: jest.fn(),
      },
      "api::inventory-snapshot.inventory-snapshot": {
        findOne: jest.fn(() => Promise.resolve(null)),
        create: jest.fn(),
        update: jest.fn(),
      },
      "api::inquiry.inquiry": {
        count: jest.fn(() => Promise.resolve(0)),
        create: jest.fn(),
      },
      "api::partner-profile.partner-profile": {
        findOne: jest.fn(() => Promise.resolve(null)),
      },
    });

    const response = await request(createApiApp(strapiMock))
      .post("/api/internal/inventory/sync")
      .send({
        warehouse: "US-East",
        items: [],
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
