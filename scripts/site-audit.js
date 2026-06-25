const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function getHtmlFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".html"))
    .map((name) => path.join(dir, name))
    .sort();
}

function extractIds(html) {
  const ids = new Set();
  const regex = /\sid=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(html))) {
    ids.add(match[1]);
  }
  return ids;
}

function extractAttrs(html, attr) {
  const values = [];
  const regex = new RegExp(`\\s${attr}=["']([^"']+)["']`, "g");
  let match;
  while ((match = regex.exec(html))) {
    values.push(match[1]);
  }
  return values;
}

function normalizeLocalRef(pagePath, ref) {
  const [rawPath, hash] = ref.split("#");
  const cleanPath = rawPath.split("?")[0];
  const targetPath = cleanPath
    ? path.resolve(path.dirname(pagePath), cleanPath)
    : pagePath;
  return { targetPath, hash: hash || "" };
}

function isIgnorableRef(ref) {
  return (
    !ref ||
    ref.startsWith("http://") ||
    ref.startsWith("https://") ||
    ref.startsWith("mailto:") ||
    ref.startsWith("tel:") ||
    ref.startsWith("javascript:") ||
    ref.startsWith("data:")
  );
}

function auditHtml() {
  const htmlFiles = getHtmlFiles(root);
  const htmlCache = new Map();
  const issues = [];

  for (const file of htmlFiles) {
    htmlCache.set(file, read(file));
  }

  for (const file of htmlFiles) {
    const html = htmlCache.get(file);
    const ids = extractIds(html);
    const refs = [
      ...extractAttrs(html, "href").map((value) => ({ type: "href", value })),
      ...extractAttrs(html, "src").map((value) => ({ type: "src", value })),
      ...extractAttrs(html, "action").map((value) => ({ type: "action", value })),
    ];

    for (const ref of refs) {
      if (isIgnorableRef(ref.value)) {
        continue;
      }

      const { targetPath, hash } = normalizeLocalRef(file, ref.value);
      if (!fileExists(targetPath)) {
        issues.push({
          file,
          type: "missing-target",
          refType: ref.type,
          value: ref.value,
        });
        continue;
      }

      if (hash) {
        const targetHtml = htmlCache.get(targetPath);
        if (targetHtml) {
          const targetIds = targetPath === file ? ids : extractIds(targetHtml);
          if (!targetIds.has(hash)) {
            issues.push({
              file,
              type: "missing-anchor",
              refType: ref.type,
              value: ref.value,
            });
          }
        }
      }
    }
  }

  return { htmlFiles, issues };
}

function auditProducts() {
  const productsPath = path.join(root, "assets", "data", "products.json");
  const products = JSON.parse(read(productsPath));
  const imageMap = new Map();
  const issues = [];

  for (const product of products) {
    const imagePath = path.join(root, product.image);
    if (!fileExists(imagePath)) {
      issues.push({
        type: "missing-image-file",
        slug: product.slug,
        image: product.image,
      });
    }

    if (!imageMap.has(product.image)) {
      imageMap.set(product.image, []);
    }
    imageMap.get(product.image).push(product);
  }

  for (const [image, group] of imageMap.entries()) {
    if (group.length > 1) {
      issues.push({
        type: "duplicate-product-image",
        image,
        products: group.map((item) => `${item.slug} | ${item.name}`),
      });
    }
  }

  return { count: products.length, issues };
}

function main() {
  const htmlAudit = auditHtml();
  const productAudit = auditProducts();

  console.log(`HTML pages: ${htmlAudit.htmlFiles.length}`);
  console.log(`Products: ${productAudit.count}`);
  console.log("");

  if (!htmlAudit.issues.length) {
    console.log("No broken local page/resource references found.");
  } else {
    console.log("HTML issues:");
    for (const issue of htmlAudit.issues) {
      console.log(
        `- [${issue.type}] ${path.basename(issue.file)} ${issue.refType}="${issue.value}"`
      );
    }
  }

  console.log("");

  if (!productAudit.issues.length) {
    console.log("No product image issues found.");
  } else {
    console.log("Product issues:");
    for (const issue of productAudit.issues) {
      if (issue.type === "duplicate-product-image") {
        console.log(`- [duplicate-product-image] ${issue.image}`);
        for (const product of issue.products) {
          console.log(`  - ${product}`);
        }
      } else {
        console.log(`- [${issue.type}] ${issue.slug} -> ${issue.image}`);
      }
    }
  }
}

main();
