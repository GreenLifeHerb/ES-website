"use strict";

const nodemailer = require("nodemailer");

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user,
      pass,
    },
  });
}

async function sendInquiryNotification(inquiry) {
  const transporter = getTransporter();

  if (!transporter) {
    return {
      sent: false,
      reason: "email_not_configured",
    };
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || "no-reply@essencesourceusa.com",
    to: process.env.MAIL_TO || "hello@essencesourceusa.com",
    replyTo: inquiry.email,
    subject: `[Essence Source] ${inquiry.inquiry_type} inquiry from ${inquiry.company}`,
    text: [
      `Ticket ID: ${inquiry.ticket_id}`,
      `Type: ${inquiry.inquiry_type}`,
      `Name: ${inquiry.name}`,
      `Company: ${inquiry.company}`,
      `Email: ${inquiry.email}`,
      `Phone: ${inquiry.phone ?? "Not specified"}`,
      `Country: ${inquiry.country ?? "Not specified"}`,
      `Product Interest: ${inquiry.product_interest}`,
      `Application: ${inquiry.application}`,
      `Source Page: ${inquiry.source_page ?? "Not specified"}`,
      "",
      inquiry.message,
    ].join("\n"),
  });

  return {
    sent: true,
  };
}

module.exports = {
  sendInquiryNotification,
};
