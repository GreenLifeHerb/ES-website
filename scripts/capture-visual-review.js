const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const outputDir = path.join(__dirname, "..", "tmp", "visual-review");
fs.mkdirSync(outputDir, { recursive: true });

const pages = [
  ["index", "http://127.0.0.1:4173/index.html"],
  ["products", "http://127.0.0.1:4173/products.html"],
  ["brand-ingredients", "http://127.0.0.1:4173/brand-ingredients.html"],
  ["specialty-ingredients", "http://127.0.0.1:4173/specialty-ingredients.html"],
  ["specification-extracts", "http://127.0.0.1:4173/specification-extracts.html"],
  ["natural-mushrooms", "http://127.0.0.1:4173/natural-mushrooms.html"],
];

async function warmLazyLoadedImages(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const totalHeight = document.body.scrollHeight;
    let position = 0;

    while (position < totalHeight) {
      window.scrollTo(0, position);
      position += Math.max(window.innerHeight * 0.8, 700);
      await delay(120);
    }

    window.scrollTo(0, document.body.scrollHeight);
    await delay(400);
    window.scrollTo(0, 0);
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 2200 },
    deviceScaleFactor: 1,
  });

  const results = [];

  for (const [name, url] of pages) {
    await page.goto(url, { waitUntil: "networkidle" });
    await warmLazyLoadedImages(page);
    const bodyBox = await page.locator("body").boundingBox();
    const filePath = path.join(outputDir, `${name}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    results.push({
      name,
      url,
      title: await page.title(),
      file: filePath,
      height: bodyBox ? Math.round(bodyBox.height) : null,
    });
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
