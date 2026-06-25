const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const cssDir = path.join(rootDir, 'assets', 'css');

// Order is crucial for CSS cascade
const files = [
  'reset.css',
  'tokens.css',
  'layout.css',
  'components.css',
  'pages.css'
];

let combined = '';

// Read and concatenate all CSS files
files.forEach(file => {
  const filePath = path.join(cssDir, file);
  if (fs.existsSync(filePath)) {
    combined += `/* --- BUNDLED FROM: ${file} --- */\n`;
    combined += fs.readFileSync(filePath, 'utf8') + '\n';
  } else {
    console.warn(`Warning: File ${filePath} not found.`);
  }
});

// Add our custom premium CSS rules for footer cert badges and extra layouts
const extraCss = `
/* ==========================================================================
   PREMIUM E-E-A-T FOOTER & HIGH-DENSITY GEOLOGICAL TRUST STYLING
   ========================================================================== */

.footer-certs-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.footer-cert-badge {
  background: rgba(63, 124, 98, 0.12);
  border: 1px solid rgba(63, 124, 98, 0.3);
  color: #a3e635; /* Bright energetic green for high premium contrast */
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.3rem 0.65rem;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.footer-cert-badge:hover {
  background: rgba(63, 124, 98, 0.25);
  border-color: #a3e635;
  transform: translateY(-1.5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.cert-check {
  font-size: 0.8rem;
  color: #84cc16;
  font-weight: 900;
}

.footer-contact-details .contact-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.footer-contact-details .contact-val {
  font-size: 0.92rem;
  font-style: normal;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.85);
}

.footer-contact-details .contact-val a.footer-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  padding-bottom: 1px;
  transition: all 0.2s ease;
}

.footer-contact-details .contact-val a.footer-link:hover {
  color: #ffffff;
  border-bottom-style: solid;
  border-bottom-color: #ffffff;
}

.font-semibold {
  font-weight: 600;
}

/* Scientific specification and academic citation cards styles */
.scientific-spec-card {
  margin-top: 1.5rem;
  border-left: 4px solid var(--color-accent-700, #ab8450);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(246, 241, 235, 0.9));
}

.citations-card {
  margin-top: 1.5rem;
  background: linear-gradient(180deg, #ffffff 0%, rgba(251, 248, 245, 0.9) 100%);
}

.citations-list {
  list-style: none;
  padding-left: 0;
  margin-top: 0.75rem;
}

.citations-list li {
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--color-stone-700);
  margin-bottom: 0.75rem;
  position: relative;
  padding-left: 1.25rem;
}

.citations-list li::before {
  content: "📚";
  position: absolute;
  left: 0;
  top: 0.05rem;
  font-size: 0.8rem;
}

.citations-list li .citation-title {
  font-weight: 600;
  color: var(--color-stone-900);
}

.citations-list li .citation-journal {
  font-style: italic;
  color: var(--color-stone-600);
}

.download-spec-btn-wrapper {
  margin-top: 1.25rem;
}

.button--download {
  background: linear-gradient(135deg, #3f7c62 0%, #2f5d49 100%) !important;
  color: #ffffff !important;
  box-shadow: 0 4px 6px rgba(63, 124, 98, 0.2);
  transition: all 0.2s ease;
}

.button--download:hover {
  background: linear-gradient(135deg, #4da47e 0%, #376e56 100%) !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(63, 124, 98, 0.3);
}

.spec-scientific-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-stone-500);
  font-weight: 700;
  margin-bottom: 0.15rem;
}

.spec-scientific-value {
  font-size: 0.96rem;
  color: var(--color-stone-900);
  font-family: var(--font-body);
}
`;

combined += extraCss;

// A simple minifier that strips comments, newlines, and multi-spaces
const minified = combined
  .replace(/\/\*\*[\s\S]*?\*\//g, '') // Remove standard comments
  .replace(/\/\*[\s\S]*?\*\//g, '')   // Remove comments
  .replace(/\s+/g, ' ')               // Replace multiple spaces with a single space
  .replace(/\s*([\{\}:;\,])\s*/g, '$1') // Remove spaces around delimiters
  .trim();

fs.writeFileSync(path.join(cssDir, 'main.css'), minified, 'utf8');
console.log('CSS combined and minified to assets/css/main.css successfully.');
