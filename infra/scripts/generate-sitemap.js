#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "../..");
const defaults = require("../seo/meta-defaults.json");
const { articles: insightArticles, tracks: insightTracks } = require("./generate-insights-pages");

const excludedFromSitemap = new Set(["404.html", "cookies.html"]);

function discoverHtmlRoutes() {
  return fs
    .readdirSync(projectRoot)
    .filter((file) => file.endsWith(".html"))
    .filter((file) => !excludedFromSitemap.has(file))
    .map((file) => (file === "index.html" ? "/" : `/${file}`))
    .sort((a, b) => a.localeCompare(b));
}

const allHtmlRoutes = discoverHtmlRoutes();

const coreRoutes = [
  "/",
  "/products.html",
  "/brand-ingredients.html",
  "/specialty-ingredients.html",
  "/specification-extracts.html",
  "/natural-mushrooms.html",
  "/applications.html",
  "/quality.html",
  "/warehouse.html",
  "/insights.html",
  "/resources.html",
  "/about.html",
  "/new-york-office.html",
  "/partner.html",
  "/contact.html",
  "/botanical-extract-supplier-usa.html",
  "/botanical-ingredient-supplier.html",
  "/nutraceutical-ingredient-supplier.html",
  "/bulk-botanical-extracts.html",
  "/custom-botanical-extract-manufacturing.html",
  "/product-green-coffee.html",
  "/product-black-ginger.html",
  "/product-artichoke.html",
  "/product-fisetin.html",
  "/product-reishi-mushroom-extract.html",
  "/product-white-willow-bark.html",
  ...insightTracks.map((track) => `/${track.slug}`),
  ...insightArticles.map((article) => `/${article.slug}`),
].filter((route) => allHtmlRoutes.includes(route));

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toUrl(baseUrl, route) {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  return `${normalizedBase}${route}`;
}

function routeToFile(route) {
  if (route === "/") return path.join(projectRoot, "index.html");
  return path.join(projectRoot, route.replace(/^\//, ""));
}

function getLastMod(route) {
  const filePath = routeToFile(route);
  try {
    return fs.statSync(filePath).mtime.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

async function fetchCmsRoutes() {
  const apiUrl = process.env.CMS_API_URL || process.env.SITEMAP_CMS_API_URL;
  if (!apiUrl) return [];

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/public/products`);
    if (!response.ok) return [];
    const payload = await response.json();
    return (payload.data || [])
      .map((product) => product.slug)
      .filter(Boolean)
      .map((slug) => `/products/${slug}`);
  } catch {
    return [];
  }
}

function buildSitemap(routes, baseUrl) {
  const uniqueRoutes = Array.from(new Set(routes));
  const urls = uniqueRoutes
    .map(
      (route) => `  <url>
    <loc>${escapeXml(toUrl(baseUrl, route))}</loc>
    <lastmod>${getLastMod(route)}</lastmod>
    <changefreq>${getChangefreq(route)}</changefreq>
    <priority>${getPriority(route)}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function getPriority(route) {
  if (route === "/") return "1.0";
  if (route === "/products.html") return "0.95";
  if (
    route === "/brand-ingredients.html" ||
    route === "/specialty-ingredients.html" ||
    route === "/specification-extracts.html" ||
    route === "/natural-mushrooms.html"
  ) {
    return "0.92";
  }
  if (route.startsWith("/product-")) return "0.82";
  if (
    route === "/applications.html" ||
    route === "/warehouse.html" ||
    route === "/quality.html"
  ) {
    return "0.78";
  }
  if (
    route === "/privacy.html" ||
    route === "/terms.html" ||
    route === "/cookies.html" ||
    route === "/accessibility.html"
  ) {
    return "0.2";
  }
  return "0.72";
}

function getChangefreq(route) {
  if (
    route === "/" ||
    route === "/products.html" ||
    route === "/brand-ingredients.html" ||
    route === "/specialty-ingredients.html" ||
    route === "/specification-extracts.html" ||
    route === "/natural-mushrooms.html"
  ) {
    return "weekly";
  }
  return "monthly";
}

function writeOutput(content, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);
}

async function main() {
  const baseUrl = process.env.SITEMAP_BASE_URL || defaults.baseUrl;
  const output = path.resolve(__dirname, process.env.SITEMAP_OUTPUT || "../../sitemap.xml");
  const routes = [...coreRoutes, ...(await fetchCmsRoutes())];
  const sitemap = buildSitemap(routes, baseUrl);
  const checkOnly = process.argv.includes("--check");

  if (checkOnly) {
    if (!fs.existsSync(output)) {
      throw new Error(`Missing sitemap at ${output}`);
    }
    const current = fs.readFileSync(output, "utf8");
    if (current !== sitemap) {
      throw new Error("sitemap.xml is stale. Run node infra/scripts/generate-sitemap.js");
    }
    console.log("sitemap-ok");
    return;
  }

  writeOutput(sitemap, output);
  const publicMirror = path.join(projectRoot, "public", "sitemap.xml");
  if (fs.existsSync(path.dirname(publicMirror))) {
    writeOutput(sitemap, publicMirror);
  }
  console.log(`Generated ${output}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  allHtmlRoutes,
  buildSitemap,
  coreRoutes,
};
