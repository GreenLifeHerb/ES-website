"use strict";

const { checkRateLimit } = require("./rate-limit-store");

function getRequestIdentity(ctx, prefix = "request") {
  const forwarded = ctx.request.header["x-forwarded-for"];
  const ip = ctx.request.ip || forwarded || "unknown";
  return `${prefix}:${ip}`;
}

function enforceRateLimit(ctx, options = {}) {
  const {
    prefix = "request",
    defaultWindowMs = 900000,
    defaultMax = 10,
    windowEnvKey = "INQUIRY_RATE_LIMIT_WINDOW_MS",
    maxEnvKey = "INQUIRY_RATE_LIMIT_MAX",
    message = "Too many requests. Please try again later.",
  } = options;

  const windowMs = Number(process.env[windowEnvKey] || defaultWindowMs);
  const max = Number(process.env[maxEnvKey] || defaultMax);
  const identity = getRequestIdentity(ctx, prefix);
  const result = checkRateLimit(identity, windowMs, max);

  if (result.limited) {
    ctx.status = 429;
    ctx.body = {
      success: false,
      message,
    };
    return false;
  }

  return true;
}

module.exports = {
  enforceRateLimit,
  getRequestIdentity,
};
