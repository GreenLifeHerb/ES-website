#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
require("dotenv").config();

const projectRoot = path.resolve(__dirname, "../..");
const DEFAULT_SITE_URL = "sc-domain:essencesourceusa.com";
const INSPECTION_ENDPOINT =
  "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";

const siteUrl = process.env.GSC_INSPECTION_SITE_URL || DEFAULT_SITE_URL;
const sitemapPath = path.resolve(
  projectRoot,
  process.env.GSC_INSPECTION_SITEMAP || "sitemap.xml",
);
const quotaProject =
  process.env.GSC_QUOTA_PROJECT ||
  process.env.GOOGLE_CLOUD_QUOTA_PROJECT ||
  getAdcQuotaProject() ||
  getActiveGcloudProject();
const proxy =
  process.env.GSC_API_PROXY ||
  process.env.HTTPS_PROXY ||
  process.env.HTTP_PROXY ||
  process.env.https_proxy ||
  process.env.http_proxy ||
  "";

function getActiveGcloudProject() {
  for (const cmd of ["gcloud.cmd", "gcloud"]) {
    try {
      const value = runGcloud(cmd, ["config", "get-value", "project"]).trim();
      if (value && value !== "(unset)") return value;
    } catch {
      // Try the next command name.
    }
  }
  return "";
}

function getAdcQuotaProject() {
  const candidates = [
    path.join(
      process.env.APPDATA || "",
      "gcloud",
      "application_default_credentials.json",
    ),
    path.join(
      os.homedir(),
      ".config",
      "gcloud",
      "application_default_credentials.json",
    ),
  ];

  for (const candidate of candidates) {
    try {
      if (!candidate || !fs.existsSync(candidate)) continue;
      const payload = JSON.parse(fs.readFileSync(candidate, "utf8"));
      if (payload.quota_project_id) return payload.quota_project_id;
    } catch {
      // Continue looking.
    }
  }
  return "";
}

function getAccessToken() {
  const errors = [];
  for (const cmd of ["gcloud.cmd", "gcloud"]) {
    try {
      const token = runGcloud(cmd, [
        "auth",
        "application-default",
        "print-access-token",
      ]).trim();
      if (token) return token;
    } catch (error) {
      errors.push(`${cmd}: ${error.message}`);
      // Try the next command name.
    }
  }
  throw new Error(
    `Could not get an ADC access token. Run gcloud auth application-default login first. Attempts: ${errors.join(" | ")}`,
  );
}

function runGcloud(cmd, args) {
  const command =
    process.platform === "win32" && cmd.endsWith(".cmd") ? "cmd.exe" : cmd;
  const commandArgs =
    process.platform === "win32" && cmd.endsWith(".cmd")
      ? ["/c", cmd, ...args]
      : args;

  return execFileSync(command, commandArgs, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    timeout: 30000,
  });
}

function readSitemapUrls() {
  if (!fs.existsSync(sitemapPath)) {
    throw new Error(`Missing sitemap file: ${sitemapPath}`);
  }
  const xml = fs.readFileSync(sitemapPath, "utf8");
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), (match) =>
    match[1].trim(),
  );
}

function runCurlJson(body, token) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-inspection-"));
  const bodyPath = path.join(tmpDir, "request.json");
  fs.writeFileSync(bodyPath, JSON.stringify(body));

  const args = [
    "-sS",
    "--connect-timeout",
    "30",
    "--max-time",
    "90",
    "-X",
    "POST",
    "-H",
    `Authorization: Bearer ${token}`,
    "-H",
    "Content-Type: application/json",
  ];

  if (quotaProject) {
    args.push("-H", `X-Goog-User-Project: ${quotaProject}`);
  }
  if (proxy) {
    args.unshift("-x", proxy);
  }

  args.push("--data-binary", `@${bodyPath}`, INSPECTION_ENDPOINT);

  try {
    const curlBin = process.platform === "win32" ? "curl.exe" : "curl";
    const raw = execFileSync(curlBin, args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 120000,
    });
    return JSON.parse(raw);
  } catch (error) {
    const message = error.stderr?.toString()?.trim() || error.message;
    return { error: { message } };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function summarize(rows) {
  return rows.reduce((acc, row) => {
    const key = row.coverageState || row.verdict || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function toMarkdown(rows, generatedAt) {
  const summary = summarize(rows);
  const summaryRows = Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .map(([state, count]) => `| ${state} | ${count} |`)
    .join("\n");

  const detailRows = rows
    .map(
      (row) =>
        `| ${row.url} | ${row.verdict || ""} | ${row.coverageState || ""} | ${row.lastCrawlTime || ""} |`,
    )
    .join("\n");

  return `# GSC URL Inspection Report

Generated: ${generatedAt}

Site property: \`${siteUrl}\`

Sitemap source: \`${path.relative(projectRoot, sitemapPath)}\`

## Summary

| State | Count |
| :--- | ---: |
${summaryRows}

## Details

| URL | Verdict | Coverage State | Last Crawl |
| :--- | :--- | :--- | :--- |
${detailRows}
`;
}

async function main() {
  const urls = readSitemapUrls();
  const token = getAccessToken();

  console.log("====================================================");
  console.log("ESSENCE SOURCE - GSC URL INSPECTION");
  console.log(`Site property: ${siteUrl}`);
  console.log(`Sitemap URLs: ${urls.length}`);
  console.log(`Quota project: ${quotaProject || "not set"}`);
  console.log(`Proxy: ${proxy || "not set"}`);
  console.log("====================================================");

  const rows = [];
  for (const url of urls) {
    const payload = {
      inspectionUrl: url,
      siteUrl,
      languageCode: "en-US",
    };
    const result = runCurlJson(payload, token);
    if (result.error) {
      rows.push({
        url,
        verdict: "ERROR",
        coverageState: result.error.message,
        indexingState: "",
        lastCrawlTime: "",
        robotsTxtState: "",
        googleCanonical: "",
        userCanonical: "",
      });
      console.log(`ERROR ${url}: ${result.error.message}`);
    } else {
      const status = result.inspectionResult?.indexStatusResult || {};
      rows.push({
        url,
        verdict: status.verdict || "",
        coverageState: status.coverageState || "",
        indexingState: status.indexingState || "",
        lastCrawlTime: status.lastCrawlTime || "",
        robotsTxtState: status.robotsTxtState || "",
        googleCanonical: status.googleCanonical || "",
        userCanonical: status.userCanonical || "",
      });
      console.log(`${status.verdict || "UNKNOWN"} ${url} - ${status.coverageState || "No coverage state"}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  const generatedAt = new Date().toISOString();
  const outputDir = path.join(projectRoot, "tmp");
  fs.mkdirSync(outputDir, { recursive: true });
  const jsonPath = path.join(outputDir, "gsc-url-inspection-latest.json");
  const mdPath = path.join(outputDir, "gsc-url-inspection-latest.md");
  fs.writeFileSync(
    jsonPath,
    JSON.stringify({ generatedAt, siteUrl, sitemapPath, rows }, null, 2),
  );
  fs.writeFileSync(mdPath, toMarkdown(rows, generatedAt));

  console.log("\nSummary:");
  for (const [state, count] of Object.entries(summarize(rows))) {
    console.log(`- ${state}: ${count}`);
  }
  console.log(`\nSaved JSON: ${jsonPath}`);
  console.log(`Saved report: ${mdPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
