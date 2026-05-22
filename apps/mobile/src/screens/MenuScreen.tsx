import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Wallet, Settings, ShieldCheck, ChevronRight, User, Sparkles, CreditCard, Video, Briefcase, LogOut } from 'lucide-react-native';
import { theme } from '../theme';

const MENU_ITEMS = [
    { id: 'profile', icon: User, label: 'My Profile', route: 'Profile' },
    { id: 'wallet', icon: Wallet, label: 'Wallet Dashboard', route: 'Wallet', badge: 'Active' },
    { id: 'monetization', icon: Sparkles, label: 'Monetization & Ads', route: 'Monetization' },
    { id: 'creator', icon: Video, label: 'Creator Studio', route: 'Creator' },
    { id: 'business', icon: Briefcase, label: 'Business Suite', route: 'Business' },
    { id: 'kyc', icon: ShieldCheck, label: 'KYC Verification', route: 'KYC', badge: 'Verified', badgeColor: theme.colors.success },
    { id: 'vip', icon: CreditCard, label: 'VIP Subscription', route: 'VIP' },
    { id: 'settings', icon: Settings, label: 'Settings & Privacy', route: 'Settings' },
];

export const MenuScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Menu</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* User Info Card */}
                <TouchableOpacity style={styles.userCard} onPress={() => navigation?.navigate('Profile')}>
                    <Image source={{ uri: 'https://i.pravatar.cc/150?u=a3' }} style={styles.avatar} />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>Alex Femo</Text>
                        <Text style={styles.userHandle}>@alex_femo</Text>
                    </View>
                    <ChevronRight color={theme.colors.textMuted} size={24} />
                </TouchableOpacity>

                <View style={styles.walletPreview}>
                    <View>
                        <Text style={styles.walletLabel}>Femo Balance</Text>
                        <Text style={styles.walletAmount}>$1,245.50</Text>
                    </View>
                    <TouchableOpacity style={styles.depositBtn}>
                        <Text style={styles.depositBtnText}>Deposit</Text>
                    </TouchableOpacity>
                </View>

                {/* Menu List */}
                <View style={styles.menuContainer}>
                    {MENU_ITEMS.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.menuItem}>
                            <View style={styles.menuIconContainer}>
                                <item.icon color="#fff" size={20} />
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            {item.badge && (
                                <View style={[styles.badge, { backgroundColor: item.badgeColor || theme.colors.primary }]}>
                                    <Text style={styles.badgeText}>{item.badge}</Text>
                                </View>
                            )}
                            <ChevronRight color={theme.colors.textMuted} size={20} style={{ marginLeft: item.badge ? 8 : 'auto' }} />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation?.navigate('Welcome')}>
                    <LogOut color={theme.colors.danger} size={20} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
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
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 100,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: theme.spacing.md,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    userHandle: {
        color: theme.colors.textMuted,
        fontSize: 14,
        marginTop: 2,
    },
    walletPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
        marginBottom: theme.spacing.xl,
    },
    walletLabel: {
        color: theme.colors.textMuted,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    walletAmount: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        marginTop: 4,
    },
    depositBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    depositBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    menuContainer: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
        marginBottom: theme.spacing.xl,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    menuLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    logoutText: {
        color: theme.colors.danger,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: theme.spacing.sm,
    },
});
