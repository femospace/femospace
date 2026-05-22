import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Heart, MessageCircle, UserPlus, ShoppingBag, Settings, Check } from 'lucide-react-native';
import { theme } from '../theme';

const MOCK_NOTIFICATIONS = [
    { id: '1', type: 'like', user: '@designer_pro', action: 'liked your moment.', time: '2m ago', read: false, avatar: 'https://i.pravatar.cc/150?u=n1' },
    { id: '2', type: 'comment', user: '@dev_lead', action: 'commented: "This architecture is insane!"', time: '15m ago', read: false, avatar: 'https://i.pravatar.cc/150?u=n2' },
    { id: '3', type: 'follow', user: '@crypto_whale', action: 'started following you.', time: '1h ago', read: true, avatar: 'https://i.pravatar.cc/150?u=n3' },
    { id: '4', type: 'marketplace', user: 'System', action: 'Your Digital Asset purchase was successful.', time: '3h ago', read: true, avatar: null },
    { id: '5', type: 'system', user: 'Security', action: 'New login detected on your account.', time: 'Yesterday', read: true, avatar: null },
];

const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'like': return <View style={[styles.iconBg, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}><Heart color={theme.colors.danger} size={16} fill={theme.colors.danger} /></View>;
        case 'comment': return <View style={[styles.iconBg, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}><MessageCircle color={theme.colors.primary} size={16} fill={theme.colors.primary} /></View>;
        case 'follow': return <View style={[styles.iconBg, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}><UserPlus color={theme.colors.success} size={16} /></View>;
        case 'marketplace': return <View style={[styles.iconBg, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}><ShoppingBag color={theme.colors.accent} size={16} /></View>;
        case 'system': return <View style={[styles.iconBg, { backgroundColor: 'rgba(148, 163, 184, 0.2)' }]}><Settings color={theme.colors.textMuted} size={16} /></View>;
        default: return null;
    }
};

const NotificationItem = ({ item }: { item: typeof MOCK_NOTIFICATIONS[0] }) => (
    <TouchableOpacity style={[styles.notificationItem, !item.read && styles.notificationItemUnread]}>
        <View style={styles.avatarContainer}>
            {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, styles.placeholderAvatar]}>
                    <Text style={styles.placeholderText}>{item.user.charAt(0)}</Text>
                </View>
            )}
            <View style={styles.typeIconWrapper}>
                <NotificationIcon type={item.type} />
            </View>
        </View>

        <View style={styles.contentContainer}>
            <Text style={styles.notificationText}>
                <Text style={styles.userName}>{item.user}</Text> {item.action}
            </Text>
            <Text style={[styles.timeText, !item.read && styles.timeTextUnread]}>{item.time}</Text>
        </View>

        {item.type === 'follow' && !item.read && (
            <TouchableOpacity style={styles.followBackBtn}>
                <Text style={styles.followBackText}>Follow</Text>
            </TouchableOpacity>
        )}
    </TouchableOpacity>
);

export const NotificationsScreen = () => {
    const [filter, setFilter] = useState('All');
    const filters = ['All', 'Mentions', 'Orders'];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Notifications</Text>
                <TouchableOpacity style={styles.markReadBtn}>
                    <Check color={theme.colors.primary} size={16} />
                    <Text style={styles.markReadText}>Mark all read</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.filterContainer}>
                {filters.map(f => (
                    <TouchableOpacity 
                        key={f} 
                        style={[styles.filterChip, filter === f && styles.filterChipActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={MOCK_NOTIFICATIONS}
                renderItem={({ item }) => <NotificationItem item={item} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
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
    markReadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    markReadText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: theme.colors.primary,
    },
    filterText: {
        color: theme.colors.textMuted,
        fontWeight: '600',
        fontSize: 14,
    },
    filterTextActive: {
        color: theme.colors.primary,
    },
    listContent: {
        paddingBottom: 100,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.03)',
    },
    notificationItemUnread: {
        backgroundColor: 'rgba(59, 130, 246, 0.03)',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: theme.spacing.md,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    placeholderAvatar: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    typeIconWrapper: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    iconBg: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
        paddingRight: theme.spacing.md,
    },
    notificationText: {
        color: '#cbd5e1',
        fontSize: 14,
        lineHeight: 20,
    },
    userName: {
        color: '#fff',
        fontWeight: '700',
    },
    timeText: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    timeTextUnread: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    followBackBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    followBackText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
