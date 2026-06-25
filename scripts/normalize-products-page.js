const fs = require("node:fs");
const path = require("node:path");

const productsPath = path.join(__dirname, "..", "products.html");
let html = fs.readFileSync(productsPath, "utf8");

const quoteHref =
  "mailto:info@essencesourceusa.com?subject=Essence%20Source%20quote%20request";
const sampleHref =
  "mailto:info@essencesourceusa.com?subject=Essence%20Source%20sample%20request";
const docsHref =
  "mailto:info@essencesourceusa.com?subject=Essence%20Source%20document%20request";

html = html.replace(
  /href="contact\.html#contact-options">Request Quote<\/a>/g,
  `href="${quoteHref}">Request Quote</a>`,
);
html = html.replace(
  /href="contact\.html#contact-options">Request Sample<\/a>/g,
  `href="${sampleHref}">Request Sample</a>`,
);
html = html.replace(
  /href="contact\.html#contact-options">Ask for COA<\/a>/g,
  `href="${docsHref}">Ask for COA</a>`,
);

const cardFixes = [
  {
    title: "Beet Root Powder",
    image: "assets/img/optimized/product-beet-powder-1200.webp",
    detailHref: "product-beet-root-powder.html",
  },
  {
    title: "Ashwagandha Root Extract",
    image: "assets/img/optimized/product-ashwagandha-photo-1200.webp",
    detailHref: "product-ashwagandha-root-extract.html",
  },
  {
    title: "Elderberry Extract",
    image: "assets/img/optimized/product-elderberry-1200.webp",
    detailHref: "product-elderberry-extract.html",
  },
  {
    title: "Rosemary Extract",
    detailHref: "product-rosemary-extract.html",
  },
  {
    title: "Grape Seed Extract",
    image: "assets/img/optimized/product-grape-seed-photo-1200.webp",
    detailHref: "product-grape-seed-extract.html",
  },
  {
    title: "Roxburgh Rose Extract",
    image: "assets/img/product-roxburgh-rose-extract.png",
  },
  {
    title: "Ivy Extract",
    image: "assets/img/product-ivy-extract.png",
  },
  {
    title: "Fisetin (Cotinus coggygria Extract)",
    image: "assets/img/product-fisetin-cotinus-coggygria-extract.png",
  },
  {
    title: "Echinacea Extract",
    image: "assets/img/product-echinacea-extract.png",
  },
  {
    title: "Dioscorea Nipponica Extract",
    image: "assets/img/product-dioscorea-nipponica-extract.png",
  },
  {
    title: "Ginger Root Extract",
    image: "assets/img/product-ginger-root-extract.png",
  },
  {
    title: "Aloe Extract",
    image: "assets/img/product-aloe-extract.png",
  },
  {
    title: "St. John's Wort Extract",
    image: "assets/img/product-st-johns-wort-extract.png",
  },
  {
    title: "White Willow Bark Extract",
    image: "assets/img/product-white-willow-bark-extract.png",
  },
  {
    title: "Cinnamon Extract",
    image: "assets/img/product-cinnamon-extract.png",
  },
  {
    title: "Kelp Extract",
    image: "assets/img/product-kelp-extract.png",
  },
  {
    title: "Soybean Extract",
    image: "assets/img/product-soybean-extract.png",
  },
  {
    title: "Horsetail Extract",
    image: "assets/img/product-horsetail-extract.png",
  },
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const fixByTitle = new Map(cardFixes.map((fix) => [fix.title, fix]));

html = html.replace(
  /<article class="product-card surface"[\s\S]*?<\/article>/g,
  (block) => {
    const titleMatch = block.match(
      /<h3>(?:<a href="[^"]+">)?([^<]+?)(?:<\/a>)?<\/h3>/,
    );

    if (!titleMatch) {
      return block;
    }

    const fix = fixByTitle.get(titleMatch[1]);
    if (!fix) {
      return block;
    }

    let updated = block;

    if (fix.image) {
      updated = updated.replace(/<img src="[^"]+"/, `<img src="${fix.image}"`);
    }

    if (fix.detailHref) {
      updated = updated.replace(
        new RegExp(`<h3>${escapeRegExp(fix.title)}</h3>`),
        `<h3><a href="${fix.detailHref}">${fix.title}</a></h3>`,
      );
      updated = updated.replace(
        /<a class="button button--secondary" href="[^"]+">Request details<\/a>/,
        `<a class="button button--secondary" href="${fix.detailHref}">View details</a>`,
      );
    }

    return updated;
  },
);

fs.writeFileSync(productsPath, html);
