const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(projectRoot).filter(f => f.endsWith('.html')).map(f => path.join(projectRoot, f));

let updatedCount = 0;

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  let originalHtml = html;

  // Since we haven't used <picture> yet, we can safely replace all <img> tags that point to assets/img
  html = html.replace(/(<img\b[^>]+src=["'](assets\/img\/([^"']+)\.(png|jpg|jpeg))["'][^>]*>)/gi, (match, fullImg, srcPath, basename, ext) => {
    
    // Ignore images already wrapped (primitive check)
    // We can't easily check backward in regex, but we know our codebase doesn't use <picture> yet.
    
    const optimizedDir = path.join(projectRoot, 'assets', 'img', 'optimized');
    if (!fs.existsSync(optimizedDir)) return match;
    
    const sizes = [1200, 768, 480];
    const srcsets = [];
    for (const size of sizes) {
      if (fs.existsSync(path.join(optimizedDir, `${basename}-${size}.webp`))) {
        srcsets.push(`assets/img/optimized/${basename}-${size}.webp ${size}w`);
      }
    }
    
    if (srcsets.length === 0) return match;

    // Check if we need to inject loading lazy (don't inject if fetchpriority="high" or loading="eager")
    let imgTag = match;
    if (!imgTag.includes('loading=') && !imgTag.includes('fetchpriority=')) {
      imgTag = imgTag.replace('<img ', '<img loading="lazy" ');
    }

    return `<picture>\n  <source type="image/webp" srcset="${srcsets.join(', ')}">\n  ${imgTag}\n</picture>`;
  });

  if (html !== originalHtml) {
    fs.writeFileSync(file, html, 'utf8');
    updatedCount++;
    console.log(`Updated: ${path.basename(file)}`);
  }
}

console.log(`Successfully upgraded ${updatedCount} HTML files to use modern <picture> tags.`);
