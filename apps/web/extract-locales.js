import fs from 'fs';
import path from 'path';

let content = fs.readFileSync(path.resolve('./src/i18n.ts'), 'utf-8');

// The resources object is defined. We just need to remove imports and the i18n generation.
let jsCode = content.split('\n')
    .filter(l => !l.startsWith('import ') && !l.startsWith('export default i18n'))
    .join('\n');

jsCode = jsCode.replace(/i18n[\s\S]*?\.init\([\s\S]*?\);/, '');

// Now we can export resources
jsCode += '\nexport default resources;\n';

fs.writeFileSync('temp.js', jsCode);
const resourcesModule = await import('./temp.js');
const resources = resourcesModule.default;

const localesDir = path.resolve('./public/locales');
fs.mkdirSync(localesDir, { recursive: true });

for (const [lang, data] of Object.entries(resources)) {
    const langDir = path.join(localesDir, lang);
    fs.mkdirSync(langDir, { recursive: true });
    fs.writeFileSync(path.join(langDir, 'translation.json'), JSON.stringify(data.translation, null, 2));
}

console.log('done extraction');
