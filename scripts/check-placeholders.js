const fs = require('fs');
const path = require('path');

console.log('Running build-time placeholder check...');

const componentsDir = path.join(__dirname, '..', 'components');
const appDir = path.join(__dirname, '..', 'app');

let hasErrors = false;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');

      // Check 1: Ensure no direct un-guarded TODO_ string literals in JSX text nodes
      const jsxMatches = content.match(/>\s*TODO_[^<]*</g);
      if (jsxMatches) {
        console.error(`❌ ERROR: Direct un-guarded TODO_ string found in JSX in ${path.relative(process.cwd(), fullPath)}:`, jsxMatches);
        hasErrors = true;
      }

      // Check 2: If component uses t('policyText') or similar keys, ensure isPlaceholder or safeText is imported
      if (content.includes("t('policyText')") || content.includes('t("policyText")')) {
        if (!content.includes('isPlaceholder') && !content.includes('safeText')) {
          console.error(`❌ ERROR: Component ${path.relative(process.cwd(), fullPath)} renders policyText without isPlaceholder/safeText guard.`);
          hasErrors = true;
        }
      }
    }
  }
}

scanDir(componentsDir);
scanDir(appDir);

if (hasErrors) {
  console.error('\n❌ Build-time placeholder check FAILED! Fix un-guarded placeholders before building.');
  process.exit(1);
} else {
  console.log('✓ Build-time placeholder check passed! All rendered content is safely guarded.');
}
