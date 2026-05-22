const fs = require('fs');
const file = 'C:/Users/user/femo-space/apps/web/src/i18n.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/'noResults': 'Keine Sprachen für '\{\{query\}\}\\\' gefunden',/g, "'noResults': 'Keine Sprachen für \\'{{query}}\\' gefunden',");
content = content.replace(/'noResults': '未找到匹配 '\{\{query\}\}\\\' 的语言',/g, "'noResults': '未找到匹配 \\'{{query}}\\' 的语言',");
content = content.replace(/'noResults': '未找到匹配 '\{\{query\}\}\\\' 的語言',/g, "'noResults': '未找到匹配 \\'{{query}}\\' 的語言',");

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed quotes.');
