"use strict";

function buildFaqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (items || []).map((item) => ({
      "@type": "Question",
      name: item.question || "未指定",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer || "未指定",
      },
    })),
  };
}

module.exports = {
  buildFaqSchema,
};
