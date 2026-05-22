import { Routes, Route } from 'react-router-dom';
import { MarketplaceHome } from './MarketplaceHome';
import { ProductDetails } from './ProductDetails';
import { StorePage } from './StorePage';
import { Cart } from './Cart';
import { Checkout } from './Checkout';
import { MyOrders } from './MyOrders';

export const MarketplaceRoutes = () => {
    return (
        <Routes>
            <Route index element={<MarketplaceHome />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="store/:slug" element={<StorePage />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<MyOrders />} />
        </Routes>
    );
};
