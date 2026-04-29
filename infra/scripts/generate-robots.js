#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const defaults = require("../seo/meta-defaults.json");

const projectRoot = path.resolve(__dirname, "../..");

function buildRobots(baseUrl) {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/internal
Disallow: /backend
Disallow: /infra
Disallow: /node_modules
Disallow: /test-results

Sitemap: ${normalizedBase}/sitemap.xml
`;
}

function writeOutput(content, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);
}

function main() {
  const baseUrl = process.env.SITEMAP_BASE_URL || defaults.baseUrl;
  const output = path.resolve(__dirname, process.env.ROBOTS_OUTPUT || "../../robots.txt");
  const robots = buildRobots(baseUrl);
  const checkOnly = process.argv.includes("--check");

  if (checkOnly) {
    if (!fs.existsSync(output)) {
      throw new Error(`Missing robots.txt at ${output}`);
    }
    const current = fs.readFileSync(output, "utf8");
    if (current !== robots) {
      throw new Error("robots.txt is stale. Run node infra/scripts/generate-robots.js");
    }
    console.log("robots-ok");
    return;
  }

  writeOutput(robots, output);
  const publicMirror = path.join(projectRoot, "public", "robots.txt");
  if (fs.existsSync(path.dirname(publicMirror))) {
    writeOutput(robots, publicMirror);
  }
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
  buildRobots,
};
