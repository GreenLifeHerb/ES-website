#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "../..");
const htmlFiles = fs
  .readdirSync(projectRoot)
  .filter((file) => file.endsWith(".html"))
  .map((file) => path.join(projectRoot, file));

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function getJsonLd(html) {
  const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return matches.map((match) => JSON.parse(match[1].trim()));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateCanonical(fileName, html) {
  assert(/<link\s+rel=["']canonical["']\s+href=["'][^"']+["']\s*\/?>/i.test(html), `${fileName}: missing canonical`);
}

function validateImageAlt(fileName, html) {
  const images = [...html.matchAll(/<img\b[^>]*>/gi)];
  for (const image of images) {
    assert(/\salt=["'][^"']+["']/i.test(image[0]), `${fileName}: image missing alt`);
  }
}

function validateHreflangPairs(fileName, html) {
  const links = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]*>/gi)];
  if (links.length === 0) return;
  const values = links.map((link) => link[1]);
  assert(values.includes("x-default"), `${fileName}: hreflang is missing x-default`);
  assert(values.includes("en") || values.includes("en-US"), `${fileName}: hreflang is missing English`);
}

function validateSpecificJsonLd(fileName, schemas) {
  if (fileName.startsWith("product-")) {
    assert(schemas.some((schema) => schema["@type"] === "Product"), `${fileName}: missing Product JSON-LD`);
    assert(
      schemas.some((schema) => schema["@type"] === "BreadcrumbList"),
      `${fileName}: missing BreadcrumbList JSON-LD`,
    );
  }

  if (fileName === "resources.html") {
    assert(schemas.some((schema) => schema["@type"] === "FAQPage"), `${fileName}: missing FAQPage JSON-LD`);
  }

  if (fileName === "index.html") {
    assert(schemas.some((schema) => schema["@type"] === "Organization"), `${fileName}: missing Organization JSON-LD`);
  }
}

function validateSitemapAndRobots() {
  const sitemapPath = path.join(projectRoot, "sitemap.xml");
  const robotsPath = path.join(projectRoot, "robots.txt");
  assert(fs.existsSync(sitemapPath), "sitemap.xml does not exist");
  assert(fs.existsSync(robotsPath), "robots.txt does not exist");
  const sitemap = read(sitemapPath);
  const robots = read(robotsPath);
  assert(sitemap.includes("https://essencesourceusa.com/"), "sitemap.xml missing home URL");
  assert(sitemap.includes("product-green-coffee.html"), "sitemap.xml missing product URL");
  assert(/Sitemap:\s*https:\/\/essencesourceusa\.com\/sitemap\.xml/i.test(robots), "robots.txt missing sitemap URL");
  assert(/Disallow:\s*\/admin/i.test(robots), "robots.txt must block admin path");
  assert(/Disallow:\s*\/api\/internal/i.test(robots), "robots.txt must block internal API path");
}

function main() {
  for (const filePath of htmlFiles) {
    const fileName = path.basename(filePath);
    const html = read(filePath);
    const schemas = getJsonLd(html);
    validateCanonical(fileName, html);
    validateImageAlt(fileName, html);
    validateHreflangPairs(fileName, html);
    validateSpecificJsonLd(fileName, schemas);
  }

  validateSitemapAndRobots();
  console.log("structured-data-ok");
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
  getJsonLd,
};
