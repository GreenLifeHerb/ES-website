"use strict";

const WAREHOUSE_STATUSES = [
  "in_us_stock",
  "available_by_inquiry",
  "pilot_lot_available",
  "made_to_order",
];

const INQUIRY_TYPES = ["contact", "quote", "sample", "docs"];
const INQUIRY_STATUSES = ["new", "triaged", "responded", "closed", "spam"];

module.exports = {
  WAREHOUSE_STATUSES,
  INQUIRY_TYPES,
  INQUIRY_STATUSES,
};
