"use strict";

require("dotenv").config();

const { loadStrapi, destroyStrapi } = require("./_bootstrap-strapi");

const partnerData = {
  partner_name: "GL Herb",
  slug: "gl-herb",
  overview:
    "Manufacturing partner supporting Essence Source with botanical extract production, process control, and export coordination for B2B ingredient programs.",
  capabilities: [
    "Botanical extraction and concentration",
    "Powder blending and granulation support",
    "Specification-driven production planning",
    "Export documentation coordination",
  ],
  lab_capabilities: [
    "HPLC and UV-Vis method support",
    "Raw material identity review",
    "Batch release documentation workflows",
    "Stability and retained sample support",
  ],
  disclaimer:
    "Partner information is presented for manufacturing transparency only. Final commercial offers, fulfillment, and U.S. customer coordination remain managed by Essence Source.",
};

async function seedPartner(strapi) {
  const existing = await strapi.db.query("api::partner-profile.partner-profile").findOne({
    where: {
      slug: partnerData.slug,
    },
  });

  if (existing) {
    await strapi.db.query("api::partner-profile.partner-profile").update({
      where: {
        id: existing.id,
      },
      data: partnerData,
    });

    return existing.id;
  }

  const created = await strapi.db.query("api::partner-profile.partner-profile").create({
    data: partnerData,
  });

  return created.id;
}

async function main() {
  const app = await loadStrapi();

  try {
    const partnerId = await seedPartner(app);
    console.log(
      JSON.stringify(
        {
          success: true,
          partner: partnerData.slug,
          id: partnerId,
        },
        null,
        2,
      ),
    );
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
  partnerData,
  seedPartner,
};
