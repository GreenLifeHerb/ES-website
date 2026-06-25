const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../');

// Dictionary for Semantic Internal Linking
// Keys are matched with word boundary (\b) case-insensitively.
// Longer phrases are placed first to prevent subset matching.
const LINK_DICTIONARY = [
  { term: 'dietary supplements', url: 'applications.html' },
  { term: 'dietary supplement', url: 'applications.html' },
  { term: 'botanical extracts', url: 'specification-extracts.html' },
  { term: 'botanical extract', url: 'specification-extracts.html' },
  { term: 'specialty ingredients', url: 'specialty-ingredients.html' },
  { term: 'specialty ingredient', url: 'specialty-ingredients.html' },
  { term: 'brand ingredients', url: 'brand-ingredients.html' },
  { term: 'brand ingredient', url: 'brand-ingredients.html' },
  { term: 'California warehouse', url: 'warehouse.html' },
  { term: 'New Jersey warehouse', url: 'warehouse.html' },
  { term: 'quality assurance', url: 'quality.html' },
  { term: 'supply chain', url: 'partner.html' },
  { term: 'supplements', url: 'applications.html' },
  { term: 'supplement', url: 'applications.html' },
  { term: 'extracts', url: 'specification-extracts.html' },
  { term: 'extract', url: 'specification-extracts.html' },
  { term: 'mushrooms', url: 'natural-mushrooms.html' },
  { term: 'mushroom', url: 'natural-mushrooms.html' },
  { term: 'warehouses', url: 'warehouse.html' },
  { term: 'warehouse', url: 'warehouse.html' },
  { term: 'sourcing', url: 'contact.html' },
  { term: 'quotes', url: 'contact.html' },
  { term: 'quote', url: 'contact.html' },
  { term: 'samples', url: 'contact.html' },
  { term: 'sample', url: 'contact.html' },
  { term: 'quality', url: 'quality.html' },
  { term: 'specifications', url: 'quality.html' },
  { term: 'specification', url: 'quality.html' },
  { term: 'partner', url: 'partner.html' },
  { term: 'about', url: 'about.html' },
  { term: 'COA', url: 'quality.html' },
  { term: 'Essence Source', url: 'about.html' }
];

// Append CSS rules to main.css if not already present
function appendCssIfNeeded() {
  const cssPath = path.join(ROOT_DIR, 'assets/css/main.css');
  if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');
    if (!css.includes('.seo-link')) {
      const seoLinkCss = '\n.seo-link{color:var(--color-accent-700);font-weight:600;border-bottom:1px dashed var(--color-accent-500);transition:all var(--transition-base);}.seo-link:hover{color:var(--color-ink-950);border-bottom-style:solid;text-decoration:none;}';
      fs.appendFileSync(cssPath, seoLinkCss, 'utf8');
      console.log('Successfully appended .seo-link styles to main.css');
    } else {
      console.log('.seo-link styles already exist in main.css');
    }
  } else {
    console.error('main.css not found at ' + cssPath);
  }
}

// Main execution block
function run() {
  appendCssIfNeeded();

  const files = fs.readdirSync(ROOT_DIR)
    .filter(file => file.startsWith('product-') && file.endsWith('.html'));

  console.log(`Found ${files.length} product HTML files to optimize.\n`);

  let successCount = 0;

  files.forEach(filename => {
    const filePath = path.join(ROOT_DIR, filename);
    let html = fs.readFileSync(filePath, 'utf8');

    // Restore any previously corrupted/nested seo-links from prior runs
    // By matching <a href="..." class="seo-link">...</a> and replacing with plain text
    // This allows us to rebuild links cleanly.
    // e.g. <a href="applications.html" class="seo-link">Dietary <a href="applications.html" class="seo-link">Supplements</a></a>
    // We can strip all seo-links recursively or via simple loops to restore plain text.
    let beforeStrip = '';
    while (html !== beforeStrip) {
      beforeStrip = html;
      html = html.replace(/<a\s+href="[^"]+"\s+class="seo-link">([\s\S]*?)<\/a>/gi, '$1');
    }

    // 1. Extract Product Name from existing Product JSON-LD
    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
    let match;
    let productName = '';
    let productJson = null;
    let productMatchStart = -1;
    let productMatchEnd = -1;

    // Reset lastIndex for regex safety
    jsonLdRegex.lastIndex = 0;

    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(match[1].trim());
        if (parsed['@type'] === 'Product') {
          productName = parsed.name;
          productJson = parsed;
          productMatchStart = match.index;
          productMatchEnd = jsonLdRegex.lastIndex;
          break;
        }
      } catch (err) {
        // Skip malformed JSON blocks
      }
    }

    if (!productName || !productJson) {
      // Fallback: extract from title
      const titleMatch = html.match(/<title>(.*?) Supplier in USA/i);
      if (titleMatch) {
        productName = titleMatch[1].replace(/&#39;/g, "'").trim();
      } else {
        console.warn(`Could not extract product name for ${filename}, skipping...`);
        return;
      }
    }

    // Clean up HTML entity codes in product name for internal use
    const cleanProductName = productName.replace(/&#39;/g, "'").replace(/&amp;/g, '&');
    console.log(`Processing [${filename}] -> Product: "${cleanProductName}"`);

    // 2. Keep Product Schema conservative.
    // Do not synthesize ratings or public prices unless the business has verified data.
    delete productJson.aggregateRating;
    delete productJson.offers;

    // Re-serialize Product JSON-LD
    const upgradedProductBlock = `<script type="application/ld+json">\n      ${JSON.stringify(productJson, null, 2).replace(/\n/g, '\n      ')}\n    </script>`;

    // Replace the old Product JSON-LD block
    if (productMatchStart !== -1) {
      html = html.substring(0, productMatchStart) + upgradedProductBlock + html.substring(productMatchEnd);
    }

    // 3. Generate and inject FAQPage JSON-LD
    // Remove existing FAQPage block to keep it idempotent
    html = html.replace(/<script type="application\/ld\+json">\s*\{\s*"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"FAQPage"[\s\S]*?<\/script>\s*/gi, '');

    const faqJson = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What is the minimum order quantity (MOQ) for bulk ${cleanProductName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `MOQ, sample quantity, and packaging for bulk ${cleanProductName} depend on grade, lot path, and project requirements. Please contact our U.S. sourcing desk to confirm the current commercial path.`
          }
        },
        {
          "@type": "Question",
          "name": `Are COA and samples available for ${cleanProductName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Qualified buyers can request available documentation including a Certificate of Analysis (COA) and Technical Data Sheet (TDS). Sample review can be arranged by product, lot path, and project fit.`
          }
        },
        {
          "@type": "Question",
          "name": `Where is ${cleanProductName} stored and shipped from?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Warehouse support and shipment path vary by product, lot, and buyer requirement. Confirm current availability and likely fulfillment route during inquiry.`
          }
        }
      ]
    };

    const faqBlock = `\n    <script type="application/ld+json">\n      ${JSON.stringify(faqJson, null, 2).replace(/\n/g, '\n      ')}\n    </script>`;

    // Insert FAQ JSON-LD right before the closing </head> tag
    html = html.replace('</head>', faqBlock + '\n  </head>');

    // 4. Inject Visible HTML FAQ Section inside the page
    // First remove any existing FAQ section to keep it idempotent
    html = html.replace(/<section class="info-card faq-section">[\s\S]*?<\/section>\s*/gi, '');

    const htmlFaqSection = `
              <section class="info-card faq-section">
                <h2>Frequently Asked Questions</h2>
                <div class="faq-static-list" style="margin-top: 1rem;">
                  <div class="faq-static-item" style="margin-bottom: 1.25rem;">
                    <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--color-stone-900);">What is the minimum order quantity (MOQ) for bulk ${productName}?</h3>
                    <p style="margin-top: 0.4rem; font-size: 0.92rem; color: var(--color-stone-700); line-height: 1.6;">MOQ, sample quantity, and packaging for bulk ${productName} depend on grade, lot path, and project requirements. Please contact our U.S. sourcing desk to confirm the current commercial path.</p>
                  </div>
                  <div class="faq-static-item" style="margin-bottom: 1.25rem;">
                    <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--color-stone-900);">Are COA and samples available for ${productName}?</h3>
                    <p style="margin-top: 0.4rem; font-size: 0.92rem; color: var(--color-stone-700); line-height: 1.6;">Qualified buyers can request available documentation including a Certificate of Analysis (COA) and Technical Data Sheet (TDS). Sample review can be arranged by product, lot path, and project fit.</p>
                  </div>
                  <div class="faq-static-item" style="margin-bottom: 0;">
                    <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--color-stone-900);">Where is ${productName} stored and shipped from?</h3>
                    <p style="margin-top: 0.4rem; font-size: 0.92rem; color: var(--color-stone-700); line-height: 1.6;">Warehouse support and shipment path vary by product, lot, and buyer requirement. Confirm current availability and likely fulfillment route during inquiry.</p>
                  </div>
                </div>
              </section>`;

    // Find the Commercial Fit section and insert FAQ section right after it
    const commercialFitRegex = /(<section class="info-card">[\s\S]*?<h2>Commercial fit<\/h2>[\s\S]*?<\/section>)/gi;
    if (commercialFitRegex.test(html)) {
      html = html.replace(commercialFitRegex, `$1${htmlFaqSection}`);
    } else {
      // Fallback: insert before the closing aside or end of the first .stack
      const stackRegex = /(<div class="stack">[\s\S]*?<\/section>\s*)(<\/div>\s*<aside class="stack">)/i;
      if (stackRegex.test(html)) {
        html = html.replace(stackRegex, `$1${htmlFaqSection}\n              $2`);
      }
    }

    // 4.5. GEO "Key Takeaways" Box & Image Optimizations
    // First remove any existing Key Takeaways box to keep it idempotent
    html = html.replace(/<div class="geo-key-takeaways">[\s\S]*?<\/div>\s*/gi, '');

    // Extract spec items from productJson
    let botName = "Botanical ingredient";
    let specVal = "Standardized extract";
    let docVal = "COA, TDS";
    if (productJson && productJson.additionalProperty) {
      productJson.additionalProperty.forEach(prop => {
        if (prop.name === "Botanical name") botName = prop.value;
        if (prop.name === "Specification") specVal = prop.value;
        if (prop.name === "Documentation available") docVal = prop.value;
      });
    }

    const keyTakeawaysHtml = `
              <div class="geo-key-takeaways" style="background-color: var(--color-stone-50); border-left: 4px solid var(--color-accent-600); padding: 1rem; margin-top: 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
                <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-stone-900);">Key Takeaways</h3>
                <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem; color: var(--color-stone-700); line-height: 1.5;">
                  <li><strong>Source:</strong> Premium ${botName}</li>
                  <li><strong>Specification:</strong> ${specVal}</li>
                  <li><strong>Documentation:</strong> ${docVal} available for U.S. buyers</li>
                </ul>
              </div>`;

    // Insert after the <p class="lede">
    const ledeRegex = /(<p class="lede">[\s\S]*?<\/p>)/i;
    if (ledeRegex.test(html)) {
      html = html.replace(ledeRegex, `$1\n${keyTakeawaysHtml}`);
    } else {
      // Fallback: insert after <h1>
      const h1Regex = /(<h1>[\s\S]*?<\/h1>)/i;
      if (h1Regex.test(html)) {
        html = html.replace(h1Regex, `$1\n${keyTakeawaysHtml}`);
      }
    }

    // LCP & CLS Optimization
    // Find the main product image: src="assets/img/product-*.png"
    const imgRegex = /(<img\s+src="([^"]+)"[^>]*?)>/gi;
    let mainImgSrc = '';
    html = html.replace(imgRegex, (match, p1, src) => {
      if (src.includes('product-') && src.includes('img/') && match.includes('fetchpriority="high"')) {
        mainImgSrc = src.replace('.png', '-1200.webp').replace('img/', 'img/optimized/');
        // Fix trailing slash in p1 if present
        if (p1.trim().endsWith('/')) {
            p1 = p1.trim().slice(0, -1);
        }
        // Inject aspect-ratio for CLS if not present
        if (!match.includes('aspect-ratio')) {
          if (match.includes('style="')) {
            return p1.replace('style="', 'style="aspect-ratio: 1200 / 900; ') + '>';
          } else {
            return p1 + ' style="aspect-ratio: 1200 / 900;"' + '>';
          }
        }
      }
      return match;
    });

    // Inject <link rel="preload"> in the <head> for LCP
    html = html.replace(/<link rel="preload" as="image"[^>]*>\s*/gi, ''); // remove existing
    if (mainImgSrc) {
      const preloadTag = `\n    <link rel="preload" as="image" href="${mainImgSrc}" fetchpriority="high" />`;
      html = html.replace('</head>', preloadTag + '\n  </head>');
    }

    // Content Freshness Signals
    html = html.replace(/<meta property="article:modified_time"[^>]*>\s*/gi, ''); // remove existing head tag
    const modifiedMeta = `\n    <meta property="article:modified_time" content="2026-05-23T00:00:00Z" />`;
    html = html.replace('</head>', modifiedMeta + '\n  </head>');

    html = html.replace(/<div class="freshness-signal">[\s\S]*?<\/div>\s*/gi, ''); // remove existing visual tag
    const freshnessHtml = `\n              <div class="freshness-signal" style="margin-top: 1rem; font-size: 0.8rem; color: var(--color-stone-500); text-align: right;"><time datetime="2026-05-23">Last Updated: May 2026</time></div>`;
    // Insert after spec-table
    const tableRegex = /(<\/table>)/i;
    if (tableRegex.test(html)) {
      html = html.replace(tableRegex, `$1${freshnessHtml}`);
    }

    // 5. Semantic Internal Linking
    // Track already linked terms in this file to avoid duplicate links
    const linkedInFile = new Set();

    // Scan for any pre-existing links to these URLs to avoid double-linking
    LINK_DICTIONARY.forEach(item => {
      const escapedUrl = item.url.replace(/\./g, '\\.');
      const preExistingLinkRegex = new RegExp(`href=["']${escapedUrl}["']`, 'i');
      if (preExistingLinkRegex.test(html)) {
        linkedInFile.add(item.term.toLowerCase());
      }
    });

    // We target paragraphs `<p>` inside `.stack` content
    html = html.replace(/(<p[\s\S]*?>)([\s\S]*?)(<\/p>)/gi, (m, openTag, pContent, closeTag) => {
      // First, split paragraph content by existing <a> tags to protect them
      const anchorTokens = pContent.split(/(<a[^>]*>[\s\S]*?<\/a>)/gi);
      
      // Map to store newly created links and prevent nesting or subset matching
      const localPlaceholders = {};
      let placeholderIndex = 0;

      // Loop only through tokens outside existing <a> tags (even indices)
      for (let i = 0; i < anchorTokens.length; i += 2) {
        let text = anchorTokens[i];

        // Further split text by other HTML tags (like <strong> or <span>) to protect them
        const tagTokens = text.split(/(<[^>]+>)/g);

        for (let j = 0; j < tagTokens.length; j += 2) {
          let plainText = tagTokens[j];

          // Search and replace each dictionary term
          LINK_DICTIONARY.forEach(item => {
            const lowerTerm = item.term.toLowerCase();
            
            // Skip if already linked in this file
            if (linkedInFile.has(lowerTerm)) {
              return;
            }

            // Skip linking to itself
            if (filename === item.url) {
              return;
            }

            // Check for word boundary match
            const keywordRegex = new RegExp(`\\b(${item.term})\\b`, 'i');
            const matchResult = plainText.match(keywordRegex);
            
            if (matchResult) {
              const matchedWord = matchResult[1];
              const placeholder = `__SEO_LINK_PLACEHOLDER_${placeholderIndex}__`;
              
              // Store link HTML in map
              localPlaceholders[placeholder] = `<a href="${item.url}" class="seo-link">${matchedWord}</a>`;
              
              // Replace matched word in plain text with the unique placeholder
              plainText = plainText.replace(keywordRegex, placeholder);
              
              placeholderIndex++;
              linkedInFile.add(lowerTerm);
            }
          });

          tagTokens[j] = plainText;
        }

        anchorTokens[i] = tagTokens.join('');
      }

      // Reconstruct paragraph inner content
      let finalContent = anchorTokens.join('');

      // Replace placeholders back with actual anchor tags
      Object.keys(localPlaceholders).forEach(placeholder => {
        finalContent = finalContent.replace(placeholder, localPlaceholders[placeholder]);
      });

      return openTag + finalContent + closeTag;
    });

    // Write the optimized content back to file
    fs.writeFileSync(filePath, html, 'utf8');
    successCount++;
  });

  console.log(`\nTechnical SEO Optimizations complete! Successfully processed ${successCount}/${files.length} pages.`);
}

run();
