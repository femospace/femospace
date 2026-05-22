import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Store, StoreDocument } from './schemas/store.schema';
import { Order, OrderDocument } from './schemas/order.schema';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class MarketplaceService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    ) { }

    // --- PRODUCTS ---
    async createProduct(storeId: string, sellerId: string, data: Partial<Product>): Promise<Product> {
        const newProduct = new this.productModel({
            ...data,
            storeId: new Types.ObjectId(storeId),
            sellerId: new Types.ObjectId(sellerId),
        });
        return newProduct.save();
    }

    async findProducts(filters: any = {}, sort: any = { createdAt: -1 }, limit: number = 20, skip: number = 0) {
        const products = await this.productModel
            .find(filters)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .populate('storeId', 'name logoUrl')
            .exec();

        const count = await this.productModel.countDocuments(filters);
        return { products, total: count };
    }

    async findProductById(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).populate('storeId').exec();
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    // --- STORES ---
    async createStore(ownerId: string, data: Partial<Store>): Promise<Store> {
        const slug = (data.name || 'store').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const newStore = new this.storeModel({
            ...data,
            ownerId: new Types.ObjectId(ownerId),
            slug,
        });
        return newStore.save();
    }

    async getStoreByOwner(ownerId: string): Promise<Store | null> {
        return this.storeModel.findOne({ ownerId: new Types.ObjectId(ownerId) }).exec();
    }

    async getStoreBySlug(slug: string): Promise<Store | null> {
        return this.storeModel.findOne({ slug }).exec();
    }

    // --- CART ---
    async getCart(userId: string): Promise<Cart> {
        let cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
        if (!cart) {
            cart = new this.cartModel({ userId: new Types.ObjectId(userId), items: [] });
            await cart.save();
        }
        return cart;
    }

    async addToCart(userId: string, productId: string, quantity: number = 1, affiliateId?: string) {
        const cart = await this.getCart(userId);
        const existingIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += quantity;
        } else {
            cart.items.push({
                productId: new Types.ObjectId(productId),
                quantity,
                affiliateId: affiliateId ? new Types.ObjectId(affiliateId) : undefined,
            } as any);
        }

        return (cart as any).save();
    }

    async updateCartItem(userId: string, productId: string, quantity: number) {
        const cart = await this.getCart(userId);
        const index = cart.items.findIndex(item => item.productId.toString() === productId);

        if (index > -1) {
            if (quantity <= 0) {
                cart.items.splice(index, 1);
            } else {
                cart.items[index].quantity = quantity;
            }
            return (cart as any).save();
        }
        throw new NotFoundException('Item not in cart');
    }

    // --- ORDERS ---
    async createOrder(buyerId: string, data: any): Promise<Order> {
        const newOrder = new this.orderModel({
            ...data,
            buyerId: new Types.ObjectId(buyerId),
        });
        return newOrder.save();
    }

    async getBuyerOrders(buyerId: string) {
        return this.orderModel.find({ buyerId: new Types.ObjectId(buyerId) }).sort({ createdAt: -1 }).exec();
    }

    async getSellerOrders(sellerId: string) {
        return this.orderModel.find({ sellerId: new Types.ObjectId(sellerId) }).sort({ createdAt: -1 }).exec();
    }

    // --- REVIEWS ---
    async addReview(userId: string, data: Partial<Review>): Promise<Review> {
        const newReview = new this.reviewModel({
            ...data,
            userId: new Types.ObjectId(userId),
        });

        const saved = await newReview.save();

        // Update target rating (agg count usually done in background, but simple here)
        // For brevity, skipping the full rating aggregation logic for now

        return saved;
    }
}
