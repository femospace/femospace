import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { Store, StoreSchema } from './schemas/store.schema';
import { Order, OrderSchema } from './schemas/order.schema';
import { Review, ReviewSchema } from './schemas/review.schema';
import { Cart, CartSchema } from './schemas/cart.schema';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { ProductsController } from './products.controller';
import { StoresController } from './stores.controller';
import { CartController } from './cart.controller';
import { OrdersController } from './orders.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: Store.name, schema: StoreSchema },
            { name: Order.name, schema: OrderSchema },
            { name: Review.name, schema: ReviewSchema },
            { name: Cart.name, schema: CartSchema },
        ]),
    ],
    controllers: [
        MarketplaceController,
        ProductsController,
        StoresController,
        CartController,
        OrdersController,
    ],
    providers: [MarketplaceService],
    exports: [MarketplaceService],
})
export class MarketplaceModule { }
