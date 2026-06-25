"use strict";

function buildTicketId(sequence) {
  const year = new Date().getUTCFullYear();
  return `INQ-${year}-${String(sequence).padStart(4, "0")}`;
}

module.exports = {
  buildTicketId,
};
