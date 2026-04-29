"use strict";

require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const { parse } = require("csv-parse/sync");

const { loadStrapi, destroyStrapi } = require("./_bootstrap-strapi");
const { syncInventory } = require("../src/api/inventory-snapshot/services/inventory-sync");

function readPayload(inputPath) {
  const resolvedPath = path.resolve(process.cwd(), inputPath);
  const raw = fs.readFileSync(resolvedPath, "utf8");

  if (resolvedPath.endsWith(".csv")) {
    const rows = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (rows.length === 0) {
      throw new Error("CSV inventory file is empty.");
    }

    const warehouse = rows[0].warehouse;
    return {
      warehouse,
      items: rows.map((row) => ({
        sku: row.sku,
        slug: row.slug,
        status: row.status,
        lead_time: row.lead_time || null,
        updated_at: row.updated_at || null,
      })),
    };
  }

  return JSON.parse(raw);
}

async function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    throw new Error("Usage: npm run inventory:sync -- ./sample-data/inventory.json");
  }

  const payload = readPayload(inputPath);
  const app = await loadStrapi();
  global.strapi = app;

  try {
    const result = await syncInventory(payload);
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await destroyStrapi(app);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  readPayload,
};
