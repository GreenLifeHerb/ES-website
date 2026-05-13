"use strict";

require("dotenv").config();

const nodemailer = require("nodemailer");

const smtpHost = (process.env.SMTP_HOST || "").trim();
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = /^true$/i.test(process.env.SMTP_SECURE || "false");
const smtpUser = (process.env.SMTP_USER || "").trim();
const smtpPass = process.env.SMTP_PASS || "";
const mailFrom = (process.env.MAIL_FROM || "").trim();
const mailTo = (process.env.MAIL_TO || "").trim();

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!smtpHost) fail("Missing SMTP_HOST");
if (!smtpPort) fail("Missing or invalid SMTP_PORT");
if (!mailFrom) fail("Missing MAIL_FROM");
if (!mailTo) fail("Missing MAIL_TO");
if (!smtpUser) fail("Missing SMTP_USER");
if (!smtpPass) fail("Missing SMTP_PASS");

async function main() {
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.verify();
  console.log("SMTP verify succeeded.");
}

main().catch((error) => {
  console.error("SMTP verify failed:");
  console.error(error && error.message ? error.message : error);
  process.exit(1);
});
