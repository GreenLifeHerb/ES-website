#!/usr/bin/env node
"use strict";

/**
 * Google PageSpeed Insights API Auditor
 * Audits site performance, accessibility, best-practices, and SEO programmatically.
 * Outputs a beautiful, comprehensive markdown report 'SITE_AUDIT_REPORT_PAGESPEED.md'.
 */

const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const PAGESPEED_API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

// Default target to audit: live deployed production site
const DEFAULT_BASE_URL = "https://essencesource-website-345072983702.us-central1.run.app";

const AUDIT_PATHS = [
  "/",
  "/products.html",
  "/product-artichoke.html",
  "/about.html",
  "/new-york-office.html"
];

function formatScore(score) {
  const pct = Math.round(score * 100);
  if (pct >= 90) return `🟢 **${pct}** (Excellent)`;
  if (pct >= 50) return `🟡 **${pct}** (Needs Improvement)`;
  return `🔴 **${pct}** (Poor)`;
}

function getMetricStatus(value, metricName) {
  if (metricName === "LCP") {
    return value <= 2500 ? "🟢 Good" : value <= 4000 ? "🟡 Needs Improvement" : "🔴 Poor";
  }
  if (metricName === "FID" || metricName === "TBT") {
    const val = parseFloat(value);
    if (metricName === "TBT") {
      return val <= 200 ? "🟢 Good" : val <= 600 ? "🟡 Needs Improvement" : "🔴 Poor";
    }
  }
  if (metricName === "CLS") {
    return value <= 0.1 ? "🟢 Good" : value <= 0.25 ? "🟡 Needs Improvement" : "🔴 Poor";
  }
  return "ℹ️ Info";
}

async function runAuditForUrl(baseUrl, relativePath, apiKey) {
  const targetUrl = `${baseUrl.replace(/\/$/, "")}${relativePath}`;
  console.log(`Auditing target URL: ${targetUrl} ...`);

  let requestUrl = `${PAGESPEED_API_URL}?url=${encodeURIComponent(targetUrl)}&category=performance&category=seo&category=accessibility&category=best-practices&strategy=mobile`;
  if (apiKey) {
    requestUrl += `&key=${apiKey}`;
  }

  try {
    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error(`Google API returned status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;

    if (!lighthouse) {
      throw new Error("Lighthouse results are missing from the API response.");
    }

    const categories = lighthouse.categories;
    const audits = lighthouse.audits;

    const auditResult = {
      path: relativePath,
      fullUrl: targetUrl,
      timestamp: new Date().toISOString(),
      scores: {
        performance: categories.performance?.score ?? 0,
        accessibility: categories.accessibility?.score ?? 0,
        bestPractices: categories["best-practices"]?.score ?? 0,
        seo: categories.seo?.score ?? 0
      },
      metrics: {
        fcp: audits["first-contentful-paint"]?.displayValue ?? "N/A",
        lcp: audits["largest-contentful-paint"]?.displayValue ?? "N/A",
        tbt: audits["total-blocking-time"]?.displayValue ?? "N/A",
        cls: audits["cumulative-layout-shift"]?.displayValue ?? "N/A",
        speedIndex: audits["speed-index"]?.displayValue ?? "N/A"
      },
      opportunities: [],
      seoDetails: []
    };

    // Extract opportunities (failed performance audits)
    const perfOppAudits = [
      "modern-image-formats",
      "uses-responsive-images",
      "uses-optimized-images",
      "render-blocking-resources",
      "unused-css-rules",
      "unused-javascript",
      "offscreen-images"
    ];

    perfOppAudits.forEach((id) => {
      const audit = audits[id];
      if (audit && audit.score !== null && audit.score < 0.9) {
        auditResult.opportunities.push({
          title: audit.title,
          description: audit.description.replace(/\[Learn more\]\([^)]+\)\.?/g, ""),
          displayValue: audit.displayValue || "Potential Savings Available"
        });
      }
    });

    // Extract SEO failed items
    const seoAudits = [
      "document-title",
      "meta-description",
      "image-alt",
      "canonical",
      "link-text",
      "crawlable-anchors",
      "heading-order"
    ];

    seoAudits.forEach((id) => {
      const audit = audits[id];
      if (audit && audit.score !== null && audit.score < 0.9) {
        auditResult.seoDetails.push({
          title: audit.title,
          description: audit.description.replace(/\[Learn more\]\([^)]+\)\.?/g, "")
        });
      }
    });

    return auditResult;
  } catch (error) {
    console.error(`❌ Error auditing ${relativePath}:`, error.message);
    return {
      path: relativePath,
      fullUrl: targetUrl,
      error: error.message
    };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const baseUrl = args[0] || process.env.PAGESPEED_TARGET_URL || DEFAULT_BASE_URL;
  const apiKey = process.env.PAGESPEED_API_KEY || null;

  console.log("====================================================");
  console.log("🚀 ESSENCE SOURCE - GOOGLE PAGESPEED AUDITOR");
  console.log(`Target Site: ${baseUrl}`);
  if (apiKey) {
    console.log("API Key: Loaded");
  } else {
    console.log("API Key: Not provided (Using public quota limit)");
  }
  console.log("====================================================\n");

  const results = [];
  for (const relativePath of AUDIT_PATHS) {
    const res = await runAuditForUrl(baseUrl, relativePath, apiKey);
    results.push(res);
    // Add small cooling period to prevent hitting rate limits
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Generate markdown report
  const reportPath = path.resolve(__dirname, "../../SITE_AUDIT_REPORT_PAGESPEED.md");
  let md = `# PageSpeed Insights Programmatic Site Audit Report

> **Generated on**: ${new Date().toLocaleString("en-US", { timeZone: "UTC" })} UTC
> **Audited Target URL**: [${baseUrl}](${baseUrl})
> **Audit Device Strategy**: Mobile (Simulated)

---

## 📈 Executive Score Summary

| Page Path | Performance | Accessibility | Best Practices | SEO |
| :--- | :--- | :--- | :--- | :--- |
`;

  results.forEach((res) => {
    if (res.error) {
      md += `| \`${res.path}\` | ❌ *Failed* | *Audit error: ${res.error}* | - | - |\n`;
    } else {
      md += `| \`${res.path}\` | ${formatScore(res.scores.performance)} | ${formatScore(res.scores.accessibility)} | ${formatScore(res.scores.bestPractices)} | ${formatScore(res.scores.seo)} |\n`;
    }
  });

  md += `\n---\n\n## 🔍 Deep-Dive Page Audits\n\n`;

  results.forEach((res) => {
    if (res.error) return;

    md += `### 📄 Page: \`${res.path}\`\n`;
    md += `- **Full URL**: [${res.fullUrl}](${res.fullUrl})\n\n`;

    md += `#### Core Web Vitals & Loading Metrics\n`;
    md += `| Metric Name | Value | Status |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| **Largest Contentful Paint (LCP)** | \`${res.metrics.lcp}\` | ${getMetricStatus(parseFloat(res.metrics.lcp), "LCP")} |\n`;
    md += `| **Total Blocking Time (TBT)** | \`${res.metrics.tbt}\` | ${getMetricStatus(parseFloat(res.metrics.tbt), "TBT")} |\n`;
    md += `| **Cumulative Layout Shift (CLS)** | \`${res.metrics.cls}\` | ${getMetricStatus(parseFloat(res.metrics.cls), "CLS")} |\n`;
    md += `| **First Contentful Paint (FCP)** | \`${res.metrics.fcp}\` | ℹ️ Info |\n`;
    md += `| **Speed Index** | \`${res.metrics.speedIndex}\` | ℹ️ Info |\n\n`;

    if (res.opportunities.length > 0) {
      md += `#### ⚡ Performance Improvement Opportunities\n`;
      res.opportunities.forEach((opp) => {
        md += `- **${opp.title}** (${opp.displayValue})\n`;
        md += `  *Recommendation: ${opp.description}*\n`;
      });
      md += `\n`;
    } else {
      md += `#### ⚡ Performance: 🟢 Passed all primary opportunities!\n\n`;
    }

    if (res.seoDetails.length > 0) {
      md += `#### 🎯 SEO Optimization Items\n`;
      res.seoDetails.forEach((seo) => {
        md += `- **${seo.title}**\n`;
        md += `  *Recommendation: ${seo.description}*\n`;
      });
      md += `\n`;
    } else {
      md += `#### 🎯 SEO: 🟢 Passed all basic crawling index audits!\n\n`;
    }

    md += `---\n\n`;
  });

  md += `## 🚀 Next Optimization Steps

1. **Optimize Images**: Serve images in next-gen formats (WebP/AVIF) and size them correctly to decrease **LCP**.
2. **Review Render-Blocking Resources**: Minimize blocking scripts and defer CSS/JS not used for initial layout.
3. **Structured Data Continuity**: Keep running \`node infra/scripts/validate-structured-data.js\` during every change to preserve 100% Rich Result compliance.
`;

  fs.writeFileSync(reportPath, md);
  console.log(`\n🎉 Success! Beautiful PageSpeed audit report saved to:\n   ${reportPath}`);
}

main().catch((err) => {
  console.error("Fatal Error running PageSpeed auditor:", err);
  process.exit(1);
});
