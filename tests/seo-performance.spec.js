const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { test, expect } = require("@playwright/test");

const rootDir = path.resolve(__dirname, "..");

test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
});

function read(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), "utf8");
}

function getJsonLd(html) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match) => JSON.parse(match[1].trim()),
  );
}

test("sitemap.xml exists and includes key URLs", async () => {
  const sitemap = read("sitemap.xml");
  expect(sitemap).toContain("https://essencesourceusa.com/");
  expect(sitemap).toContain("product-green-coffee.html");
  expect(sitemap).toContain("warehouse.html");
  expect(sitemap).toContain("resources.html");
});

test("robots.txt declares sitemap and blocks backend paths", async () => {
  const robots = read("robots.txt");
  expect(robots).toContain("Sitemap: https://essencesourceusa.com/sitemap.xml");
  expect(robots).toMatch(/Disallow:\s*\/admin/);
  expect(robots).toMatch(/Disallow:\s*\/api\/internal/);
});

test("product page outputs Product JSON-LD and canonical", async ({ page }) => {
  await page.goto("/product-green-coffee.html", { waitUntil: "domcontentloaded" });
  const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.map((node) => JSON.parse(node.textContent)),
  );
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toBeTruthy();
  expect(schemas.some((schema) => schema["@type"] === "Product")).toBeTruthy();
  expect(schemas.some((schema) => schema["@type"] === "BreadcrumbList")).toBeTruthy();
});

test("FAQ page outputs FAQPage JSON-LD", async ({ page }) => {
  await page.goto("/resources.html", { waitUntil: "domcontentloaded" });
  const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.map((node) => JSON.parse(node.textContent)),
  );
  expect(schemas.some((schema) => schema["@type"] === "FAQPage")).toBeTruthy();
});

test("all static images have alt text", async () => {
  const htmlFiles = fs.readdirSync(rootDir).filter((file) => file.endsWith(".html"));
  for (const file of htmlFiles) {
    const html = read(file);
    const images = [...html.matchAll(/<img\b[^>]*>/gi)];
    for (const image of images) {
      expect(image[0], `${file} has an image without alt`).toMatch(/\salt=["'][^"']+["']/i);
    }
  }
});

test("optimize-images.js can generate webp output", async () => {
  execFileSync("node", ["infra/scripts/optimize-images.js"], {
    cwd: rootDir,
    stdio: "pipe",
  });
  const outputDir = path.join(rootDir, "assets", "img", "optimized");
  const webpFiles = fs.readdirSync(outputDir).filter((file) => file.endsWith(".webp"));
  expect(webpFiles.length).toBeGreaterThan(0);
});

test("custom 404 page is reachable", async ({ page }) => {
  const response = await page.goto("/not-a-real-page", { waitUntil: "domcontentloaded" });
  expect(response.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Page not found");
});

test("nginx config sets Cache-Control for static assets", async () => {
  const nginxConfig = read("infra/nginx/default.conf");
  expect(nginxConfig).toContain("Cache-Control");
  expect(nginxConfig).toContain("max-age=31536000");
});

test("hreflang alternates are paired when enabled", async () => {
  const htmlFiles = fs.readdirSync(rootDir).filter((file) => file.endsWith(".html"));
  for (const file of htmlFiles) {
    const html = read(file);
    const alternates = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]*>/gi)];
    if (alternates.length > 0) {
      const values = alternates.map((match) => match[1]);
      expect(values).toContain("x-default");
      expect(values.some((value) => value === "en" || value === "en-US")).toBeTruthy();
    }
  }
});

test("JSON-LD blocks are valid JSON", async () => {
  const htmlFiles = fs.readdirSync(rootDir).filter((file) => file.endsWith(".html"));
  for (const file of htmlFiles) {
    const schemas = getJsonLd(read(file));
    expect(Array.isArray(schemas)).toBeTruthy();
  }
});
