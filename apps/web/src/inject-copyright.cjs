const fs = require('fs');
const i18nPath = './apps/web/src/i18n.ts';
let content = fs.readFileSync(i18nPath, 'utf-8');

// 1. Update the 'en' base footer
content = content.replace(/'footer':\s*{\s*'terms':\s*'Terms',\s*'privacy':\s*'Privacy Policy',\s*'contact':\s*'Contact Us'\s*}/, 
    `'footer': {
    'terms': 'Terms',
    'privacy': 'Privacy Policy',
    'contact': 'Contact Us',
    'copyright': '© 2026 SS Corporate Inc'
  }`);

// 2. Global regex to inject copyright into any existing footer block that lacks it
content = content.replace(/'footer':\s*{([^}]*)}/g, (match, body) => {
    if (body.includes('copyright')) return match;
    // Strip trailing commas and whitespace
    let newBody = body.trimEnd();
    if (newBody.endsWith(',')) {
        return `'footer': {${newBody}\n      'copyright': '© 2026 SS Corporate Inc'\n    }`;
    } else {
        return `'footer': {${newBody},\n      'copyright': '© 2026 SS Corporate Inc'\n    }`;
    }
});

fs.writeFileSync(i18nPath, content);
console.log('Injected copyright into all existing footer blocks.');
