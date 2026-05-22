const fs = require('fs');
const path = require('path');

const tsFiles = [
    'apps/web/src/pages/AdManager.tsx',
    'apps/web/src/pages/business/BusinessOrders.tsx',
    'apps/web/src/pages/business/BusinessProducts.tsx',
    'apps/web/src/pages/marketplace/Cart.tsx',
    'apps/web/src/pages/marketplace/Checkout.tsx',
    'apps/web/src/pages/marketplace/MarketplaceHome.tsx',
    'apps/web/src/pages/marketplace/MyOrders.tsx',
    'apps/web/src/pages/marketplace/ProductDetails.tsx',
    'apps/web/src/pages/marketplace/StorePage.tsx',
    'apps/web/src/pages/wallet/AdminPaymentApprovals.tsx',
    'apps/web/src/pages/wallet/DepositFunds.tsx',
    'apps/web/src/pages/wallet/WalletDashboard.tsx',
    'apps/web/src/pages/wallet/WithdrawFunds.tsx',
];

for (const file of tsFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Fix "React" 
        content = content.replace(/^import React from 'react';\r?\n/gm, '');
        content = content.replace(/^import React, {\s*/gm, 'import { ');

        fs.writeFileSync(filePath, content, 'utf8');
    } else {
        console.warn(`Could not find ${filePath}`);
    }
}
