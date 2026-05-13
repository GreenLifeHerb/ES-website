const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
require("dotenv").config();
const nodemailer = require("nodemailer");

const rootDir = __dirname;
const port = Number(process.env.PORT || 4173);
const inquiryProxyUrl = process.env.INQUIRY_API_URL || "";
const mailTo = (process.env.MAIL_TO || "").trim();
const mailFrom = (process.env.MAIL_FROM || "").trim();
const smtpHost = (process.env.SMTP_HOST || "").trim();
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = /^true$/i.test(process.env.SMTP_SECURE || "false");
const smtpUser = (process.env.SMTP_USER || "").trim();
const smtpPass = process.env.SMTP_PASS || "";
const maxRequestBytes = Number(process.env.INQUIRY_MAX_BYTES || 32 * 1024);
const inquiryRateLimitWindowMs = Number(process.env.INQUIRY_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const inquiryRateLimitMax = Number(process.env.INQUIRY_RATE_LIMIT_MAX || 10);
const frontendOrigins = String(process.env.FRONTEND_ORIGINS || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const rateLimitStore = new Map();

function logInquiryMode() {
  if (inquiryProxyUrl) {
    console.log("Inquiry mode: proxy");
    return;
  }

  if (smtpHost && mailFrom && mailTo) {
    console.log("Inquiry mode: direct-email");
    return;
  }

  console.log("Inquiry mode: unconfigured");
}

function buildJsonResponse(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-cache",
  });
  response.end(JSON.stringify(payload));
}

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function resolvePath(urlPath) {
  const cleanedPath = decodeURIComponent(urlPath.split("?")[0]);
  const requestedPath = cleanedPath === "/" ? "/index.html" : cleanedPath;
  const normalized = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  return path.join(rootDir, normalized);
}

function sendFile(request, response, filePath, statusCode = 200) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[extension] || "application/octet-stream";

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Internal server error");
      return;
    }

    const acceptsGzip = /\bgzip\b/.test(request.headers["accept-encoding"] || "");
    const shouldCompress =
      acceptsGzip && [".html", ".css", ".js", ".json", ".svg", ".txt"].includes(extension);
    const body = shouldCompress ? zlib.gzipSync(data) : data;
    const headers = {
      "Content-Type": contentType,
      "Cache-Control":
        extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
    };

    if (shouldCompress) {
      headers["Content-Encoding"] = "gzip";
      headers.Vary = "Accept-Encoding";
    }

    response.writeHead(statusCode, headers);
    response.end(body);
  });
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;

    request.on("data", (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > maxRequestBytes) {
        reject(new Error("REQUEST_TOO_LARGE"));
        request.destroy();
        return;
      }

      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function getClientIp(request) {
  const forwarded = String(request.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || request.socket.remoteAddress || "unknown";
}

function isAllowedOrigin(request) {
  if (frontendOrigins.length === 0) {
    return true;
  }

  const origin = String(request.headers.origin || "").trim();
  if (!origin) {
    return true;
  }

  return frontendOrigins.includes(origin);
}

function enforceRateLimit(request) {
  const now = Date.now();
  const key = getClientIp(request);
  const current = rateLimitStore.get(key);

  if (!current || current.expiresAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      expiresAt: now + inquiryRateLimitWindowMs,
    });
    return true;
  }

  if (current.count >= inquiryRateLimitMax) {
    return false;
  }

  current.count += 1;
  return true;
}

function createTicketId() {
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ES-${timestamp}-${suffix}`;
}

function validateInquiryPayload(payload) {
  const errors = {};
  const requiredFields = [
    ["name", "Please enter your name."],
    ["company", "Please enter your company name."],
    ["email", "Please enter a valid business email."],
    ["inquiry_type", "Please choose a request type."],
    ["application", "Please enter the intended application."],
    ["product_interest", "Please enter the product you want to discuss."],
    ["message", "Please enter your project details."],
  ];

  requiredFields.forEach(([field, message]) => {
    if (!String(payload[field] || "").trim()) {
      errors[field] = message;
    }
  });

  const email = String(payload.email || "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid business email.";
  }

  const allowedTypes = new Set(["quote", "sample", "docs", "contact"]);
  if (payload.inquiry_type && !allowedTypes.has(String(payload.inquiry_type).trim())) {
    errors.inquiry_type = "Please choose a valid request type.";
  }

  if (payload.website) {
    errors.website = "Spam check failed.";
  }

  if (payload.consent !== true) {
    errors.consent = "Please confirm that we may respond to this inquiry.";
  }

  return errors;
}

function createTransporter() {
  if (!smtpHost || !mailTo || !mailFrom) {
    return null;
  }

  const transportOptions = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
  };

  if (smtpUser) {
    transportOptions.auth = {
      user: smtpUser,
      pass: smtpPass,
    };
  }

  return nodemailer.createTransport(transportOptions);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInquiryType(value) {
  const labels = {
    quote: "Request Quote",
    sample: "Request Sample",
    docs: "Ask for COA / TDS / SDS",
    contact: "General Contact",
  };

  return labels[value] || value || "Unknown";
}

function buildInquiryEmail(payload, ticketId) {
  const entries = [
    ["Ticket", ticketId],
    ["Request type", formatInquiryType(payload.inquiry_type)],
    ["Name", payload.name],
    ["Company", payload.company],
    ["Email", payload.email],
    ["Application", payload.application],
    ["Product interest", payload.product_interest],
    ["Source page", payload.source_page || ""],
    ["Submitted at", new Date().toISOString()],
  ];

  const text = [
    "New website inquiry",
    "",
    ...entries.map(([label, value]) => `${label}: ${value || ""}`),
    "",
    "Project details:",
    String(payload.message || "").trim(),
  ].join("\n");

  const html = `
    <h2>New website inquiry</h2>
    <table cellpadding="6" cellspacing="0" border="0">
      ${entries
        .map(
          ([label, value]) =>
            `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value || "")}</td></tr>`,
        )
        .join("")}
    </table>
    <h3>Project details</h3>
    <p>${escapeHtml(String(payload.message || "").trim()).replace(/\n/g, "<br />")}</p>
  `;

  return { text, html };
}

async function proxyInquiry(request, response) {
  if (!isAllowedOrigin(request)) {
    buildJsonResponse(response, 403, {
      success: false,
      message: "Origin not allowed.",
    });
    return;
  }

  if (!enforceRateLimit(request)) {
    buildJsonResponse(response, 429, {
      success: false,
      message: "Too many requests. Please try again later.",
    });
    return;
  }

  if (!inquiryProxyUrl) {
    let body = "";

    try {
      body = await readRequestBody(request);
    } catch (error) {
      buildJsonResponse(response, error.message === "REQUEST_TOO_LARGE" ? 413 : 400, {
        success: false,
        message:
          error.message === "REQUEST_TOO_LARGE"
            ? "Request body is too large."
            : "Invalid request body.",
      });
      return;
    }

    let payload = {};

    try {
      payload = JSON.parse(body || "{}");
    } catch {
      buildJsonResponse(response, 400, {
        success: false,
        message: "Invalid request body.",
      });
      return;
    }

    const errors = validateInquiryPayload(payload);
    if (Object.keys(errors).length > 0) {
      buildJsonResponse(response, 400, {
        success: false,
        errors,
      });
      return;
    }

    const transporter = createTransporter();
    if (!transporter) {
      buildJsonResponse(response, 503, {
        success: false,
        message: "Email delivery is not configured on this server.",
      });
      return;
    }

    const ticketId = createTicketId();
    const { text, html } = buildInquiryEmail(payload, ticketId);

    try {
      await transporter.sendMail({
        from: mailFrom,
        to: mailTo,
        replyTo: String(payload.email || "").trim(),
        subject: `[Essence Source] ${formatInquiryType(payload.inquiry_type)} - ${payload.company}`,
        text,
        html,
      });

      buildJsonResponse(response, 200, {
        success: true,
        ticket_id: ticketId,
      });
    } catch (error) {
      console.error("Inquiry email failed:", error);
      buildJsonResponse(response, 502, {
        success: false,
        message: "Unable to send inquiry email.",
      });
    }
    return;
  }

  try {
    const body = await readRequestBody(request);
    const upstreamResponse = await fetch(inquiryProxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const text = await upstreamResponse.text();
    response.writeHead(upstreamResponse.status, {
      "Content-Type":
        upstreamResponse.headers.get("content-type") || "application/json; charset=utf-8",
      "Cache-Control": "no-cache",
    });
    response.end(text);
  } catch (error) {
    buildJsonResponse(response, 502, {
      success: false,
      message: "Unable to reach the inquiry service.",
    });
  }
}

const server = http.createServer((request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": request.headers.origin || "*",
      Vary: "Origin",
    });
    response.end();
    return;
  }

  if (
    request.method === "POST" &&
    (request.url || "").split("?")[0] === "/api/public/inquiries"
  ) {
    proxyInquiry(request, response);
    return;
  }

  const filePath = resolvePath(request.url || "/");

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(request, response, filePath);
      return;
    }

    if (!error && stats.isDirectory()) {
      const indexFile = path.join(filePath, "index.html");
      fs.stat(indexFile, (indexError, indexStats) => {
        if (!indexError && indexStats.isFile()) {
          sendFile(request, response, indexFile);
          return;
        }

        sendFile(request, response, path.join(rootDir, "404.html"), 404);
      });
      return;
    }

    sendFile(request, response, path.join(rootDir, "404.html"), 404);
  });
});

server.listen(port, () => {
  logInquiryMode();
  console.log(`Essence Source static site running at http://localhost:${port}`);
});
