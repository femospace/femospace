import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { Search, Plus, MessageCircle, Bot, Mic, CheckCheck } from 'lucide-react-native';
import { theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const MOCK_CHATS = [
    { id: '1', name: 'FemoSpace AI', lastMessage: 'Here is the code snippet you requested...', time: '10:42 AM', unread: 0, isBot: true, avatar: 'https://i.pravatar.cc/150?u=bot' },
    { id: '2', name: 'Elena Rodriguez', lastMessage: 'Voice message (0:45)', time: '09:15 AM', unread: 3, isVoice: true, avatar: 'https://i.pravatar.cc/150?u=user1' },
    { id: '3', name: 'Dev Team Alpha', lastMessage: 'Alex: The new UI looks stunning! 🚀', time: 'Yesterday', unread: 0, isGroup: true, avatar: 'https://i.pravatar.cc/150?u=group1' },
    { id: '4', name: 'Marketplace Buyer', lastMessage: 'Are you available for a custom order?', time: 'Yesterday', unread: 1, avatar: 'https://i.pravatar.cc/150?u=buyer' },
    { id: '5', name: 'Sarah Connor', lastMessage: 'Let\'s catch up this weekend.', time: 'Monday', unread: 0, avatar: 'https://i.pravatar.cc/150?u=user2' },
];

const ChatItem = ({ item }: { item: typeof MOCK_CHATS[0] }) => (
    <TouchableOpacity style={styles.chatItem}>
        <View style={styles.avatarContainer}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            {item.isBot && (
                <View style={styles.botBadge}>
                    <Bot color="#fff" size={10} />
                </View>
            )}
            <View style={styles.onlineIndicator} />
        </View>

        <View style={styles.chatContent}>
            <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={[styles.chatTime, item.unread > 0 && styles.chatTimeUnread]}>{item.time}</Text>
            </View>
            <View style={styles.chatFooter}>
                <View style={styles.lastMessageContainer}>
                    {item.isVoice && <Mic color={theme.colors.textMuted} size={14} style={{ marginRight: 4 }} />}
                    {!item.unread && !item.isVoice && <CheckCheck color={theme.colors.primary} size={14} style={{ marginRight: 4 }} />}
                    <Text style={[styles.lastMessage, item.unread > 0 && styles.lastMessageUnread]} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                </View>
                {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                )}
            </View>
        </View>
    </TouchableOpacity>
);

export const ChatScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Messages</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton}>
                        <MessageCircle color="#fff" size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Search color={theme.colors.textMuted} size={20} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search messages or users"
                        placeholderTextColor={theme.colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Stories / Active Users (Horizontal) */}
            <View style={styles.activeUsersContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={MOCK_CHATS.filter(c => !c.isGroup)}
                    keyExtractor={(item) => 'active-' + item.id}
                    renderItem={({ item }) => (
                        <View style={styles.activeUser}>
                            <View style={styles.activeAvatarWrapper}>
                                <Image source={{ uri: item.avatar }} style={styles.activeAvatar} />
                                <View style={styles.onlineDot} />
                            </View>
                            <Text style={styles.activeUserName} numberOfLines={1}>{item.name.split(' ')[0]}</Text>
                        </View>
                    )}
                    contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
                />
            </View>

            {/* Chat List */}
            <FlatList
                data={MOCK_CHATS}
                renderItem={({ item }) => <ChatItem item={item} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
                <LinearGradient
                    colors={['#3b82f6', '#6366f1']}
                    style={styles.fabGradient}
                >
                    <Plus color="#fff" size={24} />
                </LinearGradient>
            </TouchableOpacity>
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
    headerActions: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    searchBox: {
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
        fontSize: 16,
    },
    activeUsersContainer: {
        marginBottom: theme.spacing.lg,
    },
    activeUser: {
        alignItems: 'center',
        marginRight: theme.spacing.md,
        width: 60,
    },
    activeAvatarWrapper: {
        position: 'relative',
        marginBottom: 6,
    },
    activeAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: theme.colors.success,
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    activeUserName: {
        color: theme.colors.textMuted,
        fontSize: 12,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 100,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: theme.spacing.md,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    botBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: theme.colors.secondary,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.success,
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    chatContent: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        paddingBottom: theme.spacing.md,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    chatName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    chatTime: {
        color: theme.colors.textMuted,
        fontSize: 12,
    },
    chatTimeUnread: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    chatFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: theme.spacing.md,
    },
    lastMessage: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    lastMessageUnread: {
        color: '#fff',
        fontWeight: '600',
    },
    unreadBadge: {
        backgroundColor: theme.colors.primary,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        elevation: 5,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    fabGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
