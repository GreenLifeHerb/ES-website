#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "../..");
const baseUrl = "https://essencesourceusa.com";
const assetVersion = "20260626-mobile-header";
const updatedDate = "2026-06-11";
const updatedLabel = "June 2026";

const tracks = [
  {
    slug: "market-notes.html",
    eyebrow: "Market Notes",
    title: "Botanical Ingredient Market Notes",
    description:
      "Market notes for U.S. botanical ingredient buyers reviewing supply paths, origin variables, seasonal planning, and sourcing risk before RFQ.",
    intro:
      "Market notes help procurement teams understand why two offers with the same ingredient name may not be commercially equivalent. They focus on raw material path, grade clarity, planning risk, and the buyer questions that should be resolved before price comparison.",
    image: "assets/img/optimized/photo-hero-botanical-1200.webp",
    imageFallback: "assets/img/optimized/photo-hero-botanical-1200.jpg",
    cards: [
      "black-garlic-extract-vs-garlic-extract-buyer-notes.html",
      "maca-extract-supply-application-notes.html",
      "elderberry-extract-sourcing-guide.html",
    ],
  },
  {
    slug: "technical-notes.html",
    eyebrow: "Technical Notes",
    title: "Botanical Extract Technical Notes",
    description:
      "Technical notes for comparing botanical extract specifications, active markers, assay language, solubility, carriers, testing, and application limits.",
    intro:
      "Technical notes turn specification text into buyer-readable data. They are written for sourcing, QA, product development, and brand teams that need to compare marker language, document paths, and application fit without relying on product names alone.",
    image: "assets/img/optimized/photo-quality-lab-1200.webp",
    imageFallback: "assets/img/optimized/photo-quality-lab-1200.jpg",
    cards: [
      "extract-ratio-vs-standardized-extract.html",
      "green-coffee-chlorogenic-acid-grades.html",
      "black-ginger-5-7-dimethoxyflavone-grades.html",
      "artichoke-cynarin-chlorogenic-acid-specs.html",
      "black-garlic-sac-specification-notes.html",
      "apple-polyphenol-70-specification-notes.html",
      "lions-mane-extract-specification-guide.html",
      "turkey-tail-beta-glucan-polysaccharide-notes.html",
      "grape-seed-extract-opc-specification-guide.html",
    ],
  },
  {
    slug: "buyer-guides.html",
    eyebrow: "Buyer Guides",
    title: "Buyer Guides: RFQ, COA/TDS and Samples",
    description:
      "Buyer guides and copy-ready templates for botanical ingredient RFQs, COA/TDS requests, sample review, application fit, and supplier qualification.",
    intro:
      "Buyer guides are practical procurement tools. They help teams prepare better first messages, compare supplier replies, connect COA/TDS review to sample timing, and avoid quote requests that are too vague to be useful.",
    image: "assets/img/optimized/photo-quality-lab-1200.webp",
    imageFallback: "assets/img/optimized/photo-quality-lab-1200.jpg",
    cards: [
      "compare-botanical-extract-suppliers-usa.html",
      "coa-vs-tds-botanical-extract-buyers.html",
      "coa-tds-request-email-template.html",
      "bulk-botanical-extract-rfq-template.html",
      "botanical-extract-sample-request-template.html",
      "green-coffee-bean-extract-buyer-guide.html",
      "saw-palmetto-extract-buyer-checklist.html",
      "coa-tds-request-checklist.html",
      "bulk-botanical-extract-rfq-checklist.html",
    ],
  },
];

const articles = [
  {
    slug: "extract-ratio-vs-standardized-extract.html",
    track: "technical-notes.html",
    type: "Technical Note",
    title: "Extract Ratio vs Standardized Extract Notes",
    description:
      "A B2B technical note explaining extract ratio vs standardized extract language, assay markers, COA/TDS review, supplier questions, and RFQ risk.",
    product: "Botanical Extracts",
    productUrl: "specification-extracts.html",
    image: "assets/img/optimized/photo-quality-lab-1200.webp",
    imageFallback: "assets/img/optimized/photo-quality-lab-1200.jpg",
    alt: "Botanical extract specification documents and lab samples for extract ratio review",
    summary:
      "Extract ratio and standardized extract are two different ways suppliers describe botanical ingredients, and buyers should not compare them as if they mean the same thing. An extract ratio such as 4:1 or 10:1 usually describes a relationship between starting plant material and finished extract, but it does not by itself confirm a level of active or marker compound. A standardized extract is usually positioned around a defined marker, assay language, or specification target. For procurement and QA teams, the practical question is not which term sounds stronger; it is whether the supplier can explain identity, marker language, method, carrier, COA/TDS path, sample relevance, and application fit before the quote is treated as comparable.",
    specs: [
      ["Extract ratio", "Ratio language can describe input-to-output concentration, but buyers should ask what plant part, extraction path, carrier, and document support sit behind the ratio."],
      ["Standardized extract", "Standardized language should name the target marker or specification, method language when available, and whether the COA/TDS can support that grade."],
      ["Assay marker", "A marker such as chlorogenic acids, withanolides, OPC, polysaccharides, or beta-glucans should be reviewed with method and application context, not only a percentage."],
      ["Comparable quote", "Two offers are comparable only when identity, grade type, application, document stage, sample path, MOQ, lead time, and destination are aligned."],
    ],
    application:
      "Ratio extracts may fit projects where the buyer mainly needs a broad botanical identity, traditional extract positioning, or a cost-sensitive formulation path. Standardized extracts may fit programs that need tighter marker language, QA comparison, label positioning, or repeatability expectations. Capsules and tablets often need cleaner COA review. Powders, beverages, gummies, and functional foods may also need taste, color, solubility, carrier, and processing discussion before the grade is accepted.",
    documents:
      "Ask for the TDS first to understand whether the supplier is describing a ratio extract, a standardized marker grade, or a custom specification. Then request the COA path that matches the review stage. A representative COA may help early screening, but a sample or lot review should clarify whether the document belongs to the actual material path being considered. Buyers should also ask whether the assay method, carrier, plant part, country of origin, microbiology, heavy metals, and residual solvent expectations can be discussed.",
    risks: [
      "Treating a high extract ratio as proof of higher active content.",
      "Comparing a ratio extract quote against a standardized extract quote without separating grade type.",
      "Ignoring carrier or excipient language when evaluating powder blends or clean-label requirements.",
      "Requesting a COA without explaining whether the buyer needs representative, sample, or lot-specific review.",
      "Using supplier marketing claims instead of COA/TDS language to define the specification.",
    ],
    questions: [
      "Is this quote for a ratio extract, standardized extract, or custom specification?",
      "Which plant part, carrier, assay marker, and method language apply to this grade?",
      "Can the TDS and COA path support the same material being quoted?",
      "Does the grade fit our application, dosage form, sensory limits, and QA review stage?",
      "What sample quantity, MOQ, lead time, packing, destination, and replenishment assumptions apply?",
    ],
    related: [
      ["specification-extracts.html", "Specification extracts"],
      ["quality.html", "Quality and document review path"],
      ["coa-tds-request-checklist.html", "COA/TDS request checklist"],
      ["compare-botanical-extract-suppliers-usa.html", "Supplier comparison buyer guide"],
    ],
    sources: [
      [
        "NIH ODS Botanical Background",
        "https://ods.od.nih.gov/factsheets/BotanicalBackground-Consumer/",
        "NIH ODS explains botanical identity, preparation, and standardization concepts that support the distinction between ratio language and marker-based specifications.",
      ],
      [
        "FDA CGMPs for food and dietary supplements",
        "https://www.fda.gov/food/guidance-regulation-food-and-dietary-supplements/current-good-manufacturing-practices-cgmps-food-and-dietary-supplements",
        "FDA CGMP context supports the article's emphasis on specifications, quality control, packaging, labeling, holding, and document review.",
      ],
      [
        "FDA label claims guidance",
        "https://www.fda.gov/food/labeling-nutrition/label-claims",
        "FDA claim categories help buyers avoid confusing ingredient specifications with finished-product label or health claims.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports the article's caution against relying on unsupported marketing language when comparing botanical extract offers.",
      ],
    ],
  },
  {
    slug: "green-coffee-chlorogenic-acid-grades.html",
    track: "technical-notes.html",
    type: "Technical Note",
    title: "Green Coffee Chlorogenic Acid Grades",
    description:
      "A B2B guide to green coffee bean extract chlorogenic acid grades, covering 10%-60% specs, decaffeinated options, solubility, COA/TDS, and RFQ risks.",
    product: "Green Coffee Bean Extract",
    productUrl: "product-green-coffee.html",
    image: "assets/img/optimized/photo-green-coffee-extract-1200.webp",
    imageFallback: "assets/img/optimized/photo-green-coffee-extract-1200.jpg",
    alt: "Green coffee bean extract powder and beans for chlorogenic acid grade review",
    summary:
      "Green coffee bean extract is often compared by chlorogenic acid percentage, but a grade such as 10%, 45%, 50%, or 60% does not tell the whole sourcing story. Buyers also need to confirm assay language, caffeine or decaffeinated expectations, solubility, carrier, sensory impact, sample path, COA/TDS support, and intended application. For supplement capsules, a higher chlorogenic acid grade may be useful when label positioning and dosage size matter. For beverages or powder blends, water-soluble behavior, taste, color, and processing fit can be more important than headline percentage alone.",
    specs: [
      ["10%-20% chlorogenic acids", "Often reviewed when buyers need broader green coffee identity, cost-sensitive positioning, or blend compatibility rather than a high-marker claim."],
      ["45%-50% chlorogenic acids", "Commonly reviewed for supplement programs where marker clarity, capsule dosage, and COA/TDS comparison are important."],
      ["60% chlorogenic acids", "May support higher-marker positioning, but buyers should confirm method language, caffeine expectations, carrier, and sample relevance before assuming commercial fit."],
      ["Water-soluble or decaffeinated", "Beverage and powder applications should ask whether the grade is designed for solubility, sensory expectations, and caffeine constraints."],
    ],
    application:
      "Capsules and tablets usually prioritize chlorogenic acid percentage, assay language, COA review, and dosage economics. Functional beverages, drink mixes, gummies, and powders need additional review around solubility, taste, color, carrier, and caffeine expectations. Personal-care or cosmetic applications may need a different technical conversation around appearance, compatibility, and claim language. The right green coffee bean extract grade is the one that fits the finished product format, not only the one with the highest marker percentage.",
    documents:
      "Ask for the TDS to confirm the grade name, chlorogenic acid target, assay language, caffeine or decaffeinated positioning, solubility notes, carrier, storage, and application fit. Request the COA when a sample, lot, or first purchase path is being reviewed. A useful COA/TDS request should state the target chlorogenic acid grade, intended application, sample quantity, destination, expected order range, and whether the buyer needs water-soluble, decaffeinated, or clean-label discussion.",
    risks: [
      "Comparing chlorogenic acid percentages without checking assay method language.",
      "Choosing the highest marker grade before confirming dosage form, solubility, caffeine expectations, and sensory impact.",
      "Treating a representative COA as if it confirms a future commercial lot.",
      "Requesting a beverage sample before confirming whether the grade is water-soluble or sensory-appropriate.",
      "Ignoring carrier and packing details when the finished product has clean-label or processing constraints.",
    ],
    questions: [
      "Which chlorogenic acid grades are realistic for this application and order size?",
      "Is the material decaffeinated, water-soluble, carrier-free, or carrier-supported?",
      "Which assay method and specification limits appear on the COA or TDS?",
      "Is the available COA representative, sample-specific, or tied to a lot path?",
      "What sample quantity, MOQ, lead time, packing, and destination assumptions apply?",
    ],
    related: [
      ["product-green-coffee.html", "Green Coffee Bean Extract product page"],
      ["green-coffee-bean-extract-buyer-guide.html", "Green Coffee Bean Extract buyer guide"],
      ["functional-beverage-botanical-ingredients.html", "Functional beverage ingredient path"],
      ["coa-vs-tds-botanical-extract-buyers.html", "COA vs TDS buyer guide"],
    ],
    sources: [
      [
        "Coffee chlorogenic acids review in PMC",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC9181911/",
        "This review discusses chlorogenic acids from green coffee, supporting the article's focus on CGA identity and grade language without making finished-product claims.",
      ],
      [
        "PubMed green coffee bean extract meta-analysis",
        "https://pubmed.ncbi.nlm.nih.gov/37710316/",
        "PubMed indexing provides research context for green coffee bean extract and chlorogenic acid dosage language; buyers should still keep sourcing review separate from label claims.",
      ],
      [
        "FDA dietary supplement labeling guide",
        "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-industry-dietary-supplement-labeling-guide",
        "FDA labeling guidance supports careful separation between ingredient specification language and finished-product dietary supplement labeling decisions.",
      ],
      [
        "FDA label claims for foods and dietary supplements",
        "https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/label-claims-conventional-foods-and-dietary-supplements",
        "FDA claim categories help buyers avoid turning green coffee extract specification language into unsupported health, nutrient, or structure/function claims.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports cautious review of advertising and health-related claims when green coffee extract is used in finished products.",
      ],
    ],
  },
  {
    slug: "black-ginger-5-7-dimethoxyflavone-grades.html",
    track: "technical-notes.html",
    type: "Technical Note",
    title: "Black Ginger 5,7-Dimethoxyflavone Grades",
    description:
      "A B2B guide to black ginger extract grades, covering Kaempferia parviflora identity, 5,7-dimethoxyflavone specs, HPLC, COA/TDS, and RFQ risks.",
    product: "Black Ginger Extract",
    productUrl: "product-black-ginger.html",
    image: "assets/img/optimized/photo-black-ginger-extract-1200.webp",
    imageFallback: "assets/img/optimized/photo-black-ginger-extract-1200.jpg",
    alt: "Black ginger extract powder and rhizome material for 5,7-dimethoxyflavone grade review",
    summary:
      "Black ginger extract sourcing should begin with identity and marker clarity, not only with a price request. The botanical identity should be Kaempferia parviflora Wall. ex Baker, the plant part is typically rhizome, and commercial grades are often discussed through polymethoxyflavone or 5,7-dimethoxyflavone specification language. A buyer comparing 1%, 2.5%, or 5% 5,7-dimethoxyflavone should also ask about HPLC method language, carrier, appearance, sample relevance, COA/TDS path, and whether the proposed grade fits the finished product format.",
    specs: [
      ["Botanical identity", "Confirm Kaempferia parviflora identity, rhizome source, and whether the supplier can support identity and grade language in the document path."],
      ["5,7-Dimethoxyflavone 1%", "Often reviewed when buyers need a more accessible standardized grade for capsules, powders, or early formulation screening."],
      ["5,7-Dimethoxyflavone 2.5%", "A middle specification point that may support stronger marker positioning while keeping sample, MOQ, and application fit realistic."],
      ["5,7-Dimethoxyflavone 5%", "A higher-marker grade that should be reviewed carefully for HPLC method language, carrier, price, sample availability, and commercial lead time."],
      ["Polymethoxyflavones", "Some supplier documents may use broader polymethoxyflavone language; buyers should clarify how this relates to the named 5,7-dimethoxyflavone target."],
    ],
    application:
      "Black ginger extract is usually reviewed for capsules, tablets, stick packs, powder blends, and premium active-lifestyle supplement concepts. Capsules may prioritize assay clarity, COA review, and dose economics. Powders and stick packs should also review color, taste, carrier, dispersibility, and sensory impact. If the project involves functional food, beverage, or personal-care positioning, the buyer should ask whether the proposed grade is appropriate before treating the sample as formulation-ready.",
    documents:
      "Ask for the TDS first to confirm botanical identity, plant part, 5,7-dimethoxyflavone or polymethoxyflavone target, HPLC method language, carrier, appearance, storage, and application fit. Request the COA when a sample, lot, or first purchase path is being reviewed. A useful document request should state target marker level, dosage form, sample quantity, destination, expected order range, and whether the buyer needs carrier-free, specific packing, or clean-label discussion.",
    risks: [
      "Comparing 5,7-dimethoxyflavone percentages without checking HPLC method language.",
      "Treating polymethoxyflavone language as identical to a named 5,7-dimethoxyflavone specification.",
      "Requesting a quote before confirming rhizome identity, carrier, sample stage, and document path.",
      "Assuming a high-marker grade is the best fit before checking formulation format and sensory constraints.",
      "Using supplier marketing language instead of COA/TDS data to define the grade.",
    ],
    questions: [
      "Is the quoted material Kaempferia parviflora rhizome extract?",
      "Is the specification stated as 5,7-dimethoxyflavone, total polymethoxyflavones, or both?",
      "Which HPLC method language and specification limits appear on the COA or TDS?",
      "Is the COA representative, sample-specific, or tied to a lot path?",
      "What sample quantity, MOQ, lead time, packing, carrier, and destination assumptions apply?",
    ],
    related: [
      ["product-black-ginger.html", "Black Ginger Extract product page"],
      ["black-ginger-extract-supplier-guide.html", "Black Ginger Extract supplier guide"],
      ["supplement-botanical-ingredients.html", "Supplement ingredient sourcing"],
      ["coa-vs-tds-botanical-extract-buyers.html", "COA vs TDS buyer guide"],
    ],
    sources: [
      [
        "Kaempferia parviflora quality evaluation in PMC",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC10414684/",
        "This article discusses quality evaluation of Kaempferia parviflora products and supports the need for identity, marker, and method review.",
      ],
      [
        "Kaempferia parviflora methoxyflavones review in PMC",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC6273923/",
        "This review provides background on methoxyflavones in Kaempferia parviflora, supporting specification discussion without turning the article into a claims page.",
      ],
      [
        "FDA dietary supplement labeling guide",
        "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-industry-dietary-supplement-labeling-guide",
        "FDA labeling guidance supports careful separation between ingredient specification language and finished-product dietary supplement labeling decisions.",
      ],
      [
        "FDA label claims for foods and dietary supplements",
        "https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/label-claims-conventional-foods-and-dietary-supplements",
        "FDA claim categories help buyers avoid turning black ginger extract specification language into unsupported health, nutrient, or structure/function claims.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports cautious review of advertising and health-related claims when black ginger extract is used in finished products.",
      ],
    ],
  },
  {
    slug: "artichoke-cynarin-chlorogenic-acid-specs.html",
    track: "technical-notes.html",
    type: "Technical Note",
    title: "Artichoke Cynarin and Chlorogenic Acid Specs",
    description:
      "A B2B guide to artichoke extract specs covering Cynara scolymus identity, cynarin 2.5%-5%, chlorogenic acid options, HPLC, COA/TDS, and RFQ risks.",
    product: "Artichoke Extract",
    productUrl: "product-artichoke.html",
    image: "assets/img/optimized/product-artichoke-1200.webp",
    imageFallback: "assets/img/optimized/product-artichoke-1200.jpg",
    alt: "Artichoke extract powder and botanical material for cynarin specification review",
    summary:
      "Artichoke extract sourcing should begin with botanical identity, plant part, marker language, and document path. Buyers comparing artichoke offers should confirm Cynara scolymus L. identity, whether the material is leaf-based, whether the specification is stated as cynarin 2.5%-5% by HPLC or chlorogenic acid by inquiry, and whether the COA/TDS can support the same grade being quoted. The best commercial choice is not always the highest marker percentage. Supplement capsules, powder blends, and food formulation projects may each require different review around carrier, color, taste, particle behavior, contaminant limits, and sample relevance.",
    specs: [
      ["Botanical identity", "Confirm Cynara scolymus L. identity, leaf source when relevant, and whether the supplier can support identity in the technical document path."],
      ["Cynarin 2.5% HPLC", "Often reviewed when a buyer needs standardized artichoke positioning with a practical commercial path and clear COA/TDS support."],
      ["Cynarin 5% HPLC", "A stronger marker-positioned grade that should be reviewed for method language, price, sample availability, carrier, and lead time."],
      ["Chlorogenic acid by inquiry", "Some projects may discuss chlorogenic acid positioning; buyers should clarify whether this is the target spec or supporting marker context."],
      ["Application fit", "Capsules may prioritize assay clarity, while food and powder formats also need sensory, color, dispersibility, and carrier review."],
    ],
    application:
      "Artichoke extract is usually screened for dietary supplements, botanical blends, and selected food formulation concepts. Capsules and tablets typically focus on botanical identity, cynarin or chlorogenic acid language, HPLC method context, and COA review. Powder blends, stick packs, and food-oriented formulas should also review taste, color, flow, particle size, carrier, and processing conditions before treating a sample as formulation-ready. If the finished product will make any consumer-facing positioning around digestion, wellness, liver support, detox, or metabolic language, the brand should separate ingredient specification from finished-product claim review and consult its own compliance team.",
    documents:
      "Ask for the TDS first to confirm botanical name, plant part, target marker, method language, physical profile, carrier, storage, and intended application. Request the COA when a sample, lot, or first purchase path is specific enough for QA review. A useful artichoke extract document request should state whether the buyer needs cynarin 2.5%, cynarin 5%, chlorogenic acid discussion, carrier-free review, food or supplement application, sample quantity, destination, expected order range, and any internal limits for microbiology, heavy metals, residual solvents, pesticides, or allergens.",
    risks: [
      "Comparing artichoke extract offers without separating cynarin and chlorogenic acid specification language.",
      "Assuming a higher marker percentage is better before checking application fit, sample availability, and lead time.",
      "Requesting a COA without stating whether the buyer needs representative, sample-specific, or lot-specific review.",
      "Ignoring carrier, color, taste, and powder handling when the finished product is a blend, stick pack, or food format.",
      "Turning ingredient specification language into finished-product health claims without regulatory review.",
    ],
    questions: [
      "Is the quoted material Cynara scolymus L. leaf extract?",
      "Is the target specification cynarin 2.5%, cynarin 5%, chlorogenic acid, or another custom grade?",
      "Which HPLC method language and specification limits appear on the TDS or COA?",
      "Is the COA representative, sample-specific, or tied to a lot path?",
      "What sample quantity, MOQ, lead time, packing, carrier, and destination assumptions apply?",
    ],
    related: [
      ["product-artichoke.html", "Artichoke Extract product page"],
      ["supplement-botanical-ingredients.html", "Supplement botanical ingredients"],
      ["functional-beverage-botanical-ingredients.html", "Functional beverage ingredient path"],
      ["coa-vs-tds-botanical-extract-buyers.html", "COA vs TDS buyer guide"],
    ],
    sources: [
      [
        "Cynara scolymus phytochemistry review in PMC",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC6528422/",
        "This peer-reviewed review discusses Cynara scolymus phytochemicals and supports careful review of cynarin, chlorogenic acid, and botanical identity language.",
      ],
      [
        "NIH ODS Botanical Background",
        "https://ods.od.nih.gov/factsheets/BotanicalBackground-Consumer/",
        "NIH ODS explains botanical identity and standardization concepts relevant to artichoke extract specification comparison.",
      ],
      [
        "FDA dietary supplement labeling guide",
        "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-industry-dietary-supplement-labeling-guide",
        "FDA labeling guidance supports separating ingredient specification language from finished-product dietary supplement labeling decisions.",
      ],
      [
        "FDA label claims for foods and dietary supplements",
        "https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/label-claims-conventional-foods-and-dietary-supplements",
        "FDA claim categories help buyers avoid turning artichoke extract specification language into unsupported health, nutrient, or structure/function claims.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports cautious review of advertising and health-related claims for finished products containing botanical ingredients.",
      ],
    ],
  },
  {
    slug: "black-garlic-sac-specification-notes.html",
    track: "technical-notes.html",
    type: "Technical Note",
    title: "Black Garlic SAC Specification Notes",
    description:
      "A B2B guide to black garlic extract SAC specs covering aged garlic identity, SAC 0.1%-1.0%, sensory fit, COA/TDS review, and RFQ risks.",
    product: "Black Garlic Extract",
    productUrl: "product-black-garlic.html",
    image: "assets/img/optimized/brand-niorgar-1200.webp",
    imageFallback: "assets/img/optimized/brand-niorgar-1200.jpg",
    alt: "Black garlic extract powder with aged garlic bulbs for SAC specification review",
    summary:
      "Black garlic extract buyers should treat SAC specification language as a sourcing question, not only as a marketing phrase. A useful review starts with Allium sativum L. identity, aged black garlic positioning, SAC target, assay language, odor and color expectations, COA/TDS availability, and whether the proposed grade fits the finished product. SAC 0.1%, 0.5%, and 1.0% grades may serve different commercial needs. A supplement capsule may prioritize marker clarity and dosage economics, while a functional food or powder blend may need stronger review around sensory impact, color, carrier, and process compatibility.",
    specs: [
      ["Aged black garlic identity", "Confirm Allium sativum L. bulb source, aged black garlic positioning, and whether the supplier can explain how this differs from conventional garlic extract."],
      ["SAC 0.1%", "Often reviewed for accessible aged black garlic positioning where sensory profile, cost, and broad application fit may matter."],
      ["SAC 0.5%", "A middle specification point that can support stronger marker positioning while keeping sample and MOQ discussion realistic."],
      ["SAC 1.0%", "A higher-marker option that should be reviewed carefully for assay method, price, sample availability, carrier, and commercial lead time."],
      ["Sensory and format fit", "Odor, color, taste, carrier, and powder handling should be reviewed before using the grade in gummies, beverages, powders, or food formats."],
    ],
    application:
      "Black garlic extract is commonly reviewed for supplement capsules, tablets, powder blends, functional foods, and premium aged-garlic product concepts. Capsules and tablets usually put more weight on SAC specification, COA review, dosage economics, and contaminant testing. Powder blends, drink mixes, gummies, and food applications need additional discussion around odor, sweetness, roasted notes, color contribution, carrier, and whether the sensory profile supports the finished product. Buyers should also clarify whether they need a black garlic story for brand positioning or a conventional garlic extract path for a different technical purpose.",
    documents:
      "Ask for the TDS first to confirm product identity, SAC target, assay language, appearance, odor, carrier, storage, suggested applications, and handling notes. Request the COA when a sample, lot, or first purchase path is being reviewed. A strong black garlic extract document request should name the intended SAC grade, finished product format, sample quantity, destination, expected order range, clean-label constraints, and whether QA needs microbiology, heavy metals, residual solvent, pesticide, allergen, or country-of-origin discussion.",
    risks: [
      "Comparing black garlic extract and conventional garlic extract as if they are the same sourcing item.",
      "Requesting SAC 1.0% before confirming sample availability, MOQ, sensory fit, and commercial lead time.",
      "Ignoring odor, taste, and color when the application is a powder, gummy, beverage, or functional food.",
      "Treating a representative COA as proof of a future lot without confirming the material path.",
      "Using aged garlic or black garlic marketing language as a substitute for COA/TDS review.",
    ],
    questions: [
      "Is this aged black garlic extract from Allium sativum L. bulb material?",
      "Which SAC grade is available for the application: 0.1%, 0.5%, 1.0%, or custom inquiry?",
      "What assay method language and specification limits appear on the COA or TDS?",
      "How should odor, color, taste, carrier, and powder handling be evaluated for this format?",
      "What sample quantity, MOQ, lead time, packing, and destination assumptions apply?",
    ],
    related: [
      ["product-black-garlic.html", "Black Garlic Extract product page"],
      ["black-garlic-extract-vs-garlic-extract-buyer-notes.html", "Black Garlic vs Garlic buyer notes"],
      ["supplement-botanical-ingredients.html", "Supplement botanical ingredients"],
      ["bulk-botanical-extract-rfq-checklist.html", "Bulk RFQ checklist"],
    ],
    sources: [
      [
        "Black garlic review in PMC",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC6678835/",
        "This review discusses black garlic composition and processing context, supporting the article's focus on aged garlic identity and technical review.",
      ],
      [
        "Aged garlic and S-allyl cysteine review in PMC",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC6271412/",
        "This peer-reviewed source provides background on aged garlic preparations and S-allyl cysteine, supporting SAC-focused specification review.",
      ],
      [
        "FDA dietary supplement labeling guide",
        "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-industry-dietary-supplement-labeling-guide",
        "FDA labeling guidance supports careful separation between ingredient specification and finished-product supplement labeling decisions.",
      ],
      [
        "FDA label claims for foods and dietary supplements",
        "https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/label-claims-conventional-foods-and-dietary-supplements",
        "FDA claim categories help buyers keep black garlic ingredient language separate from unsupported health, nutrient, or structure/function claims.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports cautious review of advertising and health-related claims for finished products using black garlic extract.",
      ],
    ],
  },
  {
    slug: "apple-polyphenol-70-specification-notes.html",
    track: "technical-notes.html",
    type: "Technical Note",
    title: "Apple Polyphenol 70% Specification Notes",
    description:
      "A B2B guide to apple polyphenol extract specs covering apple-derived identity, 70% polyphenols, procyanidin context, COA/TDS, and RFQ risks.",
    product: "Apple Polyphenol Extract",
    productUrl: "products.html#apple-polyphenol-extract",
    image: "assets/img/optimized/brand-purapple-1200.webp",
    imageFallback: "assets/img/optimized/brand-purapple-1200.jpg",
    alt: "Apple polyphenol extract powder with apple slices for 70 percent specification review",
    summary:
      "Apple polyphenol extract sourcing should not stop at the phrase polyphenol 70%. Buyers need to confirm apple-derived identity, assay language, marker context, carrier, color, taste, solubility expectations, COA/TDS support, and application fit. Apple polyphenols may include a mixture of phenolic compounds such as procyanidins, chlorogenic acid, catechins, and related apple phenolics, but supplier documents can describe grades differently. For B2B procurement, the practical question is whether the supplier can explain the grade, route the right documents, and help the buyer decide whether the powder fits capsules, tablets, beverages, gummies, functional foods, or cosmetic concepts.",
    specs: [
      ["Apple-derived identity", "Confirm the material is positioned as apple-derived polyphenol extract and ask what raw material, carrier, and country-of-origin language can be discussed."],
      ["Polyphenol 70%", "Review the headline polyphenol value with assay method language, specification limits, and whether the COA/TDS supports the same grade."],
      ["Phenolic context", "Ask whether procyanidin, chlorogenic acid, catechin, or broader apple phenolic language is relevant to the grade being quoted."],
      ["Formulation-ready powder", "Review color, taste, odor, solubility, carrier, particle behavior, and processing tolerance before assuming application fit."],
      ["Document path", "Clarify whether available documents are representative, sample-specific, or lot-specific before QA treats them as approval evidence."],
    ],
    application:
      "Apple polyphenol extract can be reviewed for dietary supplements, powder blends, functional beverages, gummies, food formulations, and personal-care concepts. Capsules and tablets may focus on polyphenol percentage, COA review, carrier, and dose economics. Beverages and drink mixes need additional attention to solubility, astringency, color, sediment, pH interaction, and flavor system. Gummies and food formats should review heat, acidity, texture, and color impact. Cosmetic or personal-care projects may require a different technical and compliance review from ingestible applications.",
    documents:
      "Ask for the TDS first to confirm product name, source identity, polyphenol target, method language, appearance, carrier, storage, solubility notes, and suggested applications. Request the COA when a sample, lot, or first purchase path is being reviewed. A useful RFQ should name the target grade, application format, sensory constraints, sample quantity, destination, expected order range, packing needs, and internal QA limits for microbiology, heavy metals, residual solvents, pesticides, allergens, or country-of-origin review.",
    risks: [
      "Comparing apple polyphenol offers by percentage alone without checking method language and document path.",
      "Assuming a 70% powder is beverage-ready before testing solubility, astringency, color, and sediment behavior.",
      "Ignoring carrier or excipient language when the finished product has clean-label requirements.",
      "Using a representative COA as final approval evidence without confirming sample or lot connection.",
      "Turning antioxidant or polyphenol language into finished-product claims without compliance review.",
    ],
    questions: [
      "Is the material apple-derived polyphenol extract, and what source identity can be documented?",
      "How is the 70% polyphenol specification measured and stated on the COA/TDS?",
      "Are procyanidin, chlorogenic acid, catechin, or other phenolic markers relevant to this grade?",
      "Does the powder fit capsules, tablets, beverages, gummies, food, or personal-care applications?",
      "What sample quantity, MOQ, lead time, carrier, packing, and destination assumptions apply?",
    ],
    related: [
      ["products.html#apple-polyphenol-extract", "Apple Polyphenol Extract product card"],
      ["functional-beverage-botanical-ingredients.html", "Functional beverage ingredient path"],
      ["cosmetic-botanical-ingredients.html", "Cosmetic botanical ingredients"],
      ["coa-tds-request-checklist.html", "COA/TDS request checklist"],
    ],
    sources: [
      [
        "Apple polyphenols review in PMC",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC442131/",
        "This peer-reviewed review discusses apple polyphenol composition and supports the article's focus on apple-derived phenolic context.",
      ],
      [
        "Dietary polyphenols review in PMC",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC3257627/",
        "This review provides broader polyphenol background, supporting cautious interpretation of polyphenol specification language.",
      ],
      [
        "FDA dietary supplement labeling guide",
        "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-industry-dietary-supplement-labeling-guide",
        "FDA labeling guidance supports careful separation between ingredient specification language and finished-product labeling decisions.",
      ],
      [
        "FDA label claims for foods and dietary supplements",
        "https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/label-claims-conventional-foods-and-dietary-supplements",
        "FDA claim categories help buyers avoid turning apple polyphenol specification language into unsupported health, nutrient, or structure/function claims.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports cautious review of advertising and health-related claims when polyphenol ingredients are used in finished products.",
      ],
    ],
  },
  {
    slug: "compare-botanical-extract-suppliers-usa.html",
    track: "buyer-guides.html",
    type: "Buyer Guide",
    title: "Compare Botanical Extract Suppliers in USA",
    description:
      "A practical B2B guide for comparing U.S. botanical extract suppliers by specification clarity, COA/TDS path, samples, warehouse support, and RFQ fit.",
    product: "Botanical Extracts",
    productUrl: "products.html",
    image: "assets/img/optimized/photo-quality-lab-1200.webp",
    imageFallback: "assets/img/optimized/photo-quality-lab-1200.jpg",
    alt: "Botanical extract samples and quality documents prepared for U.S. supplier comparison",
    summary:
      "Comparing botanical extract suppliers in the U.S. should start with specification clarity, document path, application fit, sample process, and commercial follow-through. A lower price is not meaningful if the quote does not define the grade, assay language, sample route, MOQ, lead time, packing assumptions, and COA/TDS availability. For supplement brands, contract manufacturers, functional beverage teams, and ingredient distributors, the best supplier comparison is a structured review of how each company helps procurement and QA make the same decision from the same facts.",
    specs: [
      ["Specification clarity", "Confirm botanical name, plant part when relevant, extract ratio or active-marker language, assay method, carrier, and intended application."],
      ["Document path", "Ask when COA/TDS can be reviewed, whether files are representative or tied to a material path, and which QA attributes can be discussed."],
      ["Commercial fit", "Compare sample timing, MOQ, lead time, replenishment planning, destination, packing, and whether U.S. warehouse support applies."],
    ],
    application:
      "Supplier comparison should be tied to the buyer's finished product format. Capsules and tablets may prioritize assay language and COA review. Powder blends need carrier, color, taste, and handling context. Functional beverages require solubility and sensory discussion before a sample is treated as formulation-ready. Cosmetic or personal-care projects may need a different document and compliance conversation from a supplement RFQ.",
    documents:
      "Request the TDS during early screening and a COA path when a sample, lot, or first purchase is being reviewed. A useful document request should state the product name, target specification, application, review stage, destination, expected quantity, and any internal QA limits. Do not treat a generic sample document as a final lot document unless the supplier clearly explains the connection.",
    risks: [
      "Comparing suppliers by price before confirming that the same grade is being quoted.",
      "Assuming a representative COA confirms a future lot or shipment path.",
      "Sending a vague RFQ without application, quantity, destination, or document requirements.",
      "Ignoring sample, MOQ, lead time, and replenishment logic until after QA has started review.",
    ],
    questions: [
      "Which exact grade are you quoting, and how is the specification defined?",
      "Can you route TDS and COA support for the review stage we are in?",
      "What sample quantity, MOQ, lead time, packing, and replenishment assumptions apply?",
      "Does this grade fit our application, or should we review an alternate specification?",
    ],
    related: [
      ["botanical-extract-supplier-usa.html", "Botanical extract supplier USA overview"],
      ["quality.html", "Quality and document review path"],
      ["warehouse.html", "US warehouse and sample support"],
      ["bulk-botanical-extract-rfq-checklist.html", "Bulk RFQ checklist"],
    ],
    sources: [
      [
        "FDA CGMPs for food and dietary supplements",
        "https://www.fda.gov/food/guidance-regulation-food-and-dietary-supplements/current-good-manufacturing-practices-cgmps-food-and-dietary-supplements",
        "FDA lists dietary supplement CGMPs under 21 CFR Part 111, which is relevant when buyers ask how a supplier handles quality, packaging, labeling, holding, and document expectations.",
      ],
      [
        "FDA dietary supplement label claims guidance",
        "https://www.fda.gov/food/labeling-nutrition/label-claims",
        "FDA separates health claims, nutrient content claims, and structure/function claims; buyers should avoid supplier language that drifts into unsupported finished-product claims.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance emphasizes truthful, non-misleading advertising and competent, reliable scientific evidence for objective health-related claims.",
      ],
      [
        "NIH Office of Dietary Supplements botanical background",
        "https://ods.od.nih.gov/factsheets/BotanicalBackground-Consumer/",
        "NIH ODS explains botanical identity and standardization basics, supporting the article's focus on botanical name, plant part, and specification language.",
      ],
    ],
  },
  {
    slug: "coa-vs-tds-botanical-extract-buyers.html",
    track: "buyer-guides.html",
    type: "Buyer Guide",
    title: "COA vs TDS for Botanical Extract Buyers",
    description:
      "A B2B guide explaining COA vs TDS documents for botanical extract buyers, including what each file should answer, RFQ timing, and QA review risks.",
    product: "Botanical Extracts",
    productUrl: "quality.html",
    image: "assets/img/optimized/photo-quality-lab-1200.webp",
    imageFallback: "assets/img/optimized/photo-quality-lab-1200.jpg",
    alt: "COA and TDS document review for botanical extract sourcing",
    summary:
      "A Certificate of Analysis and a Technical Data Sheet answer different buyer questions, so they should not be requested or reviewed as if they are interchangeable. A TDS usually helps procurement and product development understand the product identity, specification range, application fit, handling notes, and basic technical profile before a buyer commits to sampling or pricing. A COA is more lot-oriented: it should help QA review whether a specific sample, batch, or shipment path matches agreed specification limits. For botanical extract buyers, the practical sequence is usually TDS first for screening, then COA review when a sample, lot, or first purchase path is being evaluated.",
    specs: [
      ["TDS purpose", "Use the TDS to understand product identity, botanical or material name, target grade, physical profile, application fit, storage notes, and general specification language."],
      ["COA purpose", "Use the COA to review analytical results, lot or batch context, method language when available, date, specification limits, and whether the material path matches the buyer's review stage."],
      ["Representative vs lot-specific", "A representative COA can support early screening, but buyers should not treat it as proof of a future shipment unless the supplier clarifies the connection."],
      ["Best request timing", "Ask for TDS during initial supplier comparison and request COA support when a sample, material path, or first purchase is specific enough for QA review."],
    ],
    application:
      "COA and TDS expectations change with the finished product format. Supplement capsules may need tighter marker, contaminant, microbiology, and identity review. Beverage and gummy projects may need sensory, solubility, carrier, and processing notes in the TDS before a sample makes sense. Cosmetic and personal-care projects may need a different document path tied to intended use, formulation restrictions, and internal compliance review. The buyer should name the application before asking whether the document package is sufficient.",
    documents:
      "A strong COA/TDS request should identify the product, target grade, application, sample stage, expected quantity, destination, and internal QA concerns. Ask whether the TDS describes the same grade being quoted, whether the COA is representative, sample-specific, or lot-specific, and whether the supplier can clarify assay method, carrier, plant part, country of origin, microbiology, heavy metals, residual solvent, allergen, and storage expectations when relevant.",
    risks: [
      "Requesting only a COA when the team first needs a TDS to understand whether the grade is appropriate.",
      "Treating a representative COA as if it confirms the exact future lot or shipment.",
      "Comparing suppliers when one file describes a different grade, marker, carrier, or material path.",
      "Sending COA/TDS requests without product application, sample stage, quantity, or destination.",
      "Using document availability as a substitute for QA review of method language and specification limits.",
    ],
    questions: [
      "Is this TDS for the same grade, marker, carrier, and application being quoted?",
      "Is the COA representative, sample-specific, or tied to a lot or batch path?",
      "Which assay method, specification limits, and contaminant tests can be discussed?",
      "Can COA/TDS support be routed before sample review or first purchase approval?",
      "What information does the supplier still need to provide a useful document package?",
    ],
    related: [
      ["quality.html", "Quality and document review path"],
      ["coa-tds-request-checklist.html", "COA/TDS request checklist"],
      ["bulk-botanical-extract-rfq-checklist.html", "Bulk RFQ checklist"],
      ["compare-botanical-extract-suppliers-usa.html", "Supplier comparison buyer guide"],
    ],
    sources: [
      [
        "FDA Small Entity Compliance Guide for dietary supplement CGMP",
        "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/small-entity-compliance-guide-current-good-manufacturing-practice-manufacturing-packaging-labeling",
        "FDA guidance explains dietary supplement CGMP expectations, including quality control operations and specification context relevant to document review.",
      ],
      [
        "21 CFR Part 111",
        "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-111",
        "The eCFR text provides the regulatory structure for dietary supplement current good manufacturing practice, including quality and specification responsibilities.",
      ],
      [
        "21 CFR 111.70 specifications",
        "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-111/subpart-E/section-111.70",
        "This eCFR section supports the article's emphasis on established specifications when buyers evaluate COA and TDS language.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports careful separation between technical documents and unsupported health-product marketing claims.",
      ],
    ],
  },
  {
    slug: "coa-tds-request-email-template.html",
    track: "buyer-guides.html",
    type: "Buyer Template",
    title: "COA/TDS Request Email Template",
    description:
      "Copy-ready COA/TDS request email template for botanical extract buyers, covering representative COA, lot COA, TDS, specs, samples, and QA context.",
    product: "Botanical Extracts",
    productUrl: "quality.html",
    image: "assets/img/optimized/photo-quality-lab-1200.webp",
    imageFallback: "assets/img/optimized/photo-quality-lab-1200.jpg",
    alt: "COA and TDS request template for botanical ingredient buyers",
    summary:
      "A good COA/TDS request email should tell the supplier what document is needed, which product or grade is under review, and whether the buyer is screening, sampling, qualifying a supplier, or preparing a first purchase. Many delays happen because buyers ask for a COA without explaining whether a representative COA, sample-specific COA, or lot-specific COA is required. This template helps procurement, QA, and product development teams request the right technical files for botanical extracts, mushroom extracts, fruit powders, and other botanical ingredients without turning the first message into a vague document request.",
    specs: [
      ["Representative COA", "Use for early screening when the buyer wants to understand typical test categories, specification limits, and document format before sampling."],
      ["Sample COA", "Use when QA is reviewing the material connected to a specific sample path or formulation test."],
      ["Lot-specific COA", "Use when a purchase order, shipment, or supplier qualification step requires the document tied to a defined batch or lot."],
      ["TDS", "Use to understand product identity, target specification, physical profile, carrier, storage, handling, and application fit before deeper QA review."],
      ["Request context", "State product, grade, application, review stage, destination, and internal QA limits so the supplier can route useful files."],
    ],
    application:
      "This template works for supplement brands, contract manufacturers, functional beverage teams, food formulation groups, personal-care developers, and distributors comparing botanical ingredient suppliers. It is most useful when the buyer needs COA/TDS files before sample approval, supplier qualification, or first commercial order planning.",
    documents:
      "Ask for the TDS first when the product or grade still needs screening. Ask for a representative COA when QA wants to preview analytical categories. Ask for a sample-specific or lot-specific COA only when the material path is specific enough to support that request. If the team has internal limits for microbiology, heavy metals, residual solvents, pesticides, allergens, or country-of-origin review, include those details in the first message.",
    risks: [
      "Requesting a lot-specific COA before a lot or shipment path exists.",
      "Using a representative COA as final approval evidence for a future shipment.",
      "Leaving out target specification, application, or review stage.",
      "Asking for documents without naming internal QA limits or test priorities.",
      "Treating document availability as a substitute for QA review of method language and limits.",
    ],
    questions: [
      "Is the buyer asking for a TDS, representative COA, sample COA, or lot-specific COA?",
      "Which product name, grade, active marker, extract ratio, or carrier should the document match?",
      "Is the request for screening, sample approval, supplier onboarding, or first purchase review?",
      "Which microbiology, heavy metals, residual solvent, pesticide, allergen, or origin questions matter?",
      "Should the supplier also clarify sample availability, MOQ, lead time, and packing?",
    ],
    related: [
      ["quality.html", "Quality and document review path"],
      ["coa-vs-tds-botanical-extract-buyers.html", "COA vs TDS buyer guide"],
      ["coa-tds-request-checklist.html", "COA/TDS request checklist"],
      ["contact.html?inquiry_type=docs#contact-form", "Request COA/TDS from Essence Source"],
    ],
    templates: [
      {
        title: "COA/TDS request email",
        text: `Subject: COA/TDS request for [product name] [target grade]\n\nHello,\n\nWe are reviewing [product name] for a [capsule/tablet/gummy/powder/beverage/food/cosmetic] project and would like to request available technical documents.\n\nProduct / grade: [product name, botanical name if known, target active marker or ratio]\nApplication: [finished product format]\nReview stage: [early screening / sample approval / supplier qualification / first PO review]\nDocuments requested: [TDS / representative COA / sample COA / lot-specific COA]\nQA priorities: [microbiology, heavy metals, residual solvents, pesticides, allergens, country of origin, method language]\nExpected quantity: [sample quantity and estimated first order if known]\nDestination: [city, state, country]\nTiming: [target review date or launch window]\n\nPlease confirm whether the documents match the quoted grade and whether the COA is representative, sample-specific, or lot-specific.\n\nThank you,\n[Name]\n[Company]\n[Work email]\n[Phone]`,
      },
      {
        title: "Short document request",
        text: `Subject: Document request - [product name]\n\nHello,\n\nCan you share the available TDS and representative COA for [product name] [target specification]?\n\nWe are reviewing it for [application] and need to confirm [active marker / extract ratio / carrier / method language / QA limits] before deciding whether to request a sample.\n\nPlease also confirm sample availability, MOQ, lead time, and whether the COA is representative or tied to a specific lot.\n\nBest,\n[Name]`,
      },
    ],
    sources: [
      ["21 CFR Part 111", "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-111", "The eCFR text provides the dietary supplement CGMP structure relevant to specifications and quality control review."],
      ["21 CFR 111.70 specifications", "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-111/subpart-E/section-111.70", "This section supports the template's emphasis on established specifications before document approval."],
      ["FDA dietary supplement labeling guide", "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-industry-dietary-supplement-labeling-guide", "FDA guidance helps buyers keep technical document review separate from finished-product labeling decisions."],
      ["FTC Health Products Compliance Guidance", "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance", "FTC guidance supports avoiding unsupported health-product claims in supplier and finished-product language."],
    ],
  },
  {
    slug: "bulk-botanical-extract-rfq-template.html",
    track: "buyer-guides.html",
    type: "Buyer Template",
    title: "Bulk Botanical Extract RFQ Template",
    description:
      "Copy-ready bulk botanical extract RFQ template for U.S. buyers requesting price, MOQ, lead time, packing, COA/TDS, samples, and specification support.",
    product: "Bulk Botanical Extracts",
    productUrl: "bulk-botanical-extracts.html",
    image: "assets/img/optimized/photo-hero-botanical-1200.webp",
    imageFallback: "assets/img/optimized/photo-hero-botanical-1200.jpg",
    alt: "Bulk botanical extract RFQ template for procurement teams",
    summary:
      "A bulk botanical extract RFQ is strongest when it separates technical specification from commercial assumptions. A supplier cannot quote responsibly from the ingredient name alone. Buyers should include product name, botanical identity, target grade, active marker or ratio, application, sample need, estimated quantity, destination, packing preference, document requirements, and timing. This RFQ template helps procurement teams get fewer vague replies and more useful answers about price, MOQ, lead time, COA/TDS path, sample availability, and whether U.S. warehouse support is relevant.",
    specs: [
      ["Product identity", "Name the ingredient, botanical name if known, plant part, extract form, active marker, extract ratio, or custom grade."],
      ["Application", "State whether the material is for capsules, tablets, gummies, powders, beverages, foods, cosmetics, or another format."],
      ["Commercial quantity", "Separate sample quantity, pilot quantity, first order estimate, and repeat or annual forecast when known."],
      ["Delivery and packing", "Include destination, packing preference, target timing, and whether U.S. warehouse support is useful."],
      ["Documents", "Request TDS, representative COA, sample COA, lot COA, or testing file context according to the review stage."],
    ],
    application:
      "Use this template for procurement teams, supplement brands, distributors, contract manufacturers, beverage developers, food formulation teams, and personal-care buyers who need a supplier to answer price and technical questions in the same first reply.",
    documents:
      "A good RFQ should state whether documents are needed before pricing, before sampling, before QA approval, or before purchase order release. If the buyer only needs early screening, a TDS and representative COA may be enough. If the buyer is preparing a PO, the supplier should clarify whether lot-specific documents can be routed for the actual material path.",
    risks: [
      "Sending only an ingredient name and asking for best price.",
      "Comparing quotes before confirming the same grade and assay language.",
      "Leaving out destination, quantity, packing, and timeline.",
      "Asking for documents without explaining review stage.",
      "Treating sample availability as proof of commercial stock or repeat supply.",
    ],
    questions: [
      "Which exact grade and specification should suppliers quote?",
      "Is the request for sample, pilot, first PO, or repeat volume?",
      "What destination, packing, and target timing should suppliers use?",
      "Which documents are needed before the buyer can move forward?",
      "Should the supplier recommend an alternate grade if the target is unrealistic?",
    ],
    related: [
      ["bulk-botanical-extracts.html", "Bulk botanical extracts"],
      ["bulk-botanical-extract-rfq-checklist.html", "Bulk RFQ checklist"],
      ["compare-botanical-extract-suppliers-usa.html", "Compare botanical extract suppliers"],
      ["contact.html?inquiry_type=quote#contact-form", "Send RFQ to Essence Source"],
    ],
    templates: [
      {
        title: "Bulk RFQ email",
        text: `Subject: Bulk RFQ - [product name] [target specification]\n\nHello,\n\nWe are sourcing [product name] for a [supplement/beverage/food/cosmetic] project and would like pricing and availability for the following requirement.\n\nProduct: [product name]\nBotanical name / plant part: [if known]\nTarget specification: [active marker, extract ratio, assay method, carrier preference]\nApplication: [capsule/tablet/gummy/powder/beverage/food/cosmetic]\nSample needed: [yes/no, target quantity]\nFirst order estimate: [kg/lb/unit quantity]\nRepeat or annual forecast: [if known]\nDestination: [city, state, country]\nPacking preference: [drum, carton, bag, inner bag, other]\nDocuments needed: [TDS, representative COA, sample COA, lot COA, test reports]\nTarget timing: [sample date / PO date / launch window]\n\nPlease quote available grade options, MOQ, lead time, sample availability, packing, document path, and whether any U.S. warehouse support applies.\n\nBest,\n[Name]\n[Company]`,
      },
      {
        title: "RFQ comparison fields",
        text: `Supplier:\nProduct / grade quoted:\nActive marker or ratio:\nMethod language:\nCarrier / excipient:\nSample availability:\nMOQ:\nLead time:\nPrice basis:\nPacking:\nDestination assumption:\nCOA/TDS path:\nRepresentative or lot-specific documents:\nU.S. warehouse support:\nOpen questions:`,
      },
    ],
    sources: [
      ["FDA CGMPs for food and dietary supplements", "https://www.fda.gov/food/guidance-regulation-food-and-dietary-supplements/current-good-manufacturing-practices-cgmps-food-and-dietary-supplements", "FDA CGMP context supports the template's emphasis on specifications, packaging, holding, and quality review."],
      ["NIH ODS Botanical Background", "https://ods.od.nih.gov/factsheets/BotanicalBackground-Consumer/", "NIH ODS explains botanical identity and standardization concepts relevant to RFQ grade comparison."],
      ["FDA label claims guidance", "https://www.fda.gov/food/labeling-nutrition/label-claims", "FDA claim categories help buyers keep ingredient RFQs separate from unsupported finished-product claims."],
      ["FTC Health Products Compliance Guidance", "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance", "FTC guidance supports cautious supplier and brand language when ingredient claims are discussed."],
    ],
  },
  {
    slug: "botanical-extract-sample-request-template.html",
    track: "buyer-guides.html",
    type: "Buyer Template",
    title: "Botanical Extract Sample Request Template",
    description:
      "Copy-ready botanical extract sample request template for buyers reviewing specifications, COA/TDS, sample quantity, application fit, and first-order path.",
    product: "Botanical Extract Samples",
    productUrl: "contact.html?inquiry_type=sample#contact-form",
    image: "assets/img/optimized/photo-quality-lab-1200.webp",
    imageFallback: "assets/img/optimized/photo-quality-lab-1200.jpg",
    alt: "Botanical extract sample request template for B2B buyers",
    summary:
      "A botanical extract sample request should explain what the sample is expected to prove. Buyers often ask for samples too early, before confirming the grade, application format, document path, and internal approval criteria. A better sample request names the target specification, finished product format, sample quantity, sensory or handling questions, COA/TDS needs, destination, and expected next step after evaluation. This helps suppliers route the right material and helps the buyer avoid testing a sample that does not match the commercial path.",
    specs: [
      ["Sample purpose", "State whether the sample is for formulation, sensory review, QA screening, pilot production, supplier qualification, or customer presentation."],
      ["Specification match", "Confirm target marker, ratio, carrier, solubility, color, taste, particle size, and whether the sample matches the quoted grade."],
      ["Document support", "Request TDS and the right COA path so QA understands whether the sample represents a real commercial material path."],
      ["Evaluation criteria", "List what will decide pass or fail: assay, color, taste, solubility, handling, microbiology, contaminants, or blend behavior."],
      ["Next step", "Tell the supplier whether a successful sample could lead to first PO, additional testing, or a revised specification request."],
    ],
    application:
      "Use this template for samples of botanical extracts, mushroom extracts, fruit powders, beverage ingredients, supplement actives, cosmetic botanicals, and other plant-based raw materials. It is especially useful when product development and QA both need to review the same sample.",
    documents:
      "Ask for the TDS before or with the sample. Ask for a representative or sample-specific COA depending on the review stage. If the sample is only for formulation screening, a representative COA may be enough. If QA is approving the sample for a first purchase path, clarify whether the sample document connects to the actual material route.",
    risks: [
      "Requesting samples before confirming the intended grade.",
      "Testing a sample without knowing whether it matches commercial supply.",
      "Ignoring sensory, solubility, or handling limits until after the sample arrives.",
      "Failing to tell the supplier what the sample must prove.",
      "Using a sample COA as future lot approval without supplier confirmation.",
    ],
    questions: [
      "What is the sample supposed to prove?",
      "Does the sample match the quoted specification and commercial path?",
      "Which documents should arrive before or with the sample?",
      "What application and evaluation criteria should the supplier know?",
      "What first-order quantity or next step might follow a successful sample?",
    ],
    related: [
      ["contact.html?inquiry_type=sample#contact-form", "Request a sample"],
      ["warehouse.html", "US warehouse and sample support"],
      ["coa-tds-request-email-template.html", "COA/TDS request email template"],
      ["bulk-botanical-extract-rfq-template.html", "Bulk RFQ template"],
    ],
    templates: [
      {
        title: "Sample request email",
        text: `Subject: Sample request - [product name] [target grade]\n\nHello,\n\nWe are evaluating [product name] for a [capsule/tablet/gummy/powder/beverage/food/cosmetic] project and would like to request a sample for review.\n\nProduct / grade: [product name and target specification]\nApplication: [finished product format]\nSample purpose: [formulation / sensory / QA screening / pilot / supplier qualification]\nRequested sample quantity: [amount]\nDocuments requested: [TDS, representative COA, sample COA]\nEvaluation criteria: [assay, solubility, taste, color, odor, particle size, carrier, microbiology, heavy metals]\nDestination: [ship-to city, state, country]\nExpected next step: [first PO estimate, additional testing, formula review, customer approval]\nTarget timing: [date needed]\n\nPlease confirm sample availability, shipping path, whether the sample matches the quoted grade, and whether the documents are representative or sample-specific.\n\nThank you,\n[Name]\n[Company]`,
      },
      {
        title: "Sample review checklist",
        text: `Product received:\nSupplier:\nSample date:\nGrade / specification:\nCOA/TDS received:\nDocument type:\nApplication tested:\nAppearance:\nOdor / taste:\nSolubility / dispersibility:\nBlend or processing behavior:\nQA concerns:\nQuestions for supplier:\nDecision: pass / revise / reject / request commercial quote`,
      },
    ],
    sources: [
      ["FDA CGMPs for food and dietary supplements", "https://www.fda.gov/food/guidance-regulation-food-and-dietary-supplements/current-good-manufacturing-practices-cgmps-food-and-dietary-supplements", "FDA CGMP context supports connecting sample review with specifications, quality review, packaging, and holding expectations."],
      ["21 CFR 111.70 specifications", "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-111/subpart-E/section-111.70", "This eCFR section supports the emphasis on specifications before a sample is treated as approval evidence."],
      ["NIH ODS Botanical Background", "https://ods.od.nih.gov/factsheets/BotanicalBackground-Consumer/", "NIH ODS botanical background supports the need for identity, plant part, and standardization clarity."],
      ["FTC Health Products Compliance Guidance", "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance", "FTC guidance supports separating sample and supplier claims from finished-product advertising claims."],
    ],
  },
  {
    slug: "green-coffee-bean-extract-buyer-guide.html",
    track: "buyer-guides.html",
    type: "Buyer Guide",
    title: "Green Coffee Bean Extract Buyer Guide",
    description:
      "A B2B buyer guide for green coffee bean extract covering chlorogenic acid grades, application fit, COA/TDS review, sourcing risk, and RFQ questions.",
    product: "Green Coffee Bean Extract",
    productUrl: "product-green-coffee.html",
    image: "assets/img/optimized/photo-green-coffee-extract-1200.webp",
    imageFallback: "assets/img/optimized/photo-green-coffee-extract-1200.jpg",
    alt: "Green coffee bean extract powder and raw material prepared for buyer review",
    summary:
      "Green coffee bean extract sourcing usually starts with chlorogenic acid specification, but serious buyers should also compare decaffeination needs, solubility expectations, intended dosage form, sample path, and whether the document set is suitable for QA screening. A quote is only useful after the buyer knows whether the grade under review is meant for capsules, powder blends, functional beverages, or a broader product development program.",
    specs: [
      ["Marker language", "Chlorogenic acid grade, assay method language, and whether the supplier can clarify how the grade is positioned."],
      ["Format questions", "Decaffeinated expectations, water-soluble options by inquiry, appearance, taste impact, and carrier language."],
      ["Commercial path", "Sample quantity, MOQ, replenishment timing, destination, and whether U.S. warehouse support is relevant."],
    ],
    application:
      "Capsules and tablets usually emphasize marker clarity and documentation. Powder blends need handling and carrier review. Beverage programs should ask about solubility, sensory impact, and whether the proposed grade was selected with beverage development in mind.",
    documents:
      "Ask for the TDS during screening, then confirm COA availability for the material path under review. If the buyer is comparing multiple suppliers, the request should name the chlorogenic acid target, sample quantity, destination, and internal QA limits so the document reply is not generic.",
    risks: [
      "Comparing chlorogenic acid percentages without checking method language.",
      "Requesting a beverage quote before asking whether the grade is appropriate for beverage use.",
      "Treating a representative COA as if it confirms a specific future lot.",
    ],
    questions: [
      "Which chlorogenic acid grades are currently realistic for this application?",
      "Is a decaffeinated or water-soluble option needed for the program?",
      "Can COA/TDS be routed for the sample or RFQ stage?",
      "What MOQ and lead time apply to the grade under review?",
    ],
    related: [
      ["product-green-coffee.html", "Green Coffee Bean Extract product page"],
      ["functional-beverage-botanical-ingredients.html", "Functional beverage ingredient path"],
      ["coa-tds-request-checklist.html", "COA/TDS request checklist"],
    ],
    sources: [
      [
        "NIH ODS Botanical Background",
        "https://ods.od.nih.gov/factsheets/BotanicalBackground-Consumer/",
        "NIH ODS explains botanical identity and standardization basics, supporting buyer review of botanical name, plant part, and marker language.",
      ],
      [
        "NIH Dietary Supplement Label Database",
        "https://dsld.od.nih.gov/",
        "The NIH DSLD shows how dietary supplement labels present ingredients and standardized extract language, which helps buyers separate supplier specs from finished-label claims.",
      ],
      [
        "FDA label claims guidance",
        "https://www.fda.gov/food/labeling-nutrition/label-claims",
        "FDA claim categories are relevant when green coffee bean extract buyers review supplier language for supplement or beverage projects.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports the article's caution against relying on unsupported marketing claims during ingredient sourcing.",
      ],
    ],
  },
  {
    slug: "black-garlic-extract-vs-garlic-extract-buyer-notes.html",
    track: "market-notes.html",
    type: "Market Note",
    title: "Black Garlic vs Garlic Extract Buyer Notes",
    description:
      "Buyer notes comparing black garlic extract and garlic extract for B2B sourcing teams reviewing SAC, odor, positioning, application fit, and documentation.",
    product: "Black Garlic Extract",
    productUrl: "product-black-garlic.html",
    image: "assets/img/optimized/brand-niorgar-1200.webp",
    imageFallback: "assets/img/optimized/brand-niorgar-1200.jpg",
    alt: "Black garlic extract powder and aged garlic material prepared for sourcing review",
    summary:
      "Black garlic extract and conventional garlic extract should not be treated as interchangeable line items. Buyers often review black garlic for aged-garlic positioning, smoother sensory expectations, SAC specification language, and premium product storytelling. Conventional garlic extract may be evaluated for a different odor profile, marker expectation, or cost target. The right sourcing path depends on the finished product concept, documentation needs, and whether the brand story requires aged black garlic identity.",
    specs: [
      ["Identity", "Confirm whether the request is for aged black garlic extract, conventional garlic extract, or a custom garlic-derived material."],
      ["Marker focus", "Ask about SAC specification language, testing path, and whether the grade is intended for supplement or food use."],
      ["Sensory fit", "Review odor, color, taste impact, and handling expectations before sampling."],
    ],
    application:
      "Black garlic extract can fit premium capsules, powder blends, functional food concepts, and wellness positioning where aged garlic identity matters. If the application is strongly sensory-sensitive, buyers should discuss odor and color expectations before assuming a grade will fit.",
    documents:
      "Document requests should name whether QA is reviewing black garlic identity, SAC level, microbiology, heavy metals, or food-oriented handling information. TDS review is useful before sampling; COA review should align with the sample or lot path.",
    risks: [
      "Using garlic extract pricing to judge black garlic extract without comparing identity and processing expectations.",
      "Asking for SAC without clarifying whether the supplier can support the requested grade.",
      "Ignoring sensory impact until after a sample has been routed internally.",
    ],
    questions: [
      "Is the project specifically requesting aged black garlic identity?",
      "Which SAC grades can be discussed for this application?",
      "What odor, color, or taste expectations should product development review?",
      "Can the supplier clarify sample path, COA/TDS availability, MOQ, and lead time together?",
    ],
    related: [
      ["product-black-garlic.html", "Black Garlic Extract product page"],
      ["products.html", "Full product catalog for garlic-related and botanical extract review"],
      ["supplement-botanical-ingredients.html", "Supplement ingredient sourcing"],
    ],
    sources: [
      [
        "NIH ODS Botanical Background",
        "https://ods.od.nih.gov/factsheets/BotanicalBackground-Consumer/",
        "NIH ODS background supports the article's focus on botanical identity and standardization rather than treating related garlic ingredients as interchangeable.",
      ],
      [
        "FDA label claims guidance",
        "https://www.fda.gov/food/labeling-nutrition/label-claims",
        "FDA claim categories help buyers keep aged garlic positioning separate from finished-product disease or health claims.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance reinforces the need for truthful, supportable claims when suppliers describe premium garlic ingredients.",
      ],
    ],
  },
  {
    slug: "elderberry-extract-sourcing-guide.html",
    track: "market-notes.html",
    type: "Sourcing Guide",
    title: "Elderberry Extract Sourcing Guide",
    description:
      "A sourcing guide for elderberry extract buyers comparing specification, color, application fit, COA/TDS needs, seasonal planning, and supplier questions.",
    product: "Elderberry Extract",
    productUrl: "product-elderberry-extract.html",
    image: "assets/img/optimized/photo-hero-botanical-1200.webp",
    imageFallback: "assets/img/optimized/photo-hero-botanical-1200.jpg",
    alt: "Botanical extract sample prepared for elderberry extract sourcing review",
    summary:
      "Elderberry extract is often reviewed by buyers working on seasonal wellness, gummies, capsules, powders, and functional beverage concepts. A strong sourcing request should go beyond the ingredient name and clarify specification language, color expectations, carrier or excipient preferences, sensory limits, and whether the team needs a document-first or sample-first path. This matters because elderberry projects can be driven by formulation appearance as much as by the specification line.",
    specs: [
      ["Specification", "Ask how the grade is described, whether marker language is available, and whether the specification fits the intended product format."],
      ["Appearance", "Discuss color, odor, taste, and blend impact before assuming a sample will match a finished product concept."],
      ["Supply planning", "Confirm sample route, replenishment logic, MOQ, and whether timing is sensitive to seasonal launches."],
    ],
    application:
      "Capsules may prioritize documentation and active-language clarity. Gummies, beverage powders, and functional food concepts should also evaluate color and sensory impact. If the finished product has strict appearance expectations, the buyer should state those expectations in the first inquiry.",
    documents:
      "A TDS can help product development screen form and specification. A COA can support sample or lot review. Buyers should also clarify whether they need allergen, microbiology, heavy metals, or other QA attributes in the first response.",
    risks: [
      "Comparing elderberry offers without naming the target product format.",
      "Waiting until after sample arrival to discuss color or sensory expectations.",
      "Assuming seasonal demand does not affect planning lead time.",
    ],
    questions: [
      "Which elderberry grade best fits capsules, gummies, powders, or beverages?",
      "What color and taste expectations should be reviewed before sampling?",
      "Can the supplier support COA/TDS routing for the review stage?",
      "What lead time and MOQ apply to the target grade?",
    ],
    related: [
      ["product-elderberry-extract.html", "Elderberry Extract product page"],
      ["functional-beverage-botanical-ingredients.html", "Beverage ingredient sourcing"],
      ["bulk-botanical-extract-rfq-checklist.html", "Bulk RFQ checklist"],
    ],
    sources: [
      [
        "NIH ODS immune function fact sheet",
        "https://ods.od.nih.gov/factsheets/ImmuneFunction/",
        "NIH ODS includes elderberry in its immune-function supplement discussion, which helps buyers avoid overreaching claims while reviewing seasonal-wellness ingredients.",
      ],
      [
        "NIH ODS Botanical Background",
        "https://ods.od.nih.gov/factsheets/BotanicalBackground-Consumer/",
        "NIH ODS botanical background supports the need to clarify botanical identity, form, and standardization language.",
      ],
      [
        "FDA label claims guidance",
        "https://www.fda.gov/food/labeling-nutrition/label-claims",
        "FDA label-claim categories are relevant for elderberry projects that may involve supplement, food, or functional beverage positioning.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports cautious review of supplier and brand language around immune-related marketing claims.",
      ],
    ],
  },
  {
    slug: "lions-mane-extract-specification-guide.html",
    track: "technical-notes.html",
    type: "Technical Note",
    title: "Lion's Mane Extract Specification Guide",
    description:
      "Specification guide for Lion's Mane extract buyers comparing mushroom identity, polysaccharide language, beta-glucan questions, documents, and RFQ fit.",
    product: "Lion's Mane Extract",
    productUrl: "product-lions-mane-extract.html",
    image: "assets/img/optimized/photo-hero-botanical-1200.webp",
    imageFallback: "assets/img/optimized/photo-hero-botanical-1200.jpg",
    alt: "Mushroom extract sample prepared for Lion's Mane extract specification review",
    summary:
      "Lion's Mane extract is a premium mushroom ingredient category, so buyers need clear specification language before comparing suppliers. A useful review should clarify species identity, part or material positioning if relevant, extraction ratio or marker language, polysaccharide and beta-glucan discussion, carrier expectations, and whether the supplier can support COA/TDS routing for the intended review stage.",
    specs: [
      ["Identity", "Confirm the mushroom species, product name, and whether the supplier can provide identity support in the document path."],
      ["Marker language", "Compare polysaccharide and beta-glucan language carefully; do not assume different terms mean the same analytical basis."],
      ["Format", "Review powder handling, carrier, solubility expectations, and capsule or powder blend fit."],
    ],
    application:
      "Lion's Mane is often screened for capsules, powder blends, stick packs, and premium mushroom blends. Supplement teams usually need document clarity first, while product teams may also care about appearance, taste, and blend behavior.",
    documents:
      "Ask for TDS and available COA path tied to the review stage. If QA is comparing mushroom extracts, the request should name identity expectations, target specification language, microbiology limits, heavy metals review, and whether beta-glucan discussion is required.",
    risks: [
      "Comparing polysaccharide numbers without understanding method language.",
      "Assuming beta-glucan and polysaccharide claims are directly comparable across suppliers.",
      "Skipping carrier and handling review for powder blend applications.",
    ],
    questions: [
      "How is the Lion's Mane extract grade specified?",
      "Can the supplier explain polysaccharide and beta-glucan language?",
      "Which documents are available for screening and sample review?",
      "What sample quantity, MOQ, and lead time apply?",
    ],
    related: [
      ["product-lions-mane-extract.html", "Lion's Mane Extract product page"],
      ["natural-mushrooms.html", "Natural mushroom ingredients"],
      ["turkey-tail-beta-glucan-polysaccharide-notes.html", "Turkey Tail beta-glucan notes"],
    ],
    sources: [
      [
        "NIH Dietary Supplement Label Database",
        "https://dsld.od.nih.gov/ingredient/Lion%E2%80%99s%2BMane%2BExtract",
        "NIH DSLD ingredient records show how Lion's Mane extract appears in supplement-label contexts, supporting buyer review of identity and label language.",
      ],
      [
        "Medicinal mushrooms review in PMC",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC10384337/",
        "This peer-reviewed review discusses medicinal mushroom bioactive components and functional food applications, useful for polysaccharide and beta-glucan sourcing context.",
      ],
      [
        "FDA label claims guidance",
        "https://www.fda.gov/food/labeling-nutrition/label-claims",
        "FDA claim categories help buyers keep mushroom ingredient specification review separate from unsupported finished-product claims.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports the article's caution around cognitive or wellness marketing statements tied to mushroom extracts.",
      ],
    ],
  },
  {
    slug: "turkey-tail-beta-glucan-polysaccharide-notes.html",
    track: "technical-notes.html",
    type: "Technical Note",
    title: "Turkey Tail Beta-Glucan Notes",
    description:
      "Technical notes for Turkey Tail mushroom extract buyers reviewing beta-glucan, polysaccharide, extract ratio, COA/TDS, and supplier questions.",
    product: "Turkey Tail Mushroom Extract",
    productUrl: "product-turkey-tail-mushroom-extract.html",
    image: "assets/img/optimized/photo-hero-botanical-1200.webp",
    imageFallback: "assets/img/optimized/photo-hero-botanical-1200.jpg",
    alt: "Mushroom extract sample prepared for Turkey Tail extract technical review",
    summary:
      "Turkey Tail extract sourcing often becomes confusing when buyers compare polysaccharide language, beta-glucan language, and extract ratio language as if they are the same thing. They are not always comparable. A better review starts by asking how the grade is specified, which analytical language appears on the COA or TDS, and whether the supplier can explain the relationship between mushroom identity, extraction path, and the buyer's finished product format.",
    specs: [
      ["Polysaccharide language", "Clarify whether the term is used as a broad specification and how the value is measured."],
      ["Beta-glucan discussion", "Ask whether beta-glucan language is available and whether method details can be discussed for QA review."],
      ["Extract ratio", "Do not treat extract ratio alone as an active marker; it describes processing concentration, not necessarily assay value."],
    ],
    application:
      "Turkey Tail can be reviewed for capsules, mushroom blends, powder blends, and wellness-positioned supplement programs. Application fit depends on powder handling, taste, color, and whether the target claims language can be supported without overreaching.",
    documents:
      "Buyers should ask for the TDS first when comparing specification structure, then request COA routing when a sample or lot path is being reviewed. QA teams should state whether they are checking identity, microbiology, heavy metals, beta-glucan, polysaccharide, or extract ratio language.",
    risks: [
      "Treating polysaccharide and beta-glucan values as interchangeable.",
      "Using extract ratio as the only quality comparison point.",
      "Not asking how the document path supports the stated specification.",
    ],
    questions: [
      "Which specification language is used on the TDS and COA?",
      "Can beta-glucan or polysaccharide method language be discussed?",
      "Is the grade intended for capsules, blends, or another format?",
      "What sample and MOQ path applies to the grade?",
    ],
    related: [
      ["product-turkey-tail-mushroom-extract.html", "Turkey Tail Mushroom Extract product page"],
      ["product-lions-mane-extract.html", "Lion's Mane Extract product page"],
      ["natural-mushrooms.html", "Natural mushroom ingredients"],
    ],
    sources: [
      [
        "Medicinal mushrooms review in PMC",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC10384337/",
        "This peer-reviewed review discusses mushroom bioactive components including polysaccharides and beta-glucans, supporting the article's technical comparison framework.",
      ],
      [
        "NIH Dietary Supplement Label Database",
        "https://dsld.od.nih.gov/",
        "The NIH DSLD helps buyers understand how mushroom ingredients and extract language can appear in supplement-label contexts.",
      ],
      [
        "FDA label claims guidance",
        "https://www.fda.gov/food/labeling-nutrition/label-claims",
        "FDA claim categories are relevant when Turkey Tail extract is reviewed for supplement positioning.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports avoiding unsupported disease or immune-related marketing language in supplier and brand materials.",
      ],
    ],
  },
  {
    slug: "saw-palmetto-extract-buyer-checklist.html",
    track: "buyer-guides.html",
    type: "Buyer Checklist",
    title: "Saw Palmetto Extract Buyer Checklist",
    description:
      "A buyer checklist for saw palmetto extract procurement covering ratio extracts, specification language, application fit, documents, samples, and RFQ questions.",
    product: "Saw Palmetto Extract",
    productUrl: "product-saw-palmetto-extract.html",
    image: "assets/img/optimized/photo-hero-botanical-1200.webp",
    imageFallback: "assets/img/optimized/photo-hero-botanical-1200.jpg",
    alt: "Botanical extract sample prepared for saw palmetto extract buyer checklist",
    summary:
      "Saw palmetto extract sourcing requires more care than a simple price request. Buyers should clarify whether they are reviewing a ratio extract or a standardized active-marker grade, what application the material is intended for, whether the supplier can support the correct document path, and which commercial assumptions drive MOQ and lead time. The first inquiry should be structured enough for procurement and QA to review the same material path.",
    specs: [
      ["Grade type", "Confirm whether the project requires ratio language, active-marker language, or a custom specification discussion."],
      ["Application", "State whether the finished product is a capsule, tablet, powder blend, or other supplement format."],
      ["Documents", "Ask what COA/TDS path is available for screening, sample review, and first purchase planning."],
    ],
    application:
      "Saw palmetto is commonly reviewed for supplement programs. Buyers should be clear about target dosage form, label positioning, internal specification, and whether the formulation team has constraints around carrier, particle handling, or blend compatibility.",
    documents:
      "Request TDS for initial comparison and COA routing when a sample or material path is selected. If QA has internal limits, list them early so the supplier can address the actual review criteria instead of sending generic files.",
    risks: [
      "Comparing ratio extract and standardized extract offers without separating grade type.",
      "Leaving out the intended dosage form until after the quote is prepared.",
      "Requesting documents without explaining the review stage.",
    ],
    questions: [
      "Which grade type best fits the program?",
      "What sample size and MOQ apply to the grade?",
      "Can the supplier support COA/TDS review before the first PO?",
      "What lead time and packing assumptions should procurement use?",
    ],
    related: [
      ["product-saw-palmetto-extract.html", "Saw Palmetto Extract product page"],
      ["supplement-botanical-ingredients.html", "Supplement botanical ingredients"],
      ["bulk-botanical-extract-rfq-checklist.html", "Bulk RFQ checklist"],
    ],
    sources: [
      [
        "NCCIH Saw Palmetto",
        "https://www.nccih.nih.gov/health/saw-palmetto",
        "NCCIH provides a government health-information overview for saw palmetto, useful for keeping ingredient sourcing language separate from unsupported finished-product claims.",
      ],
      [
        "NIH ODS Botanical Background",
        "https://ods.od.nih.gov/factsheets/BotanicalBackground-Consumer/",
        "NIH ODS botanical background supports the article's focus on identity, plant material, and standardization language.",
      ],
      [
        "FDA label claims guidance",
        "https://www.fda.gov/food/labeling-nutrition/label-claims",
        "FDA claim categories are relevant when saw palmetto extract is reviewed for supplement positioning.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports cautious review of marketing language in men's-health supplement ingredient projects.",
      ],
    ],
  },
  {
    slug: "grape-seed-extract-opc-specification-guide.html",
    track: "technical-notes.html",
    type: "Specification Guide",
    title: "Grape Seed Extract OPC Specification Guide",
    description:
      "Specification guide for grape seed extract buyers comparing OPC language, polyphenol positioning, COA/TDS review, application fit, and RFQ questions.",
    product: "Grape Seed Extract",
    productUrl: "product-grape-seed-extract.html",
    image: "assets/img/optimized/photo-hero-botanical-1200.webp",
    imageFallback: "assets/img/optimized/photo-hero-botanical-1200.jpg",
    alt: "Botanical extract powder prepared for grape seed extract OPC specification review",
    summary:
      "Grape seed extract is often compared by OPC language, polyphenol positioning, and supplement-grade expectations. Buyers should not rely on a single headline percentage without asking how the grade is specified, which method language appears on documents, and whether the supplier can route COA/TDS files for the review stage. Application context also matters because capsules, tablets, powder blends, and functional foods may prioritize different handling details.",
    specs: [
      ["OPC language", "Ask whether OPC is the target specification and how the supplier communicates method language."],
      ["Polyphenol positioning", "Clarify whether polyphenol language is part of the grade comparison or only supporting context."],
      ["Handling", "Review color, taste, carrier, and powder behavior for the intended dosage form."],
    ],
    application:
      "Capsules and tablets may focus on specification and COA clarity. Powder blends and food-oriented applications should consider color and taste impact. Buyers should state whether they need a clean supplement path, a food formulation path, or a custom specification discussion.",
    documents:
      "A useful COA/TDS request should name OPC or polyphenol expectations, sample stage, application, and internal QA limits. If multiple grades are under comparison, ask the supplier to explain which document belongs to which grade.",
    risks: [
      "Comparing OPC values without checking analytical method language.",
      "Ignoring color and taste impact in powder or food applications.",
      "Requesting a quote before deciding which grade is being evaluated.",
    ],
    questions: [
      "Which OPC or polyphenol grade is realistic for the project?",
      "What method language can be shared for QA comparison?",
      "Can COA/TDS be routed for the exact grade under review?",
      "What application details should be clarified before sampling?",
    ],
    related: [
      ["product-grape-seed-extract.html", "Grape Seed Extract product page"],
      ["specification-extracts.html", "Specification extracts"],
      ["coa-tds-request-checklist.html", "COA/TDS request checklist"],
    ],
    sources: [
      [
        "NCCIH Grape Seed Extract",
        "https://www.nccih.nih.gov/health/grape-seed-extract",
        "NCCIH provides a government health-information overview that helps buyers keep grape seed extract sourcing separate from unsupported health claims.",
      ],
      [
        "NIH ODS Botanical Background",
        "https://ods.od.nih.gov/factsheets/BotanicalBackground-Consumer/",
        "NIH ODS explains botanical standardization concepts relevant to OPC and polyphenol specification review.",
      ],
      [
        "FDA label claims guidance",
        "https://www.fda.gov/food/labeling-nutrition/label-claims",
        "FDA claim categories are relevant when buyers evaluate supplier language for grape seed extract supplement projects.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports the article's emphasis on evidence-backed, non-misleading claims.",
      ],
    ],
  },
  {
    slug: "maca-extract-supply-application-notes.html",
    track: "market-notes.html",
    type: "Application Note",
    title: "Maca Extract Supply and Application Notes",
    description:
      "Supply and application notes for maca extract buyers reviewing ratio extracts, capsule and powder formats, documents, sample path, and RFQ readiness.",
    product: "Maca Extract",
    productUrl: "product-maca-extract.html",
    image: "assets/img/optimized/photo-hero-botanical-1200.webp",
    imageFallback: "assets/img/optimized/photo-hero-botanical-1200.jpg",
    alt: "Botanical extract sample prepared for maca extract sourcing review",
    summary:
      "Maca extract is commercially familiar, but that does not make every offer comparable. Buyers should clarify whether they are reviewing a ratio extract, a custom grade, or a finished-product-oriented specification. Application context matters because capsules, powder blends, stick packs, and wellness formulations can have different expectations for taste, color, carrier, and document review.",
    specs: [
      ["Ratio language", "Confirm whether the grade is positioned by extract ratio, marker discussion, or custom specification."],
      ["Format fit", "Review taste, color, carrier, and powder handling before assuming the extract fits every blend."],
      ["Supply path", "Ask about sample timing, MOQ, replenishment planning, and whether U.S. warehouse discussion applies."],
    ],
    application:
      "Maca extract can be screened for capsules, powders, drink mixes, and wellness blends. Buyers should name the target format because formulation constraints affect the grade conversation, especially when flavor and powder behavior are important.",
    documents:
      "Request TDS for the product-level view and COA routing for sample or lot review. If the buyer is comparing ratio extracts, the request should state the desired ratio language and any internal QA limits.",
    risks: [
      "Assuming all maca extracts have the same sensory and handling profile.",
      "Comparing ratio language without asking what document support is available.",
      "Leaving destination, volume, and timing out of the RFQ.",
    ],
    questions: [
      "Which maca grade fits the intended finished product format?",
      "What sample quantity and MOQ apply to the grade?",
      "Can COA/TDS be routed for screening and sample review?",
      "What taste, color, or carrier expectations should be reviewed?",
    ],
    related: [
      ["product-maca-extract.html", "Maca Extract product page"],
      ["supplement-botanical-ingredients.html", "Supplement botanical ingredients"],
      ["bulk-botanical-extract-rfq-checklist.html", "Bulk RFQ checklist"],
    ],
    sources: [
      [
        "NIH Dietary Supplement Label Database",
        "https://dsld.od.nih.gov/",
        "The NIH DSLD helps buyers understand how maca and other botanical ingredients appear in supplement-label contexts.",
      ],
      [
        "NIH ODS Botanical Background",
        "https://ods.od.nih.gov/factsheets/BotanicalBackground-Consumer/",
        "NIH ODS botanical background supports the article's focus on identity, form, and standardization language.",
      ],
      [
        "FDA label claims guidance",
        "https://www.fda.gov/food/labeling-nutrition/label-claims",
        "FDA claim categories help buyers keep maca extract positioning separate from unsupported finished-product claims.",
      ],
      [
        "FTC Health Products Compliance Guidance",
        "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
        "FTC guidance supports cautious review of energy, wellness, or performance-oriented marketing language.",
      ],
    ],
  },
];

const articleBySlug = new Map(articles.map((article) => [article.slug, article]));

const supportingResources = new Map([
  [
    "coa-tds-request-checklist.html",
    {
      type: "Buyer Checklist",
      title: "COA/TDS Request Checklist",
      description:
        "Prepare cleaner document questions before sample review, supplier onboarding, or first purchase approval.",
      cta: "Open checklist",
    },
  ],
  [
    "bulk-botanical-extract-rfq-checklist.html",
    {
      type: "Buyer Checklist",
      title: "Bulk Botanical Extract RFQ Checklist",
      description:
        "Organize quantity, packing, destination, timeline, specification, sample, and document needs before asking for price.",
      cta: "Open checklist",
    },
  ],
]);

const quickAnswers = {
  "extract-ratio-vs-standardized-extract.html":
    "An extract ratio describes concentration language, while a standardized extract should identify a target marker or specification. Buyers should compare the TDS, COA path, marker method, carrier, and application fit before treating two quotes as equivalent.",
  "compare-botanical-extract-suppliers-usa.html":
    "A botanical extract supplier comparison should start with grade clarity, document path, sample timing, MOQ, lead time, destination, and warehouse relevance. Price is useful only after suppliers are quoting the same material path.",
  "coa-vs-tds-botanical-extract-buyers.html":
    "Use the TDS for early product screening and the COA for sample, batch, or lot-oriented QA review. A representative COA can help screening, but buyers should confirm whether it connects to the actual material path under review.",
  "coa-tds-request-email-template.html":
    "A COA/TDS request should name the product, target grade, application, review stage, document type, and QA priorities. Buyers should clarify whether they need a TDS, representative COA, sample COA, or lot-specific COA.",
  "bulk-botanical-extract-rfq-template.html":
    "A bulk botanical extract RFQ should include product identity, target specification, application, quantity, destination, packing, timing, sample needs, and COA/TDS requirements so suppliers can quote the right material path.",
  "botanical-extract-sample-request-template.html":
    "A botanical extract sample request should explain what the sample is expected to prove, which grade it should match, which documents are needed, and what commercial step may follow if the sample passes review.",
  "green-coffee-bean-extract-buyer-guide.html":
    "Green coffee bean extract buyers should compare chlorogenic acid grade, decaffeinated needs, solubility expectations, application format, and COA/TDS support together. A percentage alone does not define the right grade.",
  "green-coffee-chlorogenic-acid-grades.html":
    "Green coffee bean extract grades should be compared by chlorogenic acid percentage, assay method, caffeine or decaffeinated expectations, solubility, carrier, and application fit. A higher percentage is not automatically the right choice unless the COA/TDS supports the intended dosage form and review stage.",
  "black-ginger-5-7-dimethoxyflavone-grades.html":
    "Black ginger extract buyers should compare Kaempferia parviflora identity, rhizome source, 5,7-dimethoxyflavone or polymethoxyflavone specification, HPLC method language, carrier, and COA/TDS support before treating offers as equivalent.",
  "artichoke-cynarin-chlorogenic-acid-specs.html":
    "Artichoke extract buyers should compare Cynara scolymus identity, leaf source, cynarin 2.5%-5% or chlorogenic acid specification language, HPLC method context, carrier, and COA/TDS support before treating offers as equivalent.",
  "black-garlic-sac-specification-notes.html":
    "Black garlic extract buyers should compare aged black garlic identity, SAC 0.1%-1.0% grade language, assay method, sensory profile, carrier, and COA/TDS support before deciding whether an offer fits supplements, foods, or powders.",
  "apple-polyphenol-70-specification-notes.html":
    "Apple polyphenol extract buyers should review apple-derived identity, 70% polyphenol assay language, phenolic marker context, carrier, sensory behavior, solubility, and COA/TDS support before choosing a grade.",
  "black-garlic-extract-vs-garlic-extract-buyer-notes.html":
    "Black garlic extract and conventional garlic extract are not interchangeable sourcing items. Buyers should compare aged black garlic identity, SAC language, odor, color, application fit, and document support before comparing price.",
  "elderberry-extract-sourcing-guide.html":
    "Elderberry extract sourcing should connect grade language with color, taste, carrier, application format, seasonal planning, and COA/TDS needs. Gummies, beverages, capsules, and powders can require different review paths.",
  "lions-mane-extract-specification-guide.html":
    "Lion's Mane extract buyers should clarify species identity, material positioning, polysaccharide or beta-glucan language, carrier, and document path before comparing offers. Different marker terms are not automatically equivalent.",
  "turkey-tail-beta-glucan-polysaccharide-notes.html":
    "Turkey Tail polysaccharide, beta-glucan, and extract ratio language should be reviewed separately. Buyers should ask how each value is measured and whether the COA/TDS supports the exact grade under review.",
  "saw-palmetto-extract-buyer-checklist.html":
    "Saw palmetto extract buyers should separate ratio extract language from standardized active-marker language before requesting price. The first RFQ should name grade type, dosage form, COA/TDS needs, MOQ, lead time, and sample stage.",
  "grape-seed-extract-opc-specification-guide.html":
    "Grape seed extract buyers should compare OPC, polyphenol, and proanthocyanidin language with method context. A headline percentage is not enough unless the COA/TDS supports the same grade and application path.",
  "maca-extract-supply-application-notes.html":
    "Maca extract sourcing should define ratio language, sensory expectations, carrier, application format, sample route, and document support before price comparison. Powder blends and capsules may need different review details.",
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function absoluteUrl(slug) {
  return `${baseUrl}/${slug}`;
}

function getQuickAnswer(article) {
  return quickAnswers[article.slug] || article.summary.split(/(?<=\.)\s+/).slice(0, 2).join(" ");
}

function getCtaLabel(article) {
  if (article.productUrl === "quality.html") return "Review quality path";
  if (article.productUrl === "products.html") return "View product catalog";
  if (article.productUrl === "specification-extracts.html") return "View specification extracts";
  return "View product page";
}

function layout({ slug, title, description, ogType = "website", image, body, schemas }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)} | Essence Source</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${absoluteUrl(slug)}" />
    <link rel="alternate" hreflang="en" href="${absoluteUrl(slug)}" />
    <link rel="alternate" hreflang="x-default" href="${absoluteUrl(slug)}" />
    <meta property="og:site_name" content="Essence Source" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${escapeHtml(title)} | Essence Source" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${baseUrl}/${image}" />
    <meta property="og:url" content="${absoluteUrl(slug)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)} | Essence Source" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${baseUrl}/${image}" />
${schemas.map((schema) => `    <script type="application/ld+json">\n${JSON.stringify(schema, null, 6)}\n    </script>`).join("\n")}
    <link rel="stylesheet" href="assets/css/main.css" />
  </head>
  <body data-page="${slug}">
    <div class="site-shell">
      <div data-site-header></div>
      <main class="site-main" id="main-content">
${body}
        <div class="freshness-signal"><time datetime="${updatedDate}">Last Updated: ${updatedLabel}</time></div>
      </main>
      <div data-site-footer></div>
    </div>
    <script src="assets/data/site-content.js?v=${assetVersion}" defer></script>
    <script src="assets/js/main.js?v=${assetVersion}" defer></script>
    <script src="assets/js/nav.js" defer></script>
  </body>
</html>
`;
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function articleSchema(article) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    abstract: getQuickAnswer(article),
    datePublished: updatedDate,
    dateModified: updatedDate,
    author: { "@type": "Organization", name: "Essence Source" },
    publisher: { "@type": "Organization", name: "Essence Source", url: baseUrl },
    mainEntityOfPage: absoluteUrl(article.slug),
    about: { "@type": "Product", name: article.product, url: `${baseUrl}/${article.productUrl}` },
  };
  if (article.sources) {
    schema.citation = article.sources.map(([name, url]) => ({ "@type": "CreativeWork", name, url }));
  }
  return schema;
}

function answerForQuestion(article, question) {
  const normalized = question.toLowerCase();
  if (normalized.includes("coa") || normalized.includes("tds") || normalized.includes("document")) {
    return article.documents;
  }
  if (normalized.includes("application") || normalized.includes("fit") || normalized.includes("format")) {
    return article.application;
  }
  if (
    normalized.includes("sample") ||
    normalized.includes("moq") ||
    normalized.includes("lead time") ||
    normalized.includes("packing") ||
    normalized.includes("destination")
  ) {
    return `Buyers should confirm ${article.product} sample quantity, MOQ, lead time, packing, destination, replenishment expectations, and whether U.S. warehouse support is relevant before comparing offers.`;
  }
  if (
    normalized.includes("grade") ||
    normalized.includes("specification") ||
    normalized.includes("marker") ||
    normalized.includes("method") ||
    normalized.includes("ratio")
  ) {
    return article.specs.map(([label, value]) => `${label}: ${value}`).join(" ");
  }
  return getQuickAnswer(article);
}

function faqSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.questions.slice(0, 3).map((question) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answerForQuestion(article, question),
      },
    })),
  };
}

function collectionSchema(track) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: track.title,
    description: track.description,
    url: absoluteUrl(track.slug),
    publisher: { "@type": "Organization", name: "Essence Source", url: baseUrl },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: track.cards.map((slug, index) => {
        const item = articleBySlug.get(slug);
        const resource = supportingResources.get(slug);
        return {
          "@type": "ListItem",
          position: index + 1,
          name: item ? item.title : resource ? resource.title : slug.replace(".html", ""),
          url: `${baseUrl}/${slug}`,
        };
      }),
    },
  };
}

function card(slug) {
  const item = articleBySlug.get(slug);
  if (!item) {
    const resource = supportingResources.get(slug);
    if (resource) {
      return `<article class="info-card">
                <small>${escapeHtml(resource.type)}</small>
                <h3>${escapeHtml(resource.title)}</h3>
                <p>${escapeHtml(resource.description)}</p>
                <a class="button button--secondary" href="${slug}">${escapeHtml(resource.cta)}</a>
              </article>`;
    }
    return `<article class="info-card"><h3>${escapeHtml(slug.replace(".html", ""))}</h3><p>Supporting buyer resource.</p><a class="button button--secondary" href="${slug}">Open resource</a></article>`;
  }
  return `<article class="info-card">
                <small>${escapeHtml(item.type)}</small>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.description)}</p>
                <a class="button button--secondary" href="${item.slug}">Open note</a>
              </article>`;
}

function categoryPage(track) {
  const body = `        <section class="page-hero">
          <div class="container split-panel split-panel--hero">
            <div class="section-heading stack">
              <div class="section-heading__eyebrow">${escapeHtml(track.eyebrow)}</div>
              <h1>${escapeHtml(track.title)}</h1>
              <p>${escapeHtml(track.intro)}</p>
              <div class="cluster">
                <a class="button button--primary" href="contact.html?inquiry_type=quote#contact-form">Request Quote</a>
                <a class="button button--secondary" href="insights.html">Back to Insights</a>
              </div>
            </div>
            <div class="image-frame image-frame--hero">
              <picture>
                <source type="image/webp" srcset="${track.image}" />
                <img src="${track.imageFallback}" alt="${escapeHtml(track.title)} for botanical ingredient buyer review" width="1200" height="675" loading="eager" fetchpriority="high" />
              </picture>
            </div>
          </div>
        </section>
        <section class="section">
          <div class="container">
            <div class="card-grid card-grid--3">
              ${track.cards.map(card).join("\n              ")}
            </div>
          </div>
        </section>
        <section class="section" style="padding-top: 0">
          <div class="container split-panel">
            <article class="info-card">
              <h2>How buyers should use this section</h2>
              <p class="lede">Use these notes before sending a supplier message, not after quotes have already become confusing. Each article is designed to help a procurement, QA, product development, or brand team define the ingredient name, target specification, intended application, sample stage, document need, estimated volume, and destination.</p>
              <p class="lede">That preparation makes supplier responses easier to compare because each offer is tied to the same commercial question. It also gives search engines and AI systems clearer context about how the page supports real B2B ingredient sourcing decisions.</p>
              <p class="lede">For new buyers, the safest path is to read one note, prepare one cleaner RFQ, and then compare supplier replies against the same set of technical and commercial questions.</p>
            </article>
            <article class="info-card">
              <h2>What makes the content useful</h2>
              <p class="lede">The goal is not to repeat catalog claims. The useful parts are the buyer questions, grade-comparison language, document timing, application constraints, and RFQ details that help a U.S. purchaser decide what to ask next.</p>
              <p class="lede">When new market notes or technical notes are added, they should follow the same pattern: buyer summary, common specification language, application fit, quality documents to request, sourcing risks, supplier questions, related products, and a clear COA/TDS or RFQ path.</p>
            </article>
          </div>
        </section>
        <section class="section" style="padding-top: 0">
          <div class="container">
            <div class="cta-banner">
              <h2>Turn research into a cleaner supplier conversation</h2>
              <p>Use the notes in this section to prepare product name, target specification, application, sample stage, volume, destination, and document needs before sending an RFQ.</p>
              <div class="cluster" style="margin-top: 1.25rem">
                <a class="button button--primary" href="contact.html?inquiry_type=quote#contact-form">Send RFQ</a>
                <a class="button button--ghost" href="contact.html?inquiry_type=docs#contact-form">Request COA/TDS</a>
              </div>
            </div>
          </div>
        </section>`;

  return layout({
    slug: track.slug,
    title: track.title,
    description: track.description,
    image: track.image,
    body,
    schemas: [
      collectionSchema(track),
      breadcrumbSchema([
        { name: "Home", url: `${baseUrl}/` },
        { name: "Insights", url: `${baseUrl}/insights.html` },
        { name: track.eyebrow, url: absoluteUrl(track.slug) },
      ]),
    ],
  });
}

function articlePage(article) {
  const quickAnswer = getQuickAnswer(article);
  const ctaLabel = getCtaLabel(article);
  const specs = article.specs
    .map(([label, value]) => `                  <tr><th scope="row">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
    .join("\n");
  const scorecardRows = [
    ["Identity and grade", `Confirm the exact ${article.product} name, botanical or material identity, target grade, assay or ratio language, and any carrier or excipient expectations.`],
    ["Application fit", "State the dosage form or product format so the supplier can flag solubility, sensory, color, taste, carrier, handling, or compliance concerns before sampling."],
    ["Document path", "Ask whether TDS, representative COA, sample COA, and lot-specific COA support are available for the review stage under discussion."],
    ["Commercial assumptions", "Compare sample quantity, MOQ, lead time, replenishment path, destination, packing, and whether U.S. warehouse support is relevant."],
    ["Supplier response quality", "Prefer replies that connect specification, documents, sample route, MOQ, lead time, and missing buyer details in one answer."],
  ]
    .map(([label, value]) => `                  <tr><th scope="row">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
    .join("\n");
  const risks = article.risks.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                    ");
  const questions = article.questions.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                    ");
  const rfqBrief = [
    `Product: ${article.product}`,
    "Target specification or grade: [fill in marker, ratio, extract type, or custom requirement]",
    "Application: [capsule, tablet, powder blend, beverage, functional food, cosmetic, or other]",
    "Review stage: [early screening, sample request, QA review, first purchase, or replenishment]",
    "Documents requested: COA/TDS first; note any internal QA limits or additional files needed",
    "Quantity and timing: [sample quantity, first order estimate, annual forecast if known, target date]",
    "Destination and packing: [ship-to region, packing preference, warehouse or direct-shipment need]",
  ];
  const rfqBriefHtml = rfqBrief.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                    ");
  const related = article.related
    .map(([url, label]) => `<a class="info-card collection-link-card" href="${url}"><strong>${escapeHtml(label)}</strong><span>Continue the sourcing review with this related page.</span></a>`)
    .join("\n              ");
  const sources = article.sources
    ? `<section class="section" style="padding-top: 0">
          <div class="container">
            <article class="info-card citations-card">
              <small>Referenced sources</small>
              <h2>Regulatory and research sources used for this guide</h2>
              <p class="lede">These external references are included to support the sourcing and compliance framework in this article. They do not replace legal, regulatory, or finished-product claim review, but they give procurement and QA teams a more reliable starting point than supplier sales language alone.</p>
              <ol class="citations-list">
${article.sources.map(([name, url, note]) => `                <li><a href="${url}" target="_blank" rel="noopener noreferrer"><span class="citation-title">${escapeHtml(name)}</span></a><span class="citation-note"> - ${escapeHtml(note)}</span></li>`).join("\n")}
              </ol>
            </article>
          </div>
        </section>`
    : "";
  const templates = article.templates
    ? `<section class="section" style="padding-top: 0" id="copy-ready-templates">
          <div class="container">
            <div class="section-heading">
              <div class="section-heading__eyebrow">Copy-ready template</div>
              <h2>Use this text before contacting suppliers</h2>
              <p>Adapt the bracketed fields before sending. The goal is to give procurement, QA, and product development enough context to receive a useful first reply.</p>
            </div>
            <div class="card-grid card-grid--2" style="margin-top: 1.5rem">
${article.templates
  .map(
    ({ title, text }) => `              <article class="info-card">
                <h3>${escapeHtml(title)}</h3>
                <textarea readonly rows="14" style="width: 100%; margin-top: 1rem; padding: 1rem; border: 1px solid var(--color-stone-200); border-radius: var(--radius-sm); font: inherit; line-height: 1.55; color: var(--color-stone-800); background: var(--color-stone-50); resize: vertical;">${escapeHtml(text)}</textarea>
              </article>`,
  )
  .join("\n")}
            </div>
          </div>
        </section>`
    : "";

  const body = `        <section class="page-hero">
          <div class="container split-panel split-panel--hero">
            <div class="section-heading stack">
              <div class="section-heading__eyebrow">${escapeHtml(article.type)}</div>
              <h1>${escapeHtml(article.title)}</h1>
              <p>${escapeHtml(article.summary)}</p>
              <div class="cluster">
                <a class="button button--primary" href="contact.html?inquiry_type=quote&product=${encodeURIComponent(article.product)}#contact-form">Request Quote</a>
                <a class="button button--secondary" href="contact.html?inquiry_type=docs&product=${encodeURIComponent(article.product)}#contact-form">Request COA/TDS</a>
              </div>
            </div>
            <div class="image-frame image-frame--hero">
              <picture>
                <source type="image/webp" srcset="${article.image}" />
                <img src="${article.imageFallback}" alt="${escapeHtml(article.alt)}" width="1200" height="675" loading="eager" fetchpriority="high" />
              </picture>
            </div>
          </div>
        </section>
        <section class="section" style="padding-top: 0" id="quick-answer">
          <div class="container split-panel">
            <article class="legal-card resource-card">
              <small>Quick answer</small>
              <h2>What buyers should know first</h2>
              <p>${escapeHtml(quickAnswer)}</p>
            </article>
            <article class="info-card">
              <small>Buyer action</small>
              <h2>What to do next</h2>
              <p class="lede">Use this note to define the review stage, product grade, application, document need, and commercial assumptions before asking suppliers for price, COA/TDS, or samples. That keeps procurement, QA, and product development aligned around the same material path.</p>
            </article>
          </div>
        </section>
        <section class="section">
          <div class="container split-panel resource-detail-grid">
            <article class="legal-card resource-card">
              <small>Buyer summary</small>
              <h2>Start with the review stage, not only the ingredient name</h2>
              <p>${escapeHtml(article.summary)}</p>
              <p>For U.S. B2B buyers, the first useful supplier response usually depends on five details: target specification, intended application, sample or document stage, expected quantity, and destination. When those details are missing, suppliers can only respond with broad availability language, and procurement may end up comparing offers that are not actually equivalent.</p>
            </article>
            <article class="legal-card resource-card">
              <small>Common specifications</small>
              <h2>Compare the grade before comparing price</h2>
              <table class="spec-table" aria-label="${escapeHtml(article.product)} specification comparison notes">
                <tbody>
${specs}
                </tbody>
              </table>
            </article>
          </div>
        </section>
        <section class="section" id="application-fit">
          <div class="container split-panel">
            <article class="info-card">
              <h2>Application fit</h2>
              <p class="lede">${escapeHtml(article.application)}</p>
              <p class="lede">A supplier can give a better recommendation when the buyer names the dosage form or finished product format. Capsules, tablets, gummies, stick packs, beverages, powders, foods, and personal-care applications can put different pressure on solubility, color, taste, carrier, microbiology, and document review.</p>
              <p class="lede">When the application is still uncertain, the buyer should say so directly. A good supplier response can then separate what is already known from what needs sample work, formula review, or QA confirmation. This is especially useful for teams that are comparing several botanical ingredients for the same launch window.</p>
            </article>
            <article class="info-card">
              <h2>Quality documents to request</h2>
              <p class="lede">${escapeHtml(article.documents)}</p>
              <p class="lede">The cleanest request names whether the file is needed for screening, sample approval, internal QA comparison, first purchase planning, or ongoing supplier qualification. That context helps avoid sending a file that does not answer the buyer's actual question.</p>
              <p class="lede">For early screening, ask whether a TDS and representative COA path can be discussed. For sample or first purchase review, ask how documents connect to the material path under evaluation. This distinction keeps procurement, QA, and product development from treating unrelated files as if they represent the same grade.</p>
            </article>
          </div>
        </section>
        <section class="section" style="padding-top: 0" id="supplier-scorecard">
          <div class="container split-panel">
            <article class="legal-card resource-card">
              <small>Supplier scorecard</small>
              <h2>Use the same criteria for every supplier reply</h2>
              <table class="spec-table" aria-label="${escapeHtml(article.product)} supplier comparison scorecard">
                <tbody>
${scorecardRows}
                </tbody>
              </table>
            </article>
            <article class="info-card">
              <small>Copy-ready RFQ brief</small>
              <h2>Details to include in the first message</h2>
              <p class="lede">A concise RFQ brief helps suppliers answer with usable technical and commercial context instead of a generic price line. Buyers can adapt this structure before requesting COA/TDS, samples, or first purchase support.</p>
              <ul class="warehouse-checklist warehouse-checklist--dense">
                    ${rfqBriefHtml}
              </ul>
            </article>
          </div>
        </section>
        <section class="section" style="padding-top: 0">
          <div class="container split-panel">
            <article class="info-card">
              <h2>Supplier response benchmark</h2>
              <p class="lede">A strong supplier reply should not only quote a price. It should confirm the grade being discussed, explain the available specification path, identify the next document or sample step, and ask for any missing details that affect commercial fit. If the reply does not connect specification, sample, documents, MOQ, and lead time, the buyer may need another clarification round before the offer is usable.</p>
            </article>
            <article class="info-card">
              <h2>How to use this note</h2>
              <p class="lede">Use this page before sending the first message and again when comparing supplier replies. The goal is not to overcomplicate the RFQ. The goal is to give the supplier enough context to answer like a technical sourcing partner: which grade fits, which documents can be routed, what sample path makes sense, and what commercial assumptions should be confirmed before a purchase order.</p>
            </article>
          </div>
        </section>${templates}
        <section class="section section--contrast">
          <div class="container">
            <div class="section-heading">
              <div class="section-heading__eyebrow">Risk control</div>
              <h2>Sourcing risks to resolve before sample review</h2>
              <p>Most delays happen because the buyer and supplier are not discussing the same grade, document stage, or application. Resolve these points early so samples and quotes arrive with usable context.</p>
            </div>
            <div class="card-grid card-grid--3" style="margin-top: 2rem">
              <article class="info-card">
                <h3>Common risks</h3>
                <ul class="warehouse-checklist warehouse-checklist--dense">
                    ${risks}
                </ul>
              </article>
              <article class="info-card">
                <h3>Questions to ask supplier</h3>
                <ul class="warehouse-checklist warehouse-checklist--dense">
                    ${questions}
                </ul>
              </article>
              <article class="info-card">
                <h3>RFQ details to include</h3>
                <ul class="warehouse-checklist warehouse-checklist--dense">
                  <li>Product name and target specification.</li>
                  <li>Application and dosage form.</li>
                  <li>Sample quantity, first order volume, and annual estimate if known.</li>
                  <li>Destination, packing preference, and target timing.</li>
                  <li>COA/TDS or additional QA files needed for the review stage.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>
        <section class="section">
          <div class="container">
            <div class="cta-banner">
              <h2>Request ${escapeHtml(article.product)} details</h2>
              <p>Send the product, target grade, application, sample stage, quantity, destination, and document needs in one structured inquiry. That gives the sourcing team enough context to respond with the right commercial and QA path.</p>
              <div class="cluster" style="margin-top: 1.25rem">
                <a class="button button--primary" href="contact.html?inquiry_type=quote&product=${encodeURIComponent(article.product)}#contact-form">Send RFQ</a>
                <a class="button button--ghost" href="contact.html?inquiry_type=docs&product=${encodeURIComponent(article.product)}#contact-form">Request COA/TDS</a>
                <a class="button button--ghost" href="${article.productUrl}">${escapeHtml(ctaLabel)}</a>
              </div>
            </div>
          </div>
        </section>
        <section class="section" style="padding-top: 0">
          <div class="container">
            <div class="section-heading">
              <div class="section-heading__eyebrow">Related products and tools</div>
              <h2>Continue the buyer review</h2>
              <p>Use these related pages to connect the insight note to product specifications, QA documents, RFQ preparation, and application planning.</p>
            </div>
            <div class="collection-grid collection-grid--compact" style="margin-top: 1.5rem">
              ${related}
              <a class="info-card collection-link-card" href="${article.track}"><strong>Back to ${escapeHtml(tracks.find((track) => track.slug === article.track).eyebrow)}</strong><span>Browse more notes in this insight track.</span></a>
            </div>
          </div>
        </section>${sources ? `\n${sources}` : ""}`;

  return layout({
    slug: article.slug,
    title: article.title,
    description: article.description,
    ogType: "article",
    image: article.image,
    body,
    schemas: [
      articleSchema(article),
      faqSchema(article),
      breadcrumbSchema([
        { name: "Home", url: `${baseUrl}/` },
        { name: "Insights", url: `${baseUrl}/insights.html` },
        { name: tracks.find((track) => track.slug === article.track).eyebrow, url: `${baseUrl}/${article.track}` },
        { name: article.title, url: absoluteUrl(article.slug) },
      ]),
    ],
  });
}

function write(fileName, content) {
  fs.writeFileSync(path.join(projectRoot, fileName), content, "utf8");
}

function main() {
  for (const track of tracks) {
    write(track.slug, categoryPage(track));
  }

  for (const article of articles) {
    write(article.slug, articlePage(article));
  }

  console.log(`Generated ${tracks.length} insight track pages and ${articles.length} insight articles.`);
}

if (require.main === module) {
  main();
}

module.exports = {
  articles,
  tracks,
};
