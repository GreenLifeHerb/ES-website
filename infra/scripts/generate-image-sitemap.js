#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const defaults = require("../seo/meta-defaults.json");
const { allHtmlRoutes } = require("./generate-sitemap");

const projectRoot = path.resolve(__dirname, "../..");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toAbsoluteUrl(baseUrl, assetPath) {
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  return `${baseUrl.replace(/\/$/, "")}/${assetPath.replace(/^\//, "")}`;
}

function routeToFile(route) {
  if (route === "/") return path.join(projectRoot, "index.html");
  return path.join(projectRoot, route.replace(/^\//, ""));
}

function getImagesFromHtml(route) {
  const filePath = routeToFile(route);
  if (!fs.existsSync(filePath)) return [];

  const html = fs.readFileSync(filePath, "utf8");
  return [...html.matchAll(/<img\b[^>]*>/gi)]
    .map((match) => {
      const tag = match[0];
      const src = tag.match(/\ssrc=["']([^"']+)["']/i)?.[1];
      const alt = tag.match(/\salt=["']([^"']+)["']/i)?.[1];
      if (!src || src.startsWith("data:")) return null;
      return { src, caption: alt || "" };
    })
    .filter(Boolean);
}

function getImagesFromProducts() {
  const productsPath = path.join(projectRoot, "assets", "data", "products.json");
  if (!fs.existsSync(productsPath)) return [];

  return JSON.parse(fs.readFileSync(productsPath, "utf8"))
    .filter((product) => product.image)
    .map((product) => ({
      route: product.page || `/product-${product.slug}.html`,
      src: product.image,
      caption: product.alt || product.name,
    }));
}

function buildImageSitemap(baseUrl) {
  const routeImages = new Map();

  for (const route of allHtmlRoutes.filter((entry) => entry !== "/sitemap.html")) {
    const images = getImagesFromHtml(route);
    if (images.length > 0) {
      routeImages.set(route, images);
    }
  }

  for (const productImage of getImagesFromProducts()) {
    if (!routeImages.has(productImage.route)) {
      routeImages.set(productImage.route, []);
    }
    routeImages.get(productImage.route).push({
      src: productImage.src,
      caption: productImage.caption,
    });
  }

  const urlEntries = [...routeImages.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([route, images]) => {
      const uniqueImages = [...new Map(images.map((image) => [image.src, image])).values()];
      const imageEntries = uniqueImages
        .map(
          (image) => `    <image:image>
      <image:loc>${escapeXml(toAbsoluteUrl(baseUrl, image.src))}</image:loc>
      <image:caption>${escapeXml(image.caption)}</image:caption>
    </image:image>`,
        )
        .join("\n");

      return `  <url>
    <loc>${escapeXml(toAbsoluteUrl(baseUrl, route))}</loc>
${imageEntries}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>
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
    process.env.IMAGE_SITEMAP_OUTPUT || "../../image-sitemap.xml",
  );
  const sitemap = buildImageSitemap(baseUrl);
  const checkOnly = process.argv.includes("--check");

  if (checkOnly) {
    if (!fs.existsSync(output)) {
      throw new Error(`Missing image sitemap at ${output}`);
    }
    const current = fs.readFileSync(output, "utf8");
    if (current !== sitemap) {
      throw new Error(
        "image-sitemap.xml is stale. Run node infra/scripts/generate-image-sitemap.js",
      );
    }
    console.log("image-sitemap-ok");
    return;
  }

  writeOutput(sitemap, output);
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
  buildImageSitemap,
};
