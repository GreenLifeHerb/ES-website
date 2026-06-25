#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, execSync, spawnSync } = require("node:child_process");
const crypto = require("node:crypto");

const projectRoot = path.resolve(__dirname, "../..");
const siteUrl = process.env.GSC_SITE_URL || "sc-domain:essencesourceusa.com";
const quotaProject = process.env.GSC_QUOTA_PROJECT || process.env.GOOGLE_CLOUD_QUOTA_PROJECT || "es-seo-gsc-5056";
const proxy = process.env.GSC_API_PROXY || process.env.HTTPS_PROXY || process.env.HTTP_PROXY || "";
const outputDir = path.join(projectRoot, "tmp");
const credentialsPath = path.join(projectRoot, process.env.GSC_CREDENTIALS_PATH || "infra/gsc-credentials.json");
const scope = "https://www.googleapis.com/auth/webmasters.readonly";
const tokenEndpoint = "https://oauth2.googleapis.com/token";

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date;
}

function getAccessToken() {
  const command = process.platform === "win32" ? "gcloud.cmd" : "gcloud";
  try {
    return execSync(`${command} auth application-default print-access-token`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return execSync(`${command} auth print-access-token`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  }
}

function generateJwt(clientEmail, privateKey) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;
  const header = { alg: "RS256", typ: "JWT" };
  const payload = { iss: clientEmail, scope, aud: tokenEndpoint, exp, iat };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signatureInput);
  return `${signatureInput}.${signer.sign(privateKey, "base64url")}`;
}

function fetchServiceAccountToken() {
  if (!fs.existsSync(credentialsPath)) return "";
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
  if (!credentials.client_email || !credentials.private_key) return "";
  const assertion = generateJwt(credentials.client_email, credentials.private_key);
  const curl = process.platform === "win32" ? "curl.exe" : "curl";
  const args = ["-s"];
  if (proxy) args.push("-x", proxy);
  args.push(
    "-H",
    "Content-Type: application/x-www-form-urlencoded",
    "--data-urlencode",
    "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer",
    "--data-urlencode",
    `assertion=${assertion}`,
    tokenEndpoint,
  );
  const text = execFileSync(curl, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const payload = JSON.parse(text);
  if (payload.error) {
    throw new Error(`Service account token failed: ${payload.error_description || payload.error}`);
  }
  return payload.access_token || "";
}

async function gscQuery(token, body) {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  if (proxy) {
    const bodyPath = path.join(os.tmpdir(), `.gsc-request-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
    fs.writeFileSync(bodyPath, JSON.stringify(body), "utf8");
    try {
      const curl = process.platform === "win32" ? "curl.exe" : "curl";
      const bodyPathForCurl = bodyPath.replace(/\\/g, "/");
      const args = [
        "-s",
        "-x",
        proxy,
        "-H",
        `Authorization: Bearer ${token}`,
        "-H",
        "Content-Type: application/json",
        "-H",
        `X-Goog-User-Project: ${quotaProject}`,
        "--data-binary",
        `@${bodyPathForCurl}`,
        endpoint,
      ];
      const result = spawnSync(curl, args, { encoding: "utf8" });
      if (result.status !== 0) {
        throw new Error(`curl GSC request failed (${result.status}): ${result.stdout || result.stderr || result.error?.message || "no output"}`);
      }
      const text = result.stdout;
      const data = JSON.parse(text);
      if (data.error) {
        throw new Error(`GSC query failed ${data.error.code}: ${data.error.message}`);
      }
      return data;
    } finally {
      fs.rmSync(bodyPath, { force: true });
    }
  }

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Goog-User-Project": quotaProject,
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(endpoint, options);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`GSC query failed ${response.status}: ${text}`);
  }
  return JSON.parse(text);
}

async function gscQueryWithRetry(token, body) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await gscQuery(token, body);
    } catch (error) {
      lastError = error;
      if (!String(error.message).includes("curl GSC request failed (35)")) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
    }
  }
  throw lastError;
}

function summarizeRows(rows = []) {
  return rows.map((row) => ({
    keys: row.keys || [],
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  // GSC final data usually lags by 2-3 days, so end three days ago.
  const endDate = isoDate(daysAgo(3));
  const last7Start = isoDate(daysAgo(9));
  const prev7Start = isoDate(daysAgo(16));
  const prev7End = isoDate(daysAgo(10));
  const last28Start = isoDate(daysAgo(30));

  let token = "";
  try {
    token = getAccessToken();
  } catch {
    token = "";
  }
  if (!token) {
    token = fetchServiceAccountToken();
  }
  const common = { dataState: "final", rowLimit: 25 };

  let results;
  try {
    results = [
      await gscQueryWithRetry(token, { ...common, startDate: last28Start, endDate, dimensions: [] }),
      await gscQueryWithRetry(token, { ...common, startDate: last7Start, endDate, dimensions: [] }),
      await gscQueryWithRetry(token, { ...common, startDate: prev7Start, endDate: prev7End, dimensions: [] }),
      await gscQueryWithRetry(token, { ...common, startDate: last28Start, endDate, dimensions: ["page"], rowLimit: 50 }),
      await gscQueryWithRetry(token, { ...common, startDate: last28Start, endDate, dimensions: ["query"], rowLimit: 50 }),
    ];
  } catch (error) {
    if (!String(error.message).includes("insufficient authentication scopes")) {
      throw error;
    }
    token = fetchServiceAccountToken();
    results = [
      await gscQueryWithRetry(token, { ...common, startDate: last28Start, endDate, dimensions: [] }),
      await gscQueryWithRetry(token, { ...common, startDate: last7Start, endDate, dimensions: [] }),
      await gscQueryWithRetry(token, { ...common, startDate: prev7Start, endDate: prev7End, dimensions: [] }),
      await gscQueryWithRetry(token, { ...common, startDate: last28Start, endDate, dimensions: ["page"], rowLimit: 50 }),
      await gscQueryWithRetry(token, { ...common, startDate: last28Start, endDate, dimensions: ["query"], rowLimit: 50 }),
    ];
  }
  const [last28, last7, prev7, pages, queries] = results;

  const snapshot = {
    generatedAt: new Date().toISOString(),
    siteUrl,
    windows: {
      last28: { startDate: last28Start, endDate },
      last7: { startDate: last7Start, endDate },
      previous7: { startDate: prev7Start, endDate: prev7End },
    },
    aggregate: {
      last28: summarizeRows(last28.rows)[0] || null,
      last7: summarizeRows(last7.rows)[0] || null,
      previous7: summarizeRows(prev7.rows)[0] || null,
    },
    topPages: summarizeRows(pages.rows),
    topQueries: summarizeRows(queries.rows),
  };

  const outputPath = path.join(outputDir, `gsc-weekly-snapshot-${endDate}.json`);
  fs.writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  console.log(`Generated ${outputPath}`);
  console.log(JSON.stringify(snapshot.aggregate, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
