"use strict";

require("dotenv").config();

const { loadStrapi, destroyStrapi } = require("./_bootstrap-strapi");
const { seedPartner, partnerData } = require("./partner-seed");

const siteSettingsData = {
  global_cta_labels: {
    request_quote: "Request Quote",
    request_sample: "Request Sample",
    request_docs: "Ask for COA",
  },
  legal_disclaimers: {
    compliance:
      "Product information is provided for ingredient evaluation and formulation review only. It is not intended to diagnose, treat, cure, or prevent any disease.",
  },
  social_links: {
    linkedin: "https://www.linkedin.com/company/essence-source",
  },
  seo_defaults: {
    metaTitle: "Essence Source Botanical Ingredients Supplier in USA",
    metaDescription:
      "B2B botanical extracts, nutraceutical ingredients, cosmetic ingredients, and fruit and vegetable powders with U.S. warehousing support.",
    canonicalUrl: "https://essencesourceusa.com",
    ogTitle: "Essence Source Botanical Ingredients Supplier in USA",
    ogDescription:
      "Documentation-ready botanical ingredients with U.S. warehousing and manufacturing-backed supply.",
  },
};

const categories = [
  {
    name: "Botanical Extracts",
    slug: "botanical-extracts",
    description: "Standardized extracts for dietary supplement, beverage, and formulation use.",
    applications: ["Capsules", "Tablets", "Powders", "Functional Beverages"],
    seo: {
      metaTitle: "Botanical Extracts Supplier in USA | Essence Source",
      metaDescription:
        "Standardized botanical extracts supported by U.S. warehousing and documentation-ready supply.",
    },
  },
  {
    name: "Cosmetic Ingredients",
    slug: "cosmetic-ingredients",
    description: "Plant-derived actives and powders for personal care and topical products.",
    applications: ["Skin Care", "Masks", "Topical Formulas"],
    seo: {
      metaTitle: "Cosmetic Botanical Ingredients | Essence Source",
      metaDescription: "Plant-based cosmetic ingredients for B2B formulation programs.",
    },
  },
  {
    name: "Fruit & Vegetable Powders",
    slug: "fruit-vegetable-powders",
    description: "Spray-dried and concentrated powders for flavor, color, and nutrition positioning.",
    applications: ["Drink Mixes", "Snack Seasonings", "Functional Foods"],
    seo: {
      metaTitle: "Fruit and Vegetable Powders | Essence Source",
      metaDescription: "B2B fruit and vegetable powders for nutrition and food applications.",
    },
  },
];

const warehouseLocations = [
  {
    name: "US-East",
    country: "United States",
    state: "New Jersey",
    city: "Available by Inquiry",
    display_address: null,
    coverage_note: "Primary support for East Coast fulfillment and documentation coordination.",
    is_primary: true,
  },
  {
    name: "US-West",
    country: "United States",
    state: "California",
    city: "Available by Inquiry",
    display_address: null,
    coverage_note: "Secondary support for replenishment and sample dispatch.",
    is_primary: false,
  },
];

const certifications = [
  {
    name: "ISO 22000",
    issuer: "Accredited Certification Body",
    valid_until: null,
    applies_to: ["manufacturing", "quality-system"],
  },
  {
    name: "HACCP",
    issuer: "Accredited Certification Body",
    valid_until: null,
    applies_to: ["food-safety"],
  },
];

const products = [
  {
    name: "Green Coffee Bean Extract",
    slug: "green-coffee-bean-extract",
    short_description: "Standardized green coffee extract for supplement and beverage formulations.",
    full_description:
      "Green coffee bean extract supplied for B2B formulation teams seeking standardized chlorogenic acid specifications and documentation-ready support.",
    botanical_name: "Coffea arabica L.",
    part_used: "Fruit",
    main_component: "Chlorogenic acids",
    specification: "Chlorogenic acids 10%-60% HPLC",
    test_method: "HPLC",
    applications: ["Dietary Supplements", "Functional Beverages", "Food Formulations"],
    documentation_available: ["COA", "TDS", "SDS"],
    documentation_links: [],
    warehouse_status: "in_us_stock",
    lead_time: "2-5 business days",
    moq: "Available by Inquiry",
    tags: ["us-warehouse", "supplement", "beverage"],
    category: "botanical-extracts",
    partner: "gl-herb",
    seo: {
      metaTitle: "Green Coffee Bean Extract Supplier in USA | Essence Source",
      metaDescription:
        "Green coffee bean extract for supplement and beverage formulations with U.S. warehouse support.",
    },
  },
  {
    name: "Black Ginger Extract",
    slug: "black-ginger-extract",
    short_description: "Kaempferia parviflora extract for capsule, powder, and beverage concepts.",
    full_description:
      "Black ginger extract positioned for B2B buyers requiring standardized flavone specifications, partner-backed manufacturing, and documentation support.",
    botanical_name: "Kaempferia parviflora Wall. ex Baker",
    part_used: "Rhizome",
    main_component: "Polymethoxyflavones",
    specification: "Polymethoxyflavones 5%-10% HPLC",
    test_method: "HPLC",
    applications: ["Dietary Supplements", "Stick Packs", "Functional Drinks"],
    documentation_available: ["COA", "TDS"],
    documentation_links: [],
    warehouse_status: "available_by_inquiry",
    lead_time: "Please confirm",
    moq: "Available by Inquiry",
    tags: ["partner-backed", "standardized"],
    category: "botanical-extracts",
    partner: "gl-herb",
    seo: {
      metaTitle: "Black Ginger Extract Supplier in USA | Essence Source",
      metaDescription:
        "Black ginger extract for nutraceutical formulations with manufacturing-backed supply.",
    },
  },
  {
    name: "Artichoke Extract",
    slug: "artichoke-extract",
    short_description: "Artichoke leaf extract for supplement, powder blend, and formulation programs.",
    full_description:
      "Artichoke extract offered for B2B sourcing teams that need specification clarity, compliant product information, and managed documentation workflows.",
    botanical_name: "Cynara scolymus L.",
    part_used: "Leaf",
    main_component: "Cynarin",
    specification: "Cynarin 2.5%-5% UV",
    test_method: "UV",
    applications: ["Dietary Supplements", "Powder Blends", "Functional Foods"],
    documentation_available: ["COA", "TDS", "SDS"],
    documentation_links: [],
    warehouse_status: "pilot_lot_available",
    lead_time: "7-10 business days",
    moq: "Available by Inquiry",
    tags: ["pilot-lot", "documentation-ready"],
    category: "botanical-extracts",
    partner: "gl-herb",
    seo: {
      metaTitle: "Artichoke Extract Supplier in USA | Essence Source",
      metaDescription:
        "Artichoke extract for B2B ingredient programs with warehouse and documentation support.",
    },
  },
];

const brandedIngredients = [
  {
    brand_name: "SoluxBean",
    slug: "soluxbean",
    story:
      "Green coffee platform concept built around documentation-ready standardization and beverage-friendly formulation support.",
    differentiators: [
      "Standardized chlorogenic acid options",
      "U.S. warehouse coordination",
      "Specification-first B2B positioning",
    ],
    related_products: ["green-coffee-bean-extract"],
  },
  {
    brand_name: "GL NoirFlav",
    slug: "gl-noirflav",
    story:
      "Black ginger ingredient line positioned for formulation teams seeking standardized polymethoxyflavone content.",
    differentiators: [
      "Manufacturing-backed sourcing",
      "Supplement and beverage application fit",
      "Documentation workflows available by inquiry",
    ],
    related_products: ["black-ginger-extract"],
  },
];

const faqs = [
  {
    question: "Can I request COA or TDS before placing an order?",
    answer:
      "Yes. Documentation requests are handled through the inquiry workflow and reviewed based on product, application, and stage of evaluation.",
    sort_order: 1,
  },
  {
    question: "Do you publish retail pricing online?",
    answer:
      "No. Essence Source supports B2B ingredient programs, so pricing, MOQ, and logistics are handled through quotation.",
    sort_order: 2,
  },
];

const resources = [
  {
    title: "How to evaluate botanical ingredient documentation for U.S. supplement programs",
    slug: "evaluate-botanical-documentation",
    summary: "A B2B guide to reviewing specifications, COA workflows, and warehouse status signals.",
    content: "This placeholder resource can be expanded by content teams inside Strapi.",
    resource_type: "guide",
    seo: {
      metaTitle: "Botanical Ingredient Documentation Guide | Essence Source",
      metaDescription: "A resource placeholder for documentation-ready ingredient sourcing content.",
    },
  },
];

async function upsertByQuery(query, where, data) {
  const existing = await query.findOne({ where });

  if (existing) {
    return query.update({
      where: {
        id: existing.id,
      },
      data,
    });
  }

  return query.create({ data });
}

async function main() {
  const app = await loadStrapi();

  try {
    const partnerId = await seedPartner(app);

    const categoryMap = new Map();
    for (const category of categories) {
      const saved = await upsertByQuery(
        app.db.query("api::product-category.product-category"),
        { slug: category.slug },
        category,
      );
      categoryMap.set(category.slug, saved.id);
    }

    const warehouseMap = new Map();
    for (const warehouse of warehouseLocations) {
      const saved = await upsertByQuery(
        app.db.query("api::warehouse-location.warehouse-location"),
        { name: warehouse.name },
        warehouse,
      );
      warehouseMap.set(warehouse.name, saved.id);
    }

    const certificationIds = [];
    for (const certification of certifications) {
      const saved = await upsertByQuery(
        app.db.query("api::certification.certification"),
        { name: certification.name },
        {
          ...certification,
          partner_profile: partnerId,
        },
      );
      certificationIds.push(saved.id);
    }

    const productIdMap = new Map();
    for (const product of products) {
      const saved = await upsertByQuery(
        app.db.query("api::product.product"),
        { slug: product.slug },
        {
          ...product,
          category: categoryMap.get(product.category) ?? null,
          partner: partnerId,
          certifications: certificationIds,
        },
      );
      productIdMap.set(product.slug, saved.id);
    }

    for (const brand of brandedIngredients) {
      await upsertByQuery(
        app.db.query("api::brand-ingredient.brand-ingredient"),
        { slug: brand.slug },
        {
          ...brand,
          related_products: brand.related_products
            .map((slug) => productIdMap.get(slug))
            .filter(Boolean),
        },
      );
    }

    for (const faq of faqs) {
      await upsertByQuery(
        app.db.query("api::faq.faq"),
        { question: faq.question },
        faq,
      );
    }

    for (const resource of resources) {
      await upsertByQuery(
        app.db.query("api::resource.resource"),
        { slug: resource.slug },
        resource,
      );
    }

    const existingSettings = await app.db.query("api::site-settings.site-settings").findOne({
      where: {},
    });

    if (existingSettings) {
      await app.db.query("api::site-settings.site-settings").update({
        where: {
          id: existingSettings.id,
        },
        data: siteSettingsData,
      });
    } else {
      await app.db.query("api::site-settings.site-settings").create({
        data: siteSettingsData,
      });
    }

    console.log(
      JSON.stringify(
        {
          success: true,
          seeded: {
            categories: categories.length,
            warehouses: warehouseLocations.length,
            certifications: certifications.length,
            partner: partnerData.slug,
            products: products.length,
            brandedIngredients: brandedIngredients.length,
            faqs: faqs.length,
            resources: resources.length,
          },
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
  categories,
  warehouseLocations,
  certifications,
  products,
  brandedIngredients,
  faqs,
  resources,
  siteSettingsData,
};
