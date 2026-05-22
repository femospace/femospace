import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView, Dimensions } from 'react-native';
import { Search, ShoppingCart, SlidersHorizontal, Star, ShieldCheck } from 'lucide-react-native';
import { theme } from '../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - theme.spacing.lg - theme.spacing.sm;

const CATEGORIES = ['All', 'Digital Art', 'Freelance Services', '3D Models', 'Music', 'Courses'];

const MOCK_PRODUCTS = [
    { id: '1', title: 'Cyberpunk UI Kit', price: '$45.00', rating: 4.8, seller: '@design_guru', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=300&auto=format&fit=crop', isDigital: true },
    { id: '2', title: 'Custom 3D Avatar', price: '$120.00', rating: 5.0, seller: '@meta_creator', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop', isDigital: true },
    { id: '3', title: 'Lo-Fi Beats Pack Vol. 2', price: '$15.00', rating: 4.9, seller: '@lofi_beats', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop', isDigital: true },
    { id: '4', title: 'React Native Consultancy', price: '$80/hr', rating: 4.7, seller: '@dev_pro', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=300&auto=format&fit=crop', isDigital: false },
    { id: '5', title: 'Abstract Wallpaper Pack', price: '$5.00', rating: 4.5, seller: '@artist_x', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300&auto=format&fit=crop', isDigital: true },
    { id: '6', title: 'Smart Contract Audit', price: '$500.00', rating: 5.0, seller: '@web3_sec', image: 'https://images.unsplash.com/photo-1639762681485-074b7f4aec63?q=80&w=300&auto=format&fit=crop', isDigital: false },
];

const ProductCard = ({ item }: { item: typeof MOCK_PRODUCTS[0] }) => (
    <TouchableOpacity style={styles.card}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.priceTag}>
                <Text style={styles.priceText}>{item.price}</Text>
            </View>
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.sellerName}>{item.seller}</Text>
            <View style={styles.cardFooter}>
                <View style={styles.ratingContainer}>
                    <Star color={theme.colors.accent} size={14} fill={theme.colors.accent} />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                {item.isDigital && (
                    <View style={styles.secureBadge}>
                        <ShieldCheck color={theme.colors.success} size={12} />
                    </View>
                )}
            </View>
        </View>
    </TouchableOpacity>
);

export const MarketplaceScreen = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Marketplace</Text>
                <TouchableOpacity style={styles.cartButton}>
                    <ShoppingCart color="#fff" size={24} />
                    <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>2</Text></View>
                </TouchableOpacity>
            </View>

            {/* Search & Filter */}
            <View style={styles.searchSection}>
                <View style={styles.searchBox}>
                    <Search color={theme.colors.textMuted} size={20} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search digital assets & services"
                        placeholderTextColor={theme.colors.textMuted}
                    />
                </View>
                <TouchableOpacity style={styles.filterButton}>
                    <SlidersHorizontal color="#fff" size={20} />
                </TouchableOpacity>
            </View>

            {/* Categories */}
            <View style={styles.categoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.categoryBadge, activeCategory === cat && styles.categoryBadgeActive]}
                            onPress={() => setActiveCategory(cat)}
                        >
                            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Products Grid */}
            <FlatList
                data={MOCK_PRODUCTS}
                renderItem={({ item }) => <ProductCard item={item} />}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 60,
        paddingBottom: theme.spacing.md,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 0.5,
    },
    cartButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: theme.colors.primary,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    searchSection: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: theme.borderRadius.xl,
        paddingHorizontal: theme.spacing.md,
        height: 48,
    },
    searchInput: {
        flex: 1,
        marginLeft: theme.spacing.sm,
        color: '#fff',
        fontSize: 14,
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: theme.borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoriesContainer: {
        marginBottom: theme.spacing.md,
        height: 36,
    },
    categoryBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoryBadgeActive: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // primary with opacity
        borderColor: theme.colors.primary,
    },
    categoryText: {
        color: theme.colors.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    categoryTextActive: {
        color: theme.colors.primary,
    },
    listContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 100,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: theme.spacing.lg,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    imageContainer: {
        position: 'relative',
        height: CARD_WIDTH,
        width: '100%',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    priceTag: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backdropFilter: 'blur(4px)',
    },
    priceText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    cardContent: {
        padding: 12,
    },
    productTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
        lineHeight: 20,
    },
    sellerName: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    secureBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        padding: 4,
        borderRadius: 8,
    },
});
