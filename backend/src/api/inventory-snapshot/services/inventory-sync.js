"use strict";

const { WAREHOUSE_STATUSES } = require("../../../utils/constants");

function validateInventoryPayload(payload) {
  const items = payload?.items ?? [];
  if (!payload?.warehouse || !Array.isArray(items)) {
    throw new Error("warehouse and items[] are required.");
  }

  for (const item of items) {
    if (!item.sku || !item.slug || !WAREHOUSE_STATUSES.includes(item.status)) {
      throw new Error(`Invalid inventory item for sku ${item?.sku ?? "unknown"}.`);
    }
  }
}

async function syncInventory(payload) {
  validateInventoryPayload(payload);

  const warehouse = await strapi.db.query("api::warehouse-location.warehouse-location").findOne({
    where: {
      name: payload.warehouse,
    },
  });

  if (!warehouse) {
    throw new Error(`Warehouse "${payload.warehouse}" not found.`);
  }

  let updated = 0;
  let failed = 0;

  for (const item of payload.items) {
    try {
      const product = await strapi.db.query("api::product.product").findOne({
        where: {
          slug: item.slug,
        },
      });

      if (!product) {
        failed += 1;
        continue;
      }

      const existing = await strapi.db.query("api::inventory-snapshot.inventory-snapshot").findOne({
        where: {
          sku: item.sku,
          product: product.id,
          warehouse: warehouse.id,
        },
      });

      const data = {
        sku: item.sku,
        product: product.id,
        warehouse: warehouse.id,
        quantity_status: item.status,
        lead_time: item.lead_time ?? null,
        updated_at: item.updated_at ?? new Date().toISOString(),
      };

      if (existing) {
        await strapi.db.query("api::inventory-snapshot.inventory-snapshot").update({
          where: {
            id: existing.id,
          },
          data,
        });
      } else {
        await strapi.db.query("api::inventory-snapshot.inventory-snapshot").create({
          data,
        });
      }

      await strapi.db.query("api::product.product").update({
        where: {
          id: product.id,
        },
        data: {
          warehouse_status: item.status,
          lead_time: item.lead_time ?? product.lead_time ?? null,
        },
      });

      updated += 1;
    } catch (error) {
      failed += 1;
      strapi.log.error(`Inventory sync failed for sku ${item.sku}`, error);
    }
  }

  return {
    success: true,
    updated,
    failed,
  };
}

module.exports = {
  syncInventory,
  validateInventoryPayload,
};
