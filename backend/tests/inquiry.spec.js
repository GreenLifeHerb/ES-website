"use strict";

const request = require("supertest");

const { clearRateLimitStore } = require("../src/utils/rate-limit-store");
const emailService = require("../src/utils/email-service");
const { createApiApp, createQueryRegistry } = require("./helpers/test-app");

describe("inquiry submission", () => {
  beforeEach(() => {
    clearRateLimitStore();
    jest.spyOn(emailService, "sendInquiryNotification").mockResolvedValue({
      sent: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function buildApp() {
    const strapiMock = createQueryRegistry({
      "api::inquiry.inquiry": {
        count: jest.fn(() => Promise.resolve(0)),
        create: jest.fn(({ data }) => Promise.resolve({ id: 1, ...data })),
      },
      "api::product.product": {
        findMany: jest.fn(() => Promise.resolve([])),
        count: jest.fn(() => Promise.resolve(0)),
        findOne: jest.fn(() => Promise.resolve(null)),
        update: jest.fn(),
      },
      "api::partner-profile.partner-profile": {
        findOne: jest.fn(() => Promise.resolve(null)),
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

  test("POST /api/public/inquiries accepts a valid inquiry", async () => {
    const response = await request(buildApp()).post("/api/public/inquiries").send({
      inquiry_type: "sample",
      name: "Amy Lee",
      company: "ABC Nutrition",
      email: "amy@example.com",
      phone: null,
      country: "United States",
      product_interest: "Green Coffee Bean Extract",
      application: "gummies",
      message: "Need sample and COA",
      consent: true,
      source_page: "/product-green-coffee.html",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.ticket_id).toBe("INQ-2026-0001");
    expect(emailService.sendInquiryNotification).toHaveBeenCalledTimes(1);
  });

  test("POST /api/public/inquiries rejects missing fields", async () => {
    const response = await request(buildApp()).post("/api/public/inquiries").send({
      inquiry_type: "sample",
      name: "A",
      company: "",
      email: "not-an-email",
      product_interest: "",
      application: "",
      message: "hi",
      consent: false,
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.email).toBeDefined();
    expect(response.body.errors.company).toBeDefined();
    expect(response.body.errors.consent).toBeDefined();
  });
});
