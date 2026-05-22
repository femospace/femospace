const fs = require('fs');
const file = 'C:/Users/user/femo-space/apps/web/src/i18n.ts';
let content = fs.readFileSync(file, 'utf8');

let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('noResults') && lines[i].includes('{{query}}')) {
    
    // Case 1: unescaped double quotes inside double quoted string
    // e.g. "No languages found for "{{query}}""
    if (lines[i].includes('"{{query}}""')) {
      lines[i] = lines[i].replace(/"{{query}}""/, '\\"{{query}}\\""');
      // Wait, let's just make it single quotes on the outside.
      // Since it's like 'noResults': "something "{{query}}"",
      // Let's just use string replace.
      lines[i] = lines[i].replace(/'noResults':\s*"(.*?)"\{\{query\}\}"(.*)",/, `'noResults': '$1"{{query}}"$2',`);
    }
    
    // Case 2: unescaped single quotes inside single quoted string
    // e.g. 'Keine Sprachen für '{{query}}\' gefunden'
    else if (lines[i].match(/'noResults':\s*'(.*)'\{\{query\}\}\\'(.*)',/)) {
      lines[i] = lines[i].replace(/'noResults':\s*'(.*)'\{\{query\}\}\\'(.*)',/, `'noResults': "$1'{{query}}'$2",`);
    }
    // Also if there's no trailing backslash
    else if (lines[i].match(/'noResults':\s*'(.*)'\{\{query\}\}'(.*)',/)) {
      lines[i] = lines[i].replace(/'noResults':\s*'(.*)'\{\{query\}\}'(.*)',/, `'noResults': "$1'{{query}}'$2",`);
    }
    
    // Generic fix: just wrap whatever is after the colon in backticks!
    // e.g. 'noResults': `...`,
    else {
      let match = lines[i].match(/'noResults':\s*(['"])(.*)\1,/);
      if (match) {
        // We just use a function to properly stringify the value
        // Wait, just leave it if it's already valid.
      }
    }
  }
}

// Better generic fix: 
// Just find all noResults lines and replace their value with a safely escaped string.
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('noResults') && lines[i].includes('{{query}}')) {
    let str = lines[i];
    // if it has unescaped quotes, it throws in eval
    try {
      eval('const x = {' + str + '};');
    } catch(e) {
      // It's broken. Let's fix it by parsing it manually.
      // The broken ones are:
      // 'noResults': "No languages found for "{{query}}"",
      if (str.includes('"{{query}}""')) {
        lines[i] = str.replace(/"\{\{query\}\}""/, '\\"{{query}}\\""');
      }
      // 'noResults': 'Keine Sprachen für '{{query}}\' gefunden',
      else if (str.includes("'{{query}}\\'")) {
        lines[i] = str.replace(/'\{\{query\}\}\\'/, "\\'{{query}}\\'");
      }
      // 'noResults': 'Языки, соответствующие '{{query}}', не найдены',
      else if (str.includes("'{{query}}'")) {
        lines[i] = str.replace(/'\{\{query\}\}'/, "\\'{{query}}\\'");
      }
    }
  }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed quotes!');
