const fs = require('fs');
const en = require('./full-en.cjs');
const i18nPath = './apps/web/src/i18n.ts';
let content = fs.readFileSync(i18nPath, 'utf-8');

const safeStringify = (obj) => {
    return JSON.stringify(obj, null, 2).replace(/"((?:[^"\\]|\\.)*)"/g, (match, p1) => {
        // If the string contains a single quote, we keep it double-quoted
        if (p1.includes("'")) {
            return match;
        }
        // Otherwise convert to single quotes and unescape double quotes
        return "'" + p1.replace(/\\"/g, '"') + "'";
    });
};

// Replace the root 'const en = { ... };'
const startEn = content.indexOf('const en = {');
let depth = 0;
let endEnIdx = -1;
for (let i = startEn + 'const en = {'.length - 1; i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') {
        depth--;
        if (depth === 0) {
            endEnIdx = i + 1;
            break;
        }
    }
}
content = content.substring(0, startEn) + `const en = ${safeStringify(en)};` + content.substring(endEnIdx);

// Propagation to other languages in the resources block
const startRes = content.indexOf('const resources = {');
let resDepth = 0;
let endResIdx = -1;
for (let i = startRes + 'const resources = {'.length - 1; i < content.length; i++) {
    if (content[i] === '{') resDepth++;
    if (content[i] === '}') {
        resDepth--;
        if (resDepth === 0) {
            endResIdx = i + 1;
            break;
        }
    }
}

let resourcesBlock = content.substring(startRes, endResIdx);

const langSections = resourcesBlock.split(/\n  ['"]?([a-z]{2}(-[A-Z]{2})?)['"]?: \{/);
const updatedSections = [];
updatedSections.push(langSections[0]);

for (let i = 1; i < langSections.length; i += 3) {
    const langCode = langSections[i];
    const rest = langSections[i + 2];
    
    if (langCode === 'en') {
        updatedSections.push(`\n  en: {${rest}`);
        continue;
    }

    const transStart = rest.indexOf('translation: {');
    if (transStart === -1) {
        updatedSections.push(`\n  '${langCode}': {${rest}`);
        continue;
    }

    let tDepth = 0;
    let tEnd = -1;
    for (let j = transStart + 'translation: {'.length - 1; j < rest.length; j++) {
        if (rest[j] === '{') tDepth++;
        if (rest[j] === '}') {
            tDepth--;
            if (tDepth === 0) {
                tEnd = j + 1;
                break;
            }
        }
    }

    if (tEnd === -1) {
        updatedSections.push(`\n  '${langCode}': {${rest}`);
        continue;
    }

    const currentTransStr = rest.substring(transStart + 'translation: '.length, tEnd);
    try {
        // Use a safe way to evaluate or just replace the keys if they exist in en
        // Here we'll merge them
        const currentTrans = eval(`(${currentTransStr})`);
        
        const merge = (target, source) => {
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    merge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
            return target;
        };
        
        const merged = merge(JSON.parse(JSON.stringify(en)), currentTrans);
        const newTransStr = safeStringify(merged).split('\n').map(l => '    ' + l).join('\n').trim();
        const newRest = rest.substring(0, transStart) + `translation: ${newTransStr}` + rest.substring(tEnd);
        updatedSections.push(`\n  '${langCode}': {${newRest}`);
    } catch (e) {
        console.error(`Error processing ${langCode}: ${e.message}`);
        updatedSections.push(`\n  '${langCode}': {${rest}`);
    }
}

const newResourcesBlock = updatedSections.join('');
content = content.substring(0, startRes) + newResourcesBlock + content.substring(endResIdx);

fs.writeFileSync(i18nPath, content);
console.log('Successfully propagated all keys to all languages with safety check');
