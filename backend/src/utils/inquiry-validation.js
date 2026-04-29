"use strict";

const { INQUIRY_TYPES } = require("./constants");

function validateInquiryPayload(payload, honeypotField = "website") {
  const errors = {};

  if (payload[honeypotField]) {
    errors[honeypotField] = "Spam protection triggered.";
  }

  if (!INQUIRY_TYPES.includes(payload.inquiry_type)) {
    errors.inquiry_type = "inquiry_type must be one of contact, quote, sample, docs.";
  }

  if (!payload.name || payload.name.trim().length < 2) {
    errors.name = "name is required.";
  }

  if (!payload.company || payload.company.trim().length < 2) {
    errors.company = "company is required.";
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = "email must be a valid business email.";
  }

  if (!payload.product_interest || payload.product_interest.trim().length < 2) {
    errors.product_interest = "product_interest is required.";
  }

  if (!payload.application || payload.application.trim().length < 2) {
    errors.application = "application is required.";
  }

  if (!payload.message || payload.message.trim().length < 5) {
    errors.message = "message is required.";
  }

  if (payload.consent !== true) {
    errors.consent = "consent must be accepted.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = {
  validateInquiryPayload,
};
