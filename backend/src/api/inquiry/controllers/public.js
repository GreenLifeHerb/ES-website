"use strict";

const { validateInquiryPayload } = require("../../../utils/inquiry-validation");
const { buildTicketId } = require("../../../utils/ticket-id");
const { sendInquiryNotification } = require("../../../utils/email-service");
const { enforceRateLimit } = require("../../../utils/request-guards");

module.exports = {
  async create(ctx) {
    if (
      !enforceRateLimit(ctx, {
        prefix: "public-inquiry",
        windowEnvKey: "INQUIRY_RATE_LIMIT_WINDOW_MS",
        maxEnvKey: "INQUIRY_RATE_LIMIT_MAX",
      })
    ) {
      return;
    }

    const honeypotField = process.env.INQUIRY_HONEYPOT_FIELD || "website";
    const payload = {
      ...ctx.request.body,
      source_page: ctx.request.body?.source_page ?? ctx.request.header.referer ?? null,
    };

    const validation = validateInquiryPayload(payload, honeypotField);
    if (!validation.valid) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        errors: validation.errors,
      };
      return;
    }

    const nextSequence = (await strapi.db.query("api::inquiry.inquiry").count()) + 1;
    const ticketId = buildTicketId(nextSequence);

    const created = await strapi.db.query("api::inquiry.inquiry").create({
      data: {
        ...payload,
        ticket_id: ticketId,
        status: "new",
      },
    });

    await sendInquiryNotification({
      ...payload,
      ticket_id: ticketId,
    });

    ctx.status = 201;
    ctx.body = {
      success: true,
      message: "Inquiry submitted successfully",
      ticket_id: created.ticket_id,
    };
  },
};
