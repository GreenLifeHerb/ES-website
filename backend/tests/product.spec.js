"use strict";

const request = require("supertest");

const { createApiApp, createQueryRegistry } = require("./helpers/test-app");

describe("public product APIs", () => {
  const baseProducts = [
    {
      id: 1,
      documentId: "doc-green",
      name: "Green Coffee Bean Extract",
      slug: "green-coffee-bean-extract",
      short_description: "Short description",
      full_description: "Full description",
      botanical_name: "Coffea arabica L.",
      part_used: "Fruit",
      main_component: "Chlorogenic acids",
      specification: "Chlorogenic acids 10%-60% HPLC",
      test_method: "HPLC",
      applications: ["Dietary Supplements"],
      documentation_available: ["COA", "TDS"],
      documentation_links: [],
      warehouse_status: "in_us_stock",
      lead_time: "2-5 business days",
      moq: "Available by Inquiry",
      tags: ["us-warehouse"],
      internal_notes: "should never leak",
      category: {
        id: 10,
        documentId: "cat-1",
        name: "Botanical Extracts",
        slug: "botanical-extracts",
      },
      partner: {
        id: 30,
        documentId: "partner-1",
        partner_name: "GL Herb",
        slug: "gl-herb",
      },
      locale: "en",
      updatedAt: "2026-04-27T10:00:00.000Z",
    },
    {
      id: 2,
      documentId: "doc-black",
      name: "Black Ginger Extract",
      slug: "black-ginger-extract",
      botanical_name: "Kaempferia parviflora Wall. ex Baker",
      applications: ["Dietary Supplements"],
      documentation_available: ["COA"],
      documentation_links: [],
      warehouse_status: "available_by_inquiry",
      tags: ["standardized"],
      category: {
        id: 10,
        documentId: "cat-1",
        name: "Botanical Extracts",
        slug: "botanical-extracts",
      },
      partner: {
        id: 30,
        documentId: "partner-1",
        partner_name: "GL Herb",
        slug: "gl-herb",
      },
      locale: "en",
    },
  ];

  function buildApp() {
    const strapiMock = createQueryRegistry({
      "api::product.product": {
        findMany: jest.fn(({ where }) => {
          if (where?.warehouse_status) {
            return Promise.resolve(
              baseProducts.filter((item) => item.warehouse_status === where.warehouse_status),
            );
          }
          return Promise.resolve(baseProducts);
        }),
        count: jest.fn(({ where }) => {
          if (where?.warehouse_status) {
            return Promise.resolve(
              baseProducts.filter((item) => item.warehouse_status === where.warehouse_status).length,
            );
          }
          return Promise.resolve(baseProducts.length);
        }),
        findOne: jest.fn(({ where }) =>
          Promise.resolve(baseProducts.find((item) => item.slug === where.slug) || null),
        ),
      },
      "api::partner-profile.partner-profile": {
        findOne: jest.fn(({ where }) =>
          Promise.resolve(
            where.slug === "gl-herb"
              ? {
                  id: 30,
                  documentId: "partner-1",
                  partner_name: "GL Herb",
                  slug: "gl-herb",
                  overview: "Manufacturing partner overview",
                  capabilities: ["Botanical extraction"],
                  lab_capabilities: ["HPLC support"],
                  disclaimer: "Managed by CMS",
                  certifications: [],
                  products: baseProducts,
                  locale: "en",
                }
              : null,
          ),
        ),
      },
      "api::inquiry.inquiry": {
        count: jest.fn(() => Promise.resolve(0)),
        create: jest.fn(({ data }) => Promise.resolve({ id: 1, ...data })),
      },
      "api::warehouse-location.warehouse-location": {
        findOne: jest.fn(() => Promise.resolve(null)),
      },
      "api::inventory-snapshot.inventory-snapshot": {
        findOne: jest.fn(() => Promise.resolve(null)),
        create: jest.fn(),
        update: jest.fn(),
      },
    });

    return createApiApp(strapiMock);
  }

  test("GET /api/public/products returns public-safe product data", async () => {
    const response = await request(buildApp()).get("/api/public/products");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].name).toBe("Green Coffee Bean Extract");
    expect(response.body.data[0].internal_notes).toBeUndefined();
    expect(response.body.meta.pagination.total).toBe(2);
  });

  test("GET /api/public/products filters by warehouse_status", async () => {
    const response = await request(buildApp()).get("/api/public/products?warehouse_status=in_us_stock");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].slug).toBe("green-coffee-bean-extract");
  });

  test("GET /api/public/products/:slug returns the matching product", async () => {
    const response = await request(buildApp()).get(
      "/api/public/products/green-coffee-bean-extract",
    );

    expect(response.status).toBe(200);
    expect(response.body.data.slug).toBe("green-coffee-bean-extract");
    expect(response.body.data.specification).toBe("Chlorogenic acids 10%-60% HPLC");
  });

  test("GET /api/public/partner/gl-herb returns CMS-managed partner content", async () => {
    const response = await request(buildApp()).get("/api/public/partner/gl-herb");

    expect(response.status).toBe(200);
    expect(response.body.data.partner_name).toBe("GL Herb");
    expect(response.body.data.related_products).toHaveLength(2);
  });
});
