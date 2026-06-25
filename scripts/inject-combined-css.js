const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Find all HTML files in the root directory
const files = fs.readdirSync(rootDir).filter(file => file.endsWith('.html'));

let successCount = 0;

files.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex pattern matching the five links with optional whitespace
  const cssPattern = /<link\s+rel="stylesheet"\s+href="assets\/css\/reset\.css"\s*\/?>\s*<link\s+rel="stylesheet"\s+href="assets\/css\/tokens\.css"\s*\/?>\s*<link\s+rel="stylesheet"\s+href="assets\/css\/layout\.css"\s*\/?>\s*<link\s+rel="stylesheet"\s+href="assets\/css\/components\.css"\s*\/?>\s*<link\s+rel="stylesheet"\s+href="assets\/css\/pages\.css"\s*\/?>/i;

  if (cssPattern.test(content)) {
    content = content.replace(cssPattern, '<link rel="stylesheet" href="assets/css/main.css" />');
    fs.writeFileSync(filePath, content, 'utf8');
    successCount++;
  } else {
    // Fallback line-by-line replacement to clean up individual stylesheets
    const lines = content.split('\n');
    const newLines = [];
    let replaced = false;
    let mainCssAdded = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('assets/css/reset.css')) {
        if (!mainCssAdded) {
          // Replace with main.css, preserving leading indentation
          const indent = line.match(/^\s*/)[0];
          newLines.push(`${indent}<link rel="stylesheet" href="assets/css/main.css" />`);
          mainCssAdded = true;
        }
        replaced = true;
      } else if (
        line.includes('assets/css/tokens.css') ||
        line.includes('assets/css/layout.css') ||
        line.includes('assets/css/components.css') ||
        line.includes('assets/css/pages.css')
      ) {
        // Skip these files as they are now bundled
        replaced = true;
      } else {
        newLines.push(line);
      }
    }

    if (replaced) {
      fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
      successCount++;
    } else {
      console.log(`Warning: Stylesheets pattern not found or already combined in ${file}`);
    }
  }
});

console.log(`Injected combined CSS link into ${successCount} HTML files.`);
