#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const SITE = "https://essencesourceusa.com";
const OUT_DIR = path.join(ROOT, "tmp");
const OUT_JSON = path.join(OUT_DIR, "seo-baseline-audit-latest.json");
const OUT_MD = path.join(OUT_DIR, "seo-baseline-audit-latest.md");

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function attr(tag, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i");
  return tag.match(pattern)?.[1] || "";
}

function findMeta(html, name) {
  const re = new RegExp(`<meta\\b[^>]*(?:name|property)=["']${name}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0] || "";
  return tag ? attr(tag, "content") : "";
}

function findCanonical(html) {
  const tag = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0] || "";
  return tag ? attr(tag, "href") : "";
}

function findSchemaTypes(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  const types = new Set();
  for (const [, raw] of scripts) {
    try {
      const json = JSON.parse(raw.trim());
      const nodes = Array.isArray(json["@graph"]) ? json["@graph"] : [json];
      for (const node of nodes) {
        const type = node && node["@type"];
        if (Array.isArray(type)) type.forEach((item) => types.add(String(item)));
        else if (type) types.add(String(type));
      }
    } catch {
      types.add("INVALID_JSON_LD");
    }
  }
  return [...types].sort();
}

function pageUrl(file) {
  return file === "index.html" ? `${SITE}/` : `${SITE}/${file}`;
}

function parseSitemap() {
  const file = path.join(ROOT, "sitemap.xml");
  if (!fs.existsSync(file)) return new Set();
  const xml = fs.readFileSync(file, "utf8");
  return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
}

function auditPage(file, sitemapUrls) {
  const html = read(file);
  const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
  const description = findMeta(html, "description");
  const robots = findMeta(html, "robots");
  const canonical = findCanonical(html);
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
  const schemaTypes = findSchemaTypes(html);
  const url = pageUrl(file);
  const issues = [];
  const isNoindex = robots && /noindex/i.test(robots);
  const shouldHaveSchema = !isNoindex || sitemapUrls.has(url);

  if (!title) issues.push("missing_title");
  if (title.length > 65) issues.push("long_title");
  if (!description) issues.push("missing_description");
  if (description.length > 170) issues.push("long_description");
  if (!canonical) issues.push("missing_canonical");
  if (canonical && canonical !== url) issues.push("canonical_not_self");
  if (h1s.length !== 1) issues.push(`h1_count_${h1s.length}`);
  if (isNoindex && sitemapUrls.has(url)) issues.push("noindex_in_sitemap");
  if (shouldHaveSchema && !schemaTypes.length) issues.push("missing_schema");

  return {
    file,
    url,
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    canonical,
    robots,
    h1Count: h1s.length,
    h1: h1s[0] || "",
    schemaTypes,
    inSitemap: sitemapUrls.has(url),
    issues
  };
}

function makeMarkdown(rows) {
  const issueRows = rows.filter((row) => row.issues.length);
  const sitemapRows = rows.filter((row) => row.inSitemap);
  const noSchema = rows.filter((row) => row.issues.includes("missing_schema"));
  const duplicateTitles = Object.entries(groupBy(rows, (row) => row.title))
    .filter(([title, group]) => title && group.length > 1);
  const duplicateDescriptions = Object.entries(groupBy(rows, (row) => row.description))
    .filter(([description, group]) => description && group.length > 1);

  const lines = [];
  lines.push("# SEO Baseline Audit");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- HTML pages audited: ${rows.length}`);
  lines.push(`- XML sitemap URLs matched to local pages: ${sitemapRows.length}`);
  lines.push(`- Pages with issues: ${issueRows.length}`);
  lines.push(`- Duplicate titles: ${duplicateTitles.length}`);
  lines.push(`- Duplicate descriptions: ${duplicateDescriptions.length}`);
  lines.push(`- Pages missing JSON-LD schema: ${noSchema.length}`);
  lines.push("");
  lines.push("## Issues");
  lines.push("");
  lines.push("| File | Title Len | Description Len | H1 Count | In Sitemap | Issues |");
  lines.push("| --- | ---: | ---: | ---: | --- | --- |");
  for (const row of issueRows) {
    lines.push(`| \`${row.file}\` | ${row.titleLength} | ${row.descriptionLength} | ${row.h1Count} | ${row.inSitemap ? "yes" : "no"} | ${row.issues.join(", ")} |`);
  }
  lines.push("");
  lines.push("## Sitemap Priority Pages");
  lines.push("");
  lines.push("| File | Title | H1 | Schema |");
  lines.push("| --- | --- | --- | --- |");
  for (const row of sitemapRows) {
    lines.push(`| \`${row.file}\` | ${escapePipes(row.title)} | ${escapePipes(row.h1)} | ${row.schemaTypes.join(", ") || "none"} |`);
  }
  lines.push("");
  lines.push("## Duplicate Titles");
  lines.push("");
  for (const [title, group] of duplicateTitles) {
    lines.push(`- ${title}: ${group.map((row) => `\`${row.file}\``).join(", ")}`);
  }
  lines.push("");
  lines.push("## Duplicate Descriptions");
  lines.push("");
  for (const [description, group] of duplicateDescriptions) {
    lines.push(`- ${description}: ${group.map((row) => `\`${row.file}\``).join(", ")}`);
  }
  lines.push("");
  return lines.join("\n");
}

function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] ||= [];
    acc[key].push(item);
    return acc;
  }, {});
}

function escapePipes(value) {
  return String(value).replace(/\|/g, "\\|");
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const sitemapUrls = parseSitemap();
  const pages = fs.readdirSync(ROOT)
    .filter((file) => file.endsWith(".html"))
    .sort();
  const rows = pages.map((file) => auditPage(file, sitemapUrls));
  fs.writeFileSync(OUT_JSON, JSON.stringify(rows, null, 2));
  fs.writeFileSync(OUT_MD, makeMarkdown(rows));

  const issueCount = rows.filter((row) => row.issues.length).length;
  console.log(`seo-baseline-audit-ok pages=${rows.length} issues=${issueCount}`);
  console.log(path.relative(ROOT, OUT_MD));
}

main();
