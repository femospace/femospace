import fs from 'fs';
import path from 'path';

// Read the file manually to bypass any browser-only imports in i18n.ts
const i18nContent = fs.readFileSync(path.resolve('./src/i18n.ts'), 'utf-8');

// We know the structure:
// const en = { ... };
// const resources = { ... };
// We can use a creative way to extract it. Let me just use a quick hack to evaluate it.
// I'll strip out imports and i18next initializations.

const lines = i18nContent.split('\n');
let codeToEval = '';
for (const line of lines) {
    if (line.startsWith('import ') || line.includes('i18n') && line.includes('.use')) continue;
    if (line.includes('export default')) continue;
    codeToEval += line + '\n';
}

codeToEval += '\nmodule.exports = resources;\n';

fs.writeFileSync('./temp-resources.cjs', codeToEval, 'utf-8');

const resources = require('./temp-resources.cjs');

const publicLocalesDir = path.resolve('./public/locales');
if (!fs.existsSync(publicLocalesDir)) {
    fs.mkdirSync(publicLocalesDir, { recursive: true });
}

for (const [lang, data] of Object.entries(resources)) {
    const langDir = path.join(publicLocalesDir, lang);
    if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir);
    }
    fs.writeFileSync(
        path.join(langDir, 'translation.json'),
        JSON.stringify(data.translation, null, 2)
    );
    console.log(`Wrote ${lang}/translation.json`);
}

console.log('Successfully extracted translations!');
