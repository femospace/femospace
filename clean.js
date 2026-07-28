const fs = require('fs');
const path = require('path');

const dirsToClean = [
  'node_modules',
  'apps/web/node_modules',
  'apps/backend/node_modules',
  'apps/desktop/node_modules',
  'apps/mobile/node_modules',
  'apps/mobile-android/node_modules',
  'apps/admin-panel/node_modules',
  'apps/frontend/node_modules'
];

for (const dir of dirsToClean) {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`Deleting ${fullPath}...`);
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`Successfully deleted ${fullPath}`);
    } catch (e) {
      console.error(`Failed to delete ${fullPath}:`, e.message);
    }
  }
}
