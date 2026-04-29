const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
});

test("homepage loads and shows main CTA", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Botanical",
  );
  await expect(
    page.getByRole("link", { name: /Request Quote/i }).first(),
  ).toBeVisible();
});

test("mobile navigation opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const toggle = page.getByRole("button", { name: /open navigation menu/i });
  await toggle.click();
  await expect(page.locator("[data-mobile-drawer]")).toHaveAttribute(
    "data-open",
    "true",
  );
  await page.getByRole("button", { name: /close navigation menu/i }).click();
  await expect(page.locator("[data-mobile-drawer]")).toHaveAttribute(
    "data-open",
    "false",
  );
});

test("product filters reduce the visible list", async ({ page }) => {
  await page.goto("/products.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-product-card]")).toHaveCount(10);
  await page.selectOption("#filter-category", "Fruit & Vegetable Powders");
  await expect(page.locator("[data-product-card]")).toHaveCount(2);
});

test("contact form shows errors for empty required fields", async ({
  page,
}) => {
  await page.goto("/contact.html", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /submit inquiry/i }).click();
  await expect(page.locator("[data-error-for='name']")).toContainText(
    "Please enter your name.",
  );
  await expect(page.locator("[data-error-for='email']")).toContainText(
    "Please enter a valid business email.",
  );
});

test("product detail shows specification table and inquiry button", async ({
  page,
}) => {
  await page.goto("/product-green-coffee.html", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("table", { name: /product specification table/i }),
  ).toBeVisible();
  await expect(
    page
      .locator("[data-inquiry-sidebar]")
      .getByRole("link", { name: /Request Sample/i }),
  ).toBeVisible();
});

test("all core pages have a title", async ({ page }) => {
  const pages = [
    "/",
    "/products.html",
    "/brand-ingredients.html",
    "/applications.html",
    "/warehouse.html",
    "/quality.html",
    "/partner.html",
    "/about.html",
    "/resources.html",
    "/contact.html",
    "/privacy.html",
    "/terms.html",
    "/cookies.html",
    "/accessibility.html",
  ];

  for (const url of pages) {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/.+/);
  }
});

test("missing page returns custom 404 content", async ({ page }) => {
  const response = await page.goto("/missing-page", { waitUntil: "domcontentloaded" });
  expect(response && response.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Page not found",
  );
});

test("core buttons are keyboard focusable", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const target = page.getByRole("link", { name: /Request Quote/i }).first();

  for (let step = 0; step < 30; step += 1) {
    await page.keyboard.press("Tab");
    if (
      await target.evaluate((element) => element === document.activeElement)
    ) {
      break;
    }
  }

  await expect(target).toBeFocused();
});
