#!/usr/bin/env node
"use strict";

/**
 * Ahrefs API v3 Integration Client
 * Programmatically queries domain rating, backlink counts, referring domains,
 * and high-opportunity B2B ranking keywords from Ahrefs.
 */

const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const AHREFS_API_TOKEN = process.env.AHREFS_API_TOKEN || null;
const AHREFS_TARGET = process.env.AHREFS_TARGET || "essencesourceusa.com";

function showSetupGuide() {
  console.log("\n====================================================");
  console.log("ℹ️ AHREFS API v3 SETUP GUIDE");
  console.log("====================================================");
  console.log("To connect programmatically to Ahrefs, follow these steps:");
  console.log("\n1. Go to Ahrefs Developer Portal (https://developer.ahrefs.com/)");
  console.log("2. Sign in with your Ahrefs enterprise/developer account.");
  console.log("3. Create a new App and generate a 'Developer Token' (v3 API).");
  console.log("4. Copy your token and open your local '.env' file.");
  console.log("5. Insert your token into the variable:");
  console.log("   AHREFS_API_TOKEN=your_developer_token_here");
  console.log(`6. Confirm the target domain under AHREFS_TARGET (currently: ${AHREFS_TARGET})`);
  console.log("\nOnce configured, run this script to fetch live Backlink metrics and Keyword insights!");
  console.log("====================================================\n");
}

async function queryAhrefsMetrics(target, token) {
  const url = `https://api.ahrefs.com/v3/public-api/metrics?target=${encodeURIComponent(target)}&mode=domain`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ahrefs API query failed with status ${response.status}: ${errText}`);
  }

  return await response.json();
}

async function main() {
  console.log("====================================================");
  console.log("🚀 ESSENCE SOURCE - AHREFS API v3 CONNECTOR");
  console.log(`Target Domain: ${AHREFS_TARGET}`);
  console.log("====================================================");

  if (!AHREFS_API_TOKEN) {
    console.log("\n⚠️  Ahrefs API Token (AHREFS_API_TOKEN) not found in environment configurations.");
    showSetupGuide();
    console.log("Exiting gracefully. Run in dry-run/mock mode.");
    return;
  }

  console.log(`\n📡 Querying Ahrefs Backlink Profile Metrics for: ${AHREFS_TARGET} ...`);

  try {
    const metricsData = await queryAhrefsMetrics(AHREFS_TARGET, AHREFS_API_TOKEN);
    console.log("�?Metrics successfully retrieved from Ahrefs!");

    const metrics = metricsData.metrics || {};
    const dr = metrics.domain_rating ?? 0;
    const backlinks = metrics.backlinks ?? 0;
    const refDomains = metrics.referring_domains ?? 0;
    const orgTraffic = metrics.organic_traffic ?? 0;

    console.log("\n📈 AHREFS DOMAIN ANALYSIS SUMMARY:");
    console.log("--------------------------------------------------------------------------------");
    console.log(`| Domain Rating (DR)      : ${String(dr).padEnd(50)} |`);
    console.log(`| Referring Domains       : ${String(refDomains).padEnd(50)} |`);
    console.log(`| Total Backlinks         : ${String(backlinks).padEnd(50)} |`);
    console.log(`| Organic Traffic (Est)   : ${String(orgTraffic).padEnd(50)} |`);
    console.log("--------------------------------------------------------------------------------");

    // Write report
    const reportPath = path.resolve(__dirname, "../../SITE_AUDIT_REPORT_AHREFS.md");
    let md = `# Ahrefs Competitive Intelligence & Authority Report

> **Generated on**: ${new Date().toUTCString()}
> **Ahrefs Audited Target**: [${AHREFS_TARGET}](https://${AHREFS_TARGET})
> **API Platform Engine**: Ahrefs v3 API

---

## 🛡�?Domain Authority & Trust Indices

| Authority Metric | Value | Status & Insight |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| **Domain Rating (DR)** | \`${dr}\` | Overall link popularity rating. Establishes brand equity. |\n`;
    md += `| **Referring Domains** | \`${refDomains}\` | Total unique domains linking back. Higher is better for ranking. |\n`;
    md += `| **Total Backlinks** | \`${backlinks}\` | Gross quantity of inbound backlinks pointing anywhere on site. |\n`;
    md += `| **Monthly Organic Traffic** | \`${orgTraffic}\` | Estimated monthly search visits across organic query index. |\n\n`;

    md += `## 💡 B2B Botanical Ingredient Link Building Strategies

1. **Leverage Corporate Trust**: Utilize standard documentation availability (COA and TDS) on Product pages to attract citation links from research directories and pharmaceutical index sites.
2. **Northeast US Partnership**: Build local backlinks and PR coverage by partnering with Northeast wellness organizations or supply chains, highlighting your dedicated **New York Commercial Office** presence.
3. **Manufacturer Profile Prominence**: Leverage your production partner's credentials to acquire high-authority links in the agriculture and botanical extraction domains.
`;

    fs.writeFileSync(reportPath, md);
    console.log(`\n🎉 Success! Ahrefs authority intelligence report saved to:\n   ${reportPath}`);

  } catch (error) {
    console.error("\n�?Ahrefs Connector Error:", error.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal Error running Ahrefs connector:", err);
  process.exit(1);
});
