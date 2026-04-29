"use strict";

const buckets = new Map();

function checkRateLimit(key, windowMs, max) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { count: 0, resetAt: now + windowMs };

  if (bucket.resetAt <= now) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  return {
    limited: bucket.count > max,
    remaining: Math.max(max - bucket.count, 0),
    resetAt: bucket.resetAt,
  };
}

function clearRateLimitStore() {
  buckets.clear();
}

module.exports = {
  checkRateLimit,
  clearRateLimitStore,
};
