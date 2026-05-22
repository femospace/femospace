const fs = require('fs');
const file = 'C:/Users/user/femo-space/apps/web/src/i18n.ts';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('\'noResults\':') && lines[i].includes('{{query}}')) {
    let match = lines[i].match(/'noResults':\s*'(.*)',/);
    if (match) {
        let innerString = match[1];
        innerString = innerString.replace(/\\\\'/g, "'").replace(/\\'/g, "'");
        lines[i] = lines[i].replace(/'noResults':\s*'.*',/, `'noResults': "` + innerString + `",`);
    }
  }
}
fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed noResults strings');
