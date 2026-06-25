#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const defaults = require("../seo/meta-defaults.json");
const { articles: insightArticles, tracks: insightTracks } = require("./generate-insights-pages");

const projectRoot = path.resolve(__dirname, "../..");

const sections = [
  {
    title: "Company and buyer context",
    links: [
      ["/", "U.S. B2B botanical ingredient supplier homepage"],
      ["/about.html", "Company overview, operating model, and buyer verification notes"],
      ["/quality.html", "COA/TDS, testing files, and document request workflow"],
      ["/warehouse.html", "U.S. warehouse support and stock-path explanation"],
      ["/insights.html", "Market notes, technical notes, and buyer guide pathways"],
      ["/contact.html", "Official inquiry and sales contact path"],
    ],
  },
  {
    title: "High-intent sourcing pages",
    links: [
      ["/botanical-extract-supplier-usa.html", "Botanical extract supplier USA landing page"],
      ["/botanical-ingredient-supplier.html", "Botanical ingredient supplier buyer page"],
      ["/nutraceutical-ingredient-supplier.html", "Nutraceutical ingredient supplier page"],
      ["/bulk-botanical-extracts.html", "Bulk botanical extracts sourcing and RFQ page"],
      ["/custom-botanical-extract-manufacturing.html", "Custom botanical extract manufacturing page"],
    ],
  },
  {
    title: "Buyer guides",
    links: [
      ["/resources.html", "Buyer guides, documentation notes, and sourcing FAQ hub"],
      ["/coa-tds-request-checklist.html", "COA and TDS request checklist"],
      ["/bulk-botanical-extract-rfq-checklist.html", "Bulk botanical extract RFQ checklist"],
      ["/green-coffee-bean-extract-supplier-guide.html", "Green coffee bean extract supplier guide"],
      ["/ashwagandha-extract-supplier-guide.html", "Ashwagandha extract supplier guide"],
      ["/black-ginger-extract-supplier-guide.html", "Black ginger extract supplier guide"],
      ["/reishi-mushroom-extract-supplier-guide.html", "Reishi mushroom extract supplier guide"],
      ["/elderberry-extract-supplier-guide.html", "Elderberry extract supplier guide"],
      ["/lions-mane-extract-supplier-guide.html", "Lion's Mane extract supplier guide"],
      ["/turkey-tail-mushroom-extract-supplier-guide.html", "Turkey tail mushroom extract supplier guide"],
      ["/saw-palmetto-extract-supplier-guide.html", "Saw palmetto extract supplier guide"],
      ["/grape-seed-extract-supplier-guide.html", "Grape seed extract supplier guide"],
      ["/fisetin-extract-supplier-guide.html", "Fisetin extract supplier guide"],
      ["/maca-extract-supplier-guide.html", "Maca extract supplier guide"],
    ],
  },
  {
    title: "Insights, market notes, and technical notes",
    links: [
      ...insightTracks.map((track) => [`/${track.slug}`, track.description]),
      ...insightArticles.map((article) => [`/${article.slug}`, article.description]),
    ],
  },
  {
    title: "Application sourcing pages",
    links: [
      ["/applications.html", "Application hub for supplement, beverage, food, and cosmetic sourcing"],
      ["/supplement-botanical-ingredients.html", "Supplement botanical ingredient sourcing page"],
      ["/functional-beverage-botanical-ingredients.html", "Functional beverage botanical ingredient sourcing page"],
      ["/cosmetic-botanical-ingredients.html", "Cosmetic and personal-care botanical ingredient sourcing page"],
    ],
  },
  {
    title: "Product and category pages",
    links: [
      ["/products.html", "Full botanical ingredient product catalog"],
      ["/brand-ingredients.html", "Brand ingredient collection"],
      ["/specialty-ingredients.html", "Specialty ingredient collection"],
      ["/specification-extracts.html", "Specification extract collection"],
      ["/natural-mushrooms.html", "Natural mushroom ingredient collection"],
      ["/product-green-coffee.html", "Green coffee bean extract product page"],
      ["/product-black-ginger.html", "Black ginger extract product page"],
      ["/product-artichoke.html", "Artichoke extract product page"],
      ["/product-reishi-mushroom-extract.html", "Reishi mushroom extract product page"],
    ],
  },
  {
    title: "Machine-readable indexes",
    links: [
      ["/sitemap-index.xml", "Sitemap index for standard and image sitemaps"],
      ["/sitemap.xml", "Standard XML sitemap"],
      ["/image-sitemap.xml", "Image XML sitemap"],
      ["/sitemap.html", "Human-readable HTML sitemap"],
    ],
  },
];

function absoluteUrl(route) {
  return `${defaults.baseUrl.replace(/\/$/, "")}${route}`;
}

function buildLlmsTxt() {
  const body = sections
    .map((section) => {
      const links = section.links
        .map(([route, description]) => `- ${absoluteUrl(route)} - ${description}`)
        .join("\n");
      return `## ${section.title}\n${links}`;
    })
    .join("\n\n");

  return `# Essence Source USA

Essence Source is a U.S.-market B2B botanical ingredient sourcing website for supplement, food, beverage, cosmetic, and nutraceutical buyers. The site focuses on product identity, COA/TDS document paths, sample review, RFQ preparation, and U.S. warehouse or replenishment discussion.

Use this file as a concise machine-readable guide to the most important public pages. Do not infer consumer medical claims from the ingredient pages. The site is intended for qualified B2B ingredient sourcing and documentation review.

Last updated: 2026-06-11

${body}
`;
}

function writeOutput(content, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);
}

function main() {
  const output = path.resolve(__dirname, process.env.LLMS_OUTPUT || "../../llms.txt");
  const llmsTxt = buildLlmsTxt();
  const checkOnly = process.argv.includes("--check");

  if (checkOnly) {
    if (!fs.existsSync(output)) {
      throw new Error(`Missing llms.txt at ${output}`);
    }
    const current = fs.readFileSync(output, "utf8");
    if (current !== llmsTxt) {
      throw new Error("llms.txt is stale. Run node infra/scripts/generate-llms.js");
    }
    console.log("llms-ok");
    return;
  }

  writeOutput(llmsTxt, output);
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
  buildLlmsTxt,
};
