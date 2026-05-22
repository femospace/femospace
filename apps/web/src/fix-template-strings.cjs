const fs = require('fs');
const i18nPath = './apps/web/src/i18n.ts';
let content = fs.readFileSync(i18nPath, 'utf-8');

// The problem: strings like 'No languages found for '{{query}}\'',
// were originally: "No languages found for \"{{query}}\""
// They got mangled by safeStringify.
// Pattern: 'key': 'some text '{{...}}\''  <-- broken
// Should be: 'key': 'some text "{{...}}"'  <-- fixed (with double quotes inside)

// Fix 1: patterns like: 'text '{{...}}\''  -> 'text "{{...}}"'
content = content.replace(/'([^']*)\s+'({{[^}]+}})\\''/g, "'$1 \"$2\"'");

// Fix 2: more general broken pattern - text ending with '{{something}}\'',
// Unescaped single quote followed by {{template}}
content = content.replace(/'([^']*)'({{[^}]+}})\\''/g, (match, before, template) => {
  return `'${before}"${template}"'`;
});

// Fix 3: Also fix noResults type strings: 'No results for '{{query}}','
content = content.replace(/'([^']+)'\s*'({{[^}]+}})'/g, (match, before, template) => {
  return `'${before} "{{query}}"'`.replace('{{query}}', template.slice(2, -2));
});

// Fix 4: 'No languages found for '{{query}}\'' - handle escaped variant
content = content.replace(/'No languages found for '(\{\{[^}]+\}\})\\''/g, 
  "'No languages found for \"$1\"'");

// Fix 5: 'No results for '{{query}}\'' 
content = content.replace(/'No results for '(\{\{[^}]+\}\})\\''/g, 
  "'No results for \"$1\"'");

// Fix 6: Generic - any 'text '{{...}}\'' pattern
content = content.replace(/'([^']+)'(\{\{[^}]+\}\})\\''/g, 
  (match, before, tmpl) => `'${before}"${tmpl}"'`);

fs.writeFileSync(i18nPath, content);
console.log('Fixed broken template string quotes in i18n.ts');
