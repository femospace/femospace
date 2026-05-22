const fs = require('fs');
const i18nPath = './apps/web/src/i18n.ts';
let content = fs.readFileSync(i18nPath, 'utf-8');

const footerBlock = `  'footer': {
    'terms': 'Terms',
    'privacy': 'Privacy Policy',
    'contact': 'Contact Us',
    'copyright': '© 2026 SS Corporate Inc'
  }`;

// This function finds the last '}' of the translation object for a given language
function findTranslationEnd(str, startFrom) {
    let count = 0;
    let inTranslation = false;
    for (let i = startFrom; i < str.length; i++) {
        if (str.substring(i, i + 12) === 'translation:') {
            inTranslation = true;
        }
        if (inTranslation) {
            if (str[i] === '{') count++;
            if (str[i] === '}') {
                count--;
                if (count === 0) return i;
            }
        }
    }
    return -1;
}

const langRegex = /'([a-zA-Z-]+)':\s*{\s*translation:\s*{/g;
let match;
let offset = 0;
const matches = [];

while ((match = langRegex.exec(content)) !== null) {
    matches.push({ start: match.index });
}

// Process backwards to not mess up offsets
for (let i = matches.length - 1; i >= 0; i--) {
    const start = matches[i].start;
    const end = findTranslationEnd(content, start);
    
    if (end !== -1) {
        // Check if footer already exists in this block
        const block = content.substring(start, end);
        if (!block.includes("'footer':")) {
            // Inject footer before the last brace
            // We search backwards for the last non-whitespace character before '}'
            let insertPos = end;
            while (insertPos > start && /\s/.test(content[insertPos - 1])) {
                insertPos--;
            }
            
            // Add a comma if missing
            const prefix = content.substring(insertPos - 1, insertPos) === ',' ? '\n' : ',\n';
            content = content.substring(0, insertPos) + prefix + footerBlock + '\n  ' + content.substring(insertPos);
        } else if (!block.includes("'copyright':")) {
           // If footer exists but missing copyright, fix it (actually our previous script might have done it, but let's be safe)
           // We'll skip for now as the specialized script handles this.
        }
    }
}

fs.writeFileSync(i18nPath, content);
console.log('Force-injected footer into all translation blocks.');
