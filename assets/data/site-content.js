window.ESSENCE_SOURCE_CONTENT = {
  siteName: "Essence Source",
  domain: "https://essencesourceusa.com",
  tagline: "U.S.-warehouse-backed botanical ingredients",
  description:
    "Essence Source is a botanical ingredients website for U.S. B2B buyers seeking documentation-ready sourcing with U.S. warehousing support and manufacturing-backed supply.",
  contact: {
    email: "hello@essencesourceusa.com",
    linkedInLabel: "Essence Source on LinkedIn",
    linkedInUrl: "https://www.linkedin.com/company/essence-source/",
    responseTime: "Typical reply within one business day",
  },
  endpoints: {
    inquiry: "/api/inquiry",
    sample: "/api/sample",
    documents: "/api/documents",
  },
  forms: {
    mockMode: true,
    successMessage:
      "Thanks. Your request has been recorded in front-end demo mode. Connect the placeholder fetch endpoint when the CRM or email workflow is ready.",
    errorMessage:
      "The request could not be completed. Please try again or email hello@essencesourceusa.com.",
  },
  trustBadges: [
    "US Warehousing Support",
    "Documentation-Ready Supply",
    "Manufacturing-Backed",
    "B2B Inquiry Workflow",
  ],
  primaryNav: [
    { href: "products.html", label: "Products" },
    { href: "brand-ingredients.html", label: "Brand Ingredients" },
    { href: "applications.html", label: "Applications" },
    { href: "warehouse.html", label: "U.S. Warehouse" },
    { href: "quality.html", label: "Quality" },
    { href: "partner.html", label: "Manufacturing Partner" },
    { href: "resources.html", label: "Resources" },
    { href: "about.html", label: "About" },
    { href: "contact.html", label: "Contact" },
  ],
  megaMenu: {
    summary:
      "Navigate by product category, commercial workflow, or buyer use case.",
    columns: [
      {
        title: "Product Categories",
        links: [
          {
            href: "products.html?category=Botanical%20Extracts",
            label: "Botanical Extracts",
          },
          {
            href: "products.html?category=Nutraceutical%20Ingredients",
            label: "Nutraceutical Ingredients",
          },
          {
            href: "products.html?category=Cosmetic%20Ingredients",
            label: "Cosmetic Ingredients",
          },
          {
            href: "products.html?category=Fruit%20%26%20Vegetable%20Powders",
            label: "Fruit & Vegetable Powders",
          },
        ],
      },
      {
        title: "Commercial Actions",
        links: [
          { href: "contact.html#inquiry-form", label: "Request Quote" },
          { href: "contact.html#inquiry-form", label: "Request Sample" },
          {
            href: "quality.html#document-request",
            label: "Ask for COA / TDS / SDS",
          },
          { href: "warehouse.html", label: "Review U.S. warehousing path" },
        ],
      },
      {
        title: "Buyer Support",
        links: [
          { href: "applications.html", label: "Applications by industry" },
          { href: "quality.html", label: "Quality & documents" },
          { href: "partner.html", label: "Manufacturing partner profile" },
          { href: "resources.html", label: "Resources & FAQ" },
        ],
      },
    ],
  },
  homepage: {
    productLines: [
      "Botanical Extracts",
      "Nutraceutical Ingredients",
      "Cosmetic Ingredients",
      "Fruit & Vegetable Powders",
    ],
  },
  resources: [
    {
      type: "Guide",
      title: "How U.S. B2B Buyers Evaluate Botanical Ingredient Suppliers",
      url: "resources.html#guide-supplier-evaluation",
      summary:
        "A short commercial checklist covering specification, stock path, document readiness, and manufacturing support.",
    },
    {
      type: "Guide",
      title: "What to Ask Before Requesting a Sample",
      url: "resources.html#guide-sample-request",
      summary:
        "A practical framework for reducing back-and-forth before a sample or quote request.",
    },
    {
      type: "FAQ",
      title: "Document Path: COA, TDS, SDS, and Available by Inquiry",
      url: "quality.html#document-request",
      summary:
        "How to interpret the site’s documentation labels and stock tags.",
    },
  ],
  legalLinks: [
    { href: "privacy.html", label: "Privacy" },
    { href: "terms.html", label: "Terms" },
    { href: "cookies.html", label: "Cookies" },
    { href: "accessibility.html", label: "Accessibility" },
  ],
};
