#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { allHtmlRoutes } = require("./generate-sitemap");

const projectRoot = path.resolve(__dirname, "../..");
const baseUrl = "https://essencesourceusa.com";

function readSiteContent() {
  const source = fs.readFileSync(path.join(projectRoot, "assets", "data", "site-content.js"), "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox.window.ESSENCE_SOURCE_CONTENT || {};
}

function normalizeText(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function getMeta(html, name) {
  const pattern = new RegExp(`<meta\\s+name=["']${name}["'][^>]*content=["']([^"']+)["']`, "i");
  return html.match(pattern)?.[1] || "";
}

function getTitle(html) {
  return normalizeText(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
}

function getH1(html) {
  return normalizeText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
}

function getHeadings(html) {
  return Array.from(html.matchAll(/<h[2-3][^>]*>([\s\S]*?)<\/h[2-3]>/gi))
    .map((match) => normalizeText(match[1]))
    .filter(Boolean)
    .slice(0, 8);
}

function routeToFile(route) {
  return path.join(projectRoot, route === "/" ? "index.html" : route.replace(/^\//, ""));
}

function routeToUrl(route) {
  return route === "/" ? "index.html" : route.replace(/^\//, "");
}

function getProductHrefMap() {
  const html = fs.readFileSync(path.join(projectRoot, "products.html"), "utf8");
  const map = new Map();
  const articles = html.split(/<article\b/i).slice(1);

  for (const article of articles) {
    if (!/data-product-card/i.test(article)) continue;
    const slug = article.match(/data-slug=["']([^"']+)["']/i)?.[1];
    const href = article.match(/href=["'](product-[^"']+\.html)["']/i)?.[1];
    if (slug && href) map.set(slug, href);
  }

  return map;
}

function keywordList(values) {
  return values
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter(Boolean)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function buildProductEntries() {
  const products = JSON.parse(fs.readFileSync(path.join(projectRoot, "assets", "data", "products.json"), "utf8"));
  const hrefMap = getProductHrefMap();

  return products.map((product) => {
    const href = hrefMap.get(product.slug) || `product-${product.slug}.html`;
    return {
      id: `product:${product.slug}`,
      type: "Product",
      group: "Products",
      title: product.name,
      url: href,
      summary: product.summary || product.detail_intro || "",
      image: product.image || "",
      tags: keywordList([product.category, product.warehouse_status, product.documents, product.applications]).slice(0, 8),
      keywords: keywordList([
        product.name,
        product.category,
        product.botanical_name,
        product.part_used,
        product.specification,
        product.testing_methodology,
        product.cas_number,
        product.chemical_formula,
        product.documents,
        product.applications,
        product.warehouse_status,
        "COA",
        "TDS",
        "sample",
        "RFQ",
        "quote",
      ]),
    };
  });
}

function classifyPage(route, title, summary) {
  const routeTitle = `${route} ${title}`.toLowerCase();
  const haystack = `${routeTitle} ${summary}`.toLowerCase();
  if (
    routeTitle.includes("coa") ||
    routeTitle.includes("tds") ||
    routeTitle.includes("rfq") ||
    routeTitle.includes("sample request") ||
    routeTitle.includes("email template")
  ) {
    return { type: "Document", group: "Documents" };
  }
  if (
    route.includes("insight") ||
    route.includes("market") ||
    route.includes("technical") ||
    route.includes("buyer-guide") ||
    route.includes("notes") ||
    route.includes("specification-guide") ||
    route.includes("checklist")
  ) {
    return { type: "Insight", group: "Insights" };
  }
  if (route.includes("resources")) return { type: "Resource", group: "Resources" };
  return { type: "Page", group: "Pages" };
}

function buildResourceEntries(content) {
  return (content.resources || []).map((item) => {
    const classification = classifyPage(item.url || "", item.title, item.summary);
    return {
      id: `resource:${item.url}`,
      type: item.type || classification.type,
      group: classification.group,
      title: item.title,
      url: item.url,
      summary: item.summary || "",
      image: "",
      tags: keywordList([item.type, classification.group]).slice(0, 4),
      keywords: keywordList([item.title, item.type, item.summary, "COA", "TDS", "RFQ", "sample", "buyer guide"]),
    };
  });
}

function buildPageEntries(existingUrls) {
  return allHtmlRoutes
    .filter((route) => route !== "/")
    .map((route) => {
      const url = routeToUrl(route);
      if (existingUrls.has(url) || url.startsWith("product-")) return null;

      const file = routeToFile(route);
      if (!fs.existsSync(file)) return null;
      const html = fs.readFileSync(file, "utf8");
      const title = getH1(html) || getTitle(html).replace(/\s*\|\s*Essence Source.*/i, "");
      const summary = getMeta(html, "description");
      const headings = getHeadings(html);
      const classification = classifyPage(url, title, summary);

      return {
        id: `page:${url}`,
        type: classification.type,
        group: classification.group,
        title,
        url,
        summary,
        image: "",
        tags: keywordList([classification.group, ...headings.slice(0, 2)]).slice(0, 4),
        keywords: keywordList([title, summary, headings, url.replace(/[-.]/g, " "), "botanical ingredients"]),
      };
    })
    .filter(Boolean);
}

function dedupeEntries(entries) {
  const byUrl = new Map();

  for (const entry of entries) {
    if (!entry.url || !entry.title) continue;
    const key = entry.url.split("#")[0];
    if (!byUrl.has(key)) {
      byUrl.set(key, entry);
      continue;
    }

    const current = byUrl.get(key);
    byUrl.set(key, {
      ...current,
      summary: current.summary || entry.summary,
      tags: Array.from(new Set([...(current.tags || []), ...(entry.tags || [])])).slice(0, 8),
      keywords: Array.from(new Set([...(current.keywords || []), ...(entry.keywords || [])])),
    });
  }

  return Array.from(byUrl.values()).sort((a, b) => {
    const groupOrder = ["Products", "Documents", "Insights", "Resources", "Pages"];
    return groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) || a.title.localeCompare(b.title);
  });
}

function main() {
  const content = readSiteContent();
  const resources = buildResourceEntries(content);
  const existingUrls = new Set(resources.map((entry) => entry.url?.split("#")[0]).filter(Boolean));
  const entries = dedupeEntries([
    ...buildProductEntries(),
    ...resources,
    ...buildPageEntries(existingUrls),
  ]);

  const output = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    entries,
  };

  const outputPath = path.join(projectRoot, "assets", "data", "search-index.json");
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Generated ${entries.length} search entries at ${outputPath}`);
}

if (require.main === module) {
  main();
}
