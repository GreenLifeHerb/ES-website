"use strict";

module.exports = async (policyContext, config, { strapi }) => {
  const expectedKey = strapi.config.get("server.internalApiKey") || process.env.INTERNAL_API_KEY;
  const providedKey =
    policyContext.request.header["x-internal-api-key"] || policyContext.request.header.authorization;

  if (!expectedKey || !providedKey) {
    return false;
  }

  const normalizedProvided = providedKey.replace(/^Bearer\s+/i, "");
  return normalizedProvided === expectedKey;
};
