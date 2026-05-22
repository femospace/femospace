const fs = require('fs');
const file = 'C:/Users/user/femo-space/apps/web/src/i18n.ts';
let content = fs.readFileSync(file, 'utf8');

// Find all lines that have 'noResults': "something "{{query}}"",
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('noResults') && lines[i].includes('{{query}}') && lines[i].includes('"')) {
    // If the line uses outer double quotes and inner double quotes unescaped
    if (lines[i].match(/'noResults':\s*".*"/)) {
       // just replace outer double quotes with single quotes, and escape inner single quotes if any
       let innerStringMatch = lines[i].match(/'noResults':\s*"(.*)",/);
       if (innerStringMatch) {
         let innerStr = innerStringMatch[1];
         // if innerStr contains unescaped double quotes, escape them
         innerStr = innerStr.replace(/"/g, '\\"');
         lines[i] = lines[i].replace(/'noResults':\s*".*",/, `'noResults': "${innerStr}",`);
       }
    }
  }
}
fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed double quotes.');
