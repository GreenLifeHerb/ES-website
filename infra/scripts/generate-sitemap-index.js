#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const defaults = require("../seo/meta-defaults.json");

const projectRoot = path.resolve(__dirname, "../..");
const sitemapFiles = ["sitemap.xml", "image-sitemap.xml"];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getLastMod(file) {
  try {
    return fs.statSync(path.join(projectRoot, file)).mtime.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function buildSitemapIndex(baseUrl) {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const entries = sitemapFiles
    .map(
      (file) => `  <sitemap>
    <loc>${escapeXml(`${normalizedBase}/${file}`)}</loc>
    <lastmod>${getLastMod(file)}</lastmod>
  </sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;
}

function writeOutput(content, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);
}

function main() {
  const baseUrl = process.env.SITEMAP_BASE_URL || defaults.baseUrl;
  const output = path.resolve(
    __dirname,
    process.env.SITEMAP_INDEX_OUTPUT || "../../sitemap-index.xml",
  );
  const sitemapIndex = buildSitemapIndex(baseUrl);
  const checkOnly = process.argv.includes("--check");

  if (checkOnly) {
    if (!fs.existsSync(output)) {
      throw new Error(`Missing sitemap index at ${output}`);
    }
    const current = fs.readFileSync(output, "utf8");
    if (current !== sitemapIndex) {
      throw new Error(
        "sitemap-index.xml is stale. Run node infra/scripts/generate-sitemap-index.js",
      );
    }
    console.log("sitemap-index-ok");
    return;
  }

  writeOutput(sitemapIndex, output);
  console.log(`Generated ${output}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  buildSitemapIndex,
};
