#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("The sharp package is required. Run npm install before optimizing images.");
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, "../..");
const inputDir = path.join(projectRoot, "assets", "img");
const outputDir = path.join(inputDir, "optimized");
const sizes = [480, 768, 1200];
const supported = new Set([".jpg", ".jpeg", ".png", ".webp", ".svg"]);

function getImages(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && supported.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => path.join(dir, entry.name));
}

async function optimizeImage(filePath) {
  const basename = path.basename(filePath, path.extname(filePath));
  const image = sharp(filePath, { animated: false });
  const metadata = await image.metadata();
  const targetSizes = sizes.filter((width) => !metadata.width || width <= metadata.width || metadata.format === "svg");

  for (const width of targetSizes.length ? targetSizes : [metadata.width || 1200]) {
    const basePipeline = sharp(filePath, { animated: false }).resize({
      width,
      withoutEnlargement: true,
    });

    await basePipeline
      .clone()
      .webp({ quality: 82 })
      .toFile(path.join(outputDir, `${basename}-${width}.webp`));

    await basePipeline
      .clone()
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(outputDir, `${basename}-${width}.jpg`));
  }
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const images = getImages(inputDir);

  for (const image of images) {
    await optimizeImage(image);
  }

  console.log(`Optimized ${images.length} images into ${outputDir}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  getImages,
  optimizeImage,
};
