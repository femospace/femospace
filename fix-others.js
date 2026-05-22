const fs = require('fs');
const path = require('path');

function replaceFileContent(file, searchRegex, replaceWith) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(searchRegex, replaceWith);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.warn(`Could not find ${filePath}`);
    }
}

// 1. BusinessOrders.tsx
replaceFileContent(
    'apps/web/src/pages/business/BusinessOrders.tsx',
    /import { Search, Filter, Mail, Package, CheckCircle2, XCircle } from 'lucide-react';/,
    "import { Search, Filter, Mail, Package } from 'lucide-react';"
);
replaceFileContent(
    'apps/web/src/pages/business/BusinessOrders.tsx',
    /const \[orders, setOrders\] = useState\(\[/,
    "const [orders] = useState(["
);

// 2. BusinessProducts.tsx
replaceFileContent(
    'apps/web/src/pages/business/BusinessProducts.tsx',
    /import { useState, useEffect } from 'react';/,
    "import { useState } from 'react';"
);
replaceFileContent(
    'apps/web/src/pages/business/BusinessProducts.tsx',
    /import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';/,
    "import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';"
);
replaceFileContent(
    'apps/web/src/pages/business/BusinessProducts.tsx',
    /const \[products, setProducts\] = useState\(\[/,
    "const [products] = useState(["
);

// 3. MarketplaceHome.tsx
replaceFileContent(
    'apps/web/src/pages/marketplace/MarketplaceHome.tsx',
    /import { useState, useEffect } from 'react';/,
    "import { useState } from 'react';"
);
replaceFileContent(
    'apps/web/src/pages/marketplace/MarketplaceHome.tsx',
    /\s+Filter,\r?\n/,
    "\n"
);

// 4. ProductDetails.tsx
replaceFileContent(
    'apps/web/src/pages/marketplace/ProductDetails.tsx',
    /import { motion, AnimatePresence } from 'framer-motion';/,
    "import { motion } from 'framer-motion';"
);
replaceFileContent(
    'apps/web/src/pages/marketplace/ProductDetails.tsx',
    /\s+const \[isLightboxOpen, setIsLightboxOpen\] = useState\(false\);\r?\n/,
    "\n"
);
replaceFileContent(
    'apps/web/src/pages/marketplace/ProductDetails.tsx',
    /\s+const nextImage = \(\) => setActiveImage\(\(prev\) => \(prev \+ 1\) % product\.images\.length\);\r?\n/,
    "\n"
);
replaceFileContent(
    'apps/web/src/pages/marketplace/ProductDetails.tsx',
    /\s+const prevImage = \(\) => setActiveImage\(\(prev\) => \(prev - 1 \+ product\.images\.length\) % product\.images\.length\);\r?\n/,
    "\n"
);

// 5. StorePage.tsx
replaceFileContent(
    'apps/web/src/pages/marketplace/StorePage.tsx',
    /\s+Grid,\r?\n/,
    "\n"
);

// 6. AdminPaymentApprovals.tsx
replaceFileContent(
    'apps/web/src/pages/wallet/AdminPaymentApprovals.tsx',
    /\s+FileText,\r?\n\s+ExternalLink,\r?\n\s+Banknote,\r?\n\s+CreditCard,\r?\n\s+MoreVertical,\r?\n/,
    "\n"
);

// 7. DepositFunds.tsx
replaceFileContent(
    'apps/web/src/pages/wallet/DepositFunds.tsx',
    /import { useState, useEffect } from 'react';/,
    "import { useState } from 'react';"
);
replaceFileContent(
    'apps/web/src/pages/wallet/DepositFunds.tsx',
    /\s+ChevronRight,\r?\n/,
    "\n"
);

// 8. WalletDashboard.tsx
replaceFileContent(
    'apps/web/src/pages/wallet/WalletDashboard.tsx',
    /import { useState, useEffect } from 'react';/,
    "import { useState } from 'react';"
);
replaceFileContent(
    'apps/web/src/pages/wallet/WalletDashboard.tsx',
    /import { motion } from 'framer-motion';\r?\n/,
    ""
);

// 9. WithdrawFunds.tsx
replaceFileContent(
    'apps/web/src/pages/wallet/WithdrawFunds.tsx',
    /\s+CreditCard,\r?\n/,
    "\n"
);
replaceFileContent(
    'apps/web/src/pages/wallet/WithdrawFunds.tsx',
    /\s+Plus,\r?\n/,
    "\n"
);
replaceFileContent(
    'apps/web/src/pages/wallet/WithdrawFunds.tsx',
    /\s+LogOut,\r?\n/,
    "\n"
);
replaceFileContent(
    'apps/web/src/pages/wallet/WithdrawFunds.tsx',
    /\s+Smartphone,\r?\n/,
    "\n"
);
