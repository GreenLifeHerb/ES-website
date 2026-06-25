"use strict";

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

function updateFile(relativePath, transform) {
  const filePath = path.join(rootDir, relativePath);
  const before = fs.readFileSync(filePath, "utf8");
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(filePath, after, "utf8");
    console.log(`Updated ${relativePath}`);
  }
}

const quoteMailto =
  'href="mailto:info@essencesourceusa.com?subject=Essence%20Source%20quote%20request"';
const sampleMailto =
  'href="mailto:info@essencesourceusa.com?subject=Essence%20Source%20sample%20request"';
const docsMailto =
  'href="mailto:info@essencesourceusa.com?subject=Essence%20Source%20document%20request"';
const detailsMailto =
  'href="mailto:info@essencesourceusa.com?subject=Essence%20Source%20product%20details%20request"';

const sharedFiles = [
  "products.html",
];

for (const file of sharedFiles) {
  updateFile(file, (content) =>
    content
      .replaceAll(
        'href="contact.html#contact-options">Request Quote</a>',
        `${quoteMailto}>Request Quote</a>`,
      )
      .replaceAll(
        'href="contact.html#contact-options">Request Sample</a>',
        `${sampleMailto}>Request Sample</a>`,
      )
      .replaceAll(
        'href="contact.html#contact-options">Ask for COA</a>',
        `${docsMailto}>Ask for COA</a>`,
      )
      .replaceAll(
        'href="contact.html#contact-options">Request details</a>',
        `${detailsMailto}>Request details</a>`,
      ),
  );
}

updateFile("products.html", (content) =>
  content
    .replace(
      'src="assets/img/optimized/photo-black-ginger-extract-1200.webp" alt="Representative photo-style visual of botanical root extract powder and raw material"',
      'src="assets/img/optimized/product-ashwagandha-photo-1200.webp" alt="Representative photo-style visual of botanical root extract powder and raw material"',
    )
    .replace(
      'src="assets/img/optimized/photo-green-coffee-extract-1200.webp" alt="Representative photo-style visual of botanical extract powder sample and raw material"',
      'src="assets/img/optimized/product-elderberry-1200.webp" alt="Representative photo-style visual of botanical extract powder sample and raw material"',
    )
    .replace(
      'src="assets/img/optimized/photo-green-coffee-extract-1200.webp" alt="Representative photo-style visual of botanical seed extract powder and raw material"',
      'src="assets/img/optimized/product-grape-seed-photo-1200.webp" alt="Representative photo-style visual of botanical seed extract powder and raw material"',
    )
    .replace(
      'src="assets/img/optimized/photo-green-coffee-extract-1200.webp" alt="Representative photo-style visual of rose fruit extract powder and raw material"',
      'src="assets/img/product-roxburgh-rose-extract.png" alt="Representative photo-style visual of rose fruit extract powder and raw material"',
    )
    .replace(
      'src="assets/img/optimized/photo-artichoke-extract-1200.webp" alt="Representative photo-style visual of ivy extract powder and botanical material"',
      'src="assets/img/product-ivy-extract.png" alt="Representative photo-style visual of ivy extract powder and botanical material"',
    )
    .replace(
      'src="assets/img/optimized/photo-black-ginger-extract-1200.webp" alt="Representative photo-style visual of fisetin extract powder and botanical material"',
      'src="assets/img/product-fisetin-cotinus-coggygria-extract.png" alt="Representative photo-style visual of fisetin extract powder and botanical material"',
    )
    .replace(
      'src="assets/img/optimized/photo-green-coffee-extract-1200.webp" alt="Representative photo-style visual of echinacea extract powder and botanical raw material"',
      'src="assets/img/product-echinacea-extract.png" alt="Representative photo-style visual of echinacea extract powder and botanical raw material"',
    )
    .replace(
      'src="assets/img/optimized/photo-artichoke-extract-1200.webp" alt="Representative photo-style visual of dioscorea nipponica extract powder and botanical raw material"',
      'src="assets/img/product-dioscorea-nipponica-extract.png" alt="Representative photo-style visual of dioscorea nipponica extract powder and botanical raw material"',
    )
    .replace(
      'src="assets/img/optimized/photo-black-ginger-extract-1200.webp" alt="Representative photo-style visual of ginger root extract powder and rhizome material"',
      'src="assets/img/product-ginger-root-extract.png" alt="Representative photo-style visual of ginger root extract powder and rhizome material"',
    )
    .replace(
      'src="assets/img/optimized/photo-green-coffee-extract-1200.webp" alt="Representative photo-style visual of aloe extract powder and botanical raw material"',
      'src="assets/img/product-aloe-extract.png" alt="Representative photo-style visual of aloe extract powder and botanical raw material"',
    )
    .replace(
      'src="assets/img/optimized/photo-artichoke-extract-1200.webp" alt="Representative photo-style visual of St. John\'s Wort extract powder and botanical raw material"',
      'src="assets/img/product-st-johns-wort-extract.png" alt="Representative photo-style visual of St. John\'s Wort extract powder and botanical raw material"',
    )
    .replace(
      'src="assets/img/optimized/photo-artichoke-extract-1200.webp" alt="Representative photo-style visual of white willow bark extract powder and bark raw material"',
      'src="assets/img/product-white-willow-bark-extract.png" alt="Representative photo-style visual of white willow bark extract powder and bark raw material"',
    )
    .replace(
      'src="assets/img/optimized/photo-green-coffee-extract-1200.webp" alt="Representative photo-style visual of cinnamon extract powder and bark material"',
      'src="assets/img/product-cinnamon-extract.png" alt="Representative photo-style visual of cinnamon extract powder and bark material"',
    )
    .replace(
      'src="assets/img/optimized/photo-green-coffee-extract-1200.webp" alt="Representative photo-style visual of kelp extract powder and marine botanical material"',
      'src="assets/img/product-kelp-extract.png" alt="Representative photo-style visual of kelp extract powder and marine botanical material"',
    )
    .replace(
      'src="assets/img/optimized/photo-black-ginger-extract-1200.webp" alt="Representative photo-style visual of soybean extract powder and plant-origin raw material"',
      'src="assets/img/product-soybean-extract.png" alt="Representative photo-style visual of soybean extract powder and plant-origin raw material"',
    )
    .replace(
      'src="assets/img/optimized/photo-artichoke-extract-1200.webp" alt="Representative photo-style visual of horsetail extract powder and botanical raw material"',
      'src="assets/img/product-horsetail-extract.png" alt="Representative photo-style visual of horsetail extract powder and botanical raw material"',
    ),
);
