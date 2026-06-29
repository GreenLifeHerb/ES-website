#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { allHtmlRoutes } = require("./generate-sitemap");

const projectRoot = path.resolve(__dirname, "../..");

function toTitleCase(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(".html", "");
}

function getTitleForRoute(route) {
  if (route === "/") return "Essence Source Homepage";
  if (route === "/products.html") return "Full Product Catalog";
  
  const baseName = route.replace(/^\//, "");
  
  if (baseName.startsWith("product-")) {
    return toTitleCase(baseName.replace("product-", ""));
  }
  
  return toTitleCase(baseName);
}

function buildHtmlSitemap(routes) {
  const uniqueRoutes = Array.from(new Set(routes)).sort();
  
  const links = uniqueRoutes
    .map((route) => {
      const title = getTitleForRoute(route);
      return `        <li><a href="${route}">${title}</a></li>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTML Sitemap | Essence Source</title>
    <meta
      name="description"
      content="Complete directory of Essence Source B2B botanical ingredient pages, product details, buyer guides, sourcing resources, quality documents, and company pages."
    />
    <link rel="canonical" href="https://essencesourceusa.com/sitemap.html" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://essencesourceusa.com/sitemap.html#webpage",
        "url": "https://essencesourceusa.com/sitemap.html",
        "name": "HTML Sitemap | Essence Source",
        "description": "Complete directory of Essence Source B2B botanical ingredient pages, product details, buyer guides, sourcing resources, quality documents, and company pages.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://essencesourceusa.com/#website",
          "name": "Essence Source"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://essencesourceusa.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "HTML Sitemap",
              "item": "https://essencesourceusa.com/sitemap.html"
            }
          ]
        }
      }
    </script>
    <link rel="stylesheet" href="assets/css/main.css" />
  </head>
  <body data-page="sitemap.html">
    <div class="site-shell">
      <div data-site-header></div>
      <main class="site-main" id="main-content">
        <section class="page-hero">
          <div class="container section-heading">
            <div class="section-heading__eyebrow">Directory</div>
            <h1>Site Directory & Sitemap</h1>
            <p>
              Complete index of all product specification pages, collections, and company resources.
            </p>
          </div>
        </section>
        <section class="section">
          <div class="container">
            <ul class="sitemap-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; list-style-type: none; padding-left: 0;">
${links}
            </ul>
          </div>
        </section>
      </main>
      <div data-site-footer></div>
    </div>
    <script src="assets/data/site-content.js?v=20260608-insights-seed" defer></script>
    <script src="assets/js/main.js?v=20260626-mobile-header" defer></script>
    <script src="assets/js/nav.js" defer></script>
  </body>
</html>
`;

  return html;
}

async function main() {
  console.log("Discovering HTML routes for HTML Sitemap...");
  const routes = [...allHtmlRoutes];
  const html = buildHtmlSitemap(routes);
  
  const outputPath = path.join(projectRoot, "sitemap.html");
  fs.writeFileSync(outputPath, html, "utf8");
  console.log(`Generated HTML sitemap at ${outputPath}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
