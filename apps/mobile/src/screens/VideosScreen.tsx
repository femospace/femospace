import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import { Heart, MessageCircle, Share2, MoreVertical, Music, Search, Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

const { height, width } = Dimensions.get('window');
// Calculate the height of the tab bar to adjust the snapping correctly
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 70;
const ITEM_HEIGHT = height - TAB_BAR_HEIGHT;

const MOCK_VIDEOS = [
    {
        id: '1',
        user: '@creator_pro',
        description: 'Testing the new FemoSpace mobile app! This UI is incredibly smooth 🚀 #femospace #mobile',
        song: 'Original Audio - Creator Pro',
        likes: '124K',
        comments: '1,234',
        shares: '4,567',
        avatar: 'https://i.pravatar.cc/150?u=creator1',
        videoColor: '#1e293b' // Placeholder for actual video
    },
    {
        id: '2',
        user: '@design_guru',
        description: 'Dark mode is the only way. Change my mind. 🌙✨ #design #ui',
        song: 'Chill Vibes - LoFi',
        likes: '89K',
        comments: '856',
        shares: '1,200',
        avatar: 'https://i.pravatar.cc/150?u=creator2',
        videoColor: '#0f172a'
    },
    {
        id: '3',
        user: '@crypto_king',
        description: 'Web3 integrated perfectly into social media. 💳💎 #crypto #future',
        song: 'Trending Sound - Viral',
        likes: '250K',
        comments: '3,450',
        shares: '12K',
        avatar: 'https://i.pravatar.cc/150?u=creator3',
        videoColor: '#334155'
    }
];

const VideoItem = ({ item }: { item: typeof MOCK_VIDEOS[0] }) => {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <View style={[styles.videoContainer, { backgroundColor: item.videoColor }]}>
            {/* Mock Video Layer - In production, replace with expo-av Video component */}
            <View style={styles.mockVideoBackground}>
                <Text style={styles.mockVideoText}>Video Render Layer</Text>
            </View>

            {/* Gradient Overlay for Text Readability */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradientOverlay}
            />

            {/* Right Side Actions */}
            <View style={styles.rightActions}>
                <View style={styles.actionItem}>
                    <TouchableOpacity style={styles.avatarContainer}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        <View style={styles.followButton}>
                            <Text style={styles.followButtonText}>+</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.actionItem} onPress={() => setIsLiked(!isLiked)}>
                    <Heart color={isLiked ? theme.colors.danger : '#fff'} size={32} fill={isLiked ? theme.colors.danger : 'transparent'} />
                    <Text style={styles.actionText}>{item.likes}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem}>
                    <MessageCircle color="#fff" size={32} />
                    <Text style={styles.actionText}>{item.comments}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem}>
                    <Share2 color="#fff" size={32} />
                    <Text style={styles.actionText}>{item.shares}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem}>
                    <MoreVertical color="#fff" size={32} />
                </TouchableOpacity>

                <View style={styles.songRecord}>
                    <Music color="#fff" size={16} />
                </View>
            </View>

            {/* Bottom Info Section */}
            <View style={styles.bottomInfo}>
                <Text style={styles.username}>{item.user}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                
                <View style={styles.songRow}>
                    <Music color="#fff" size={14} style={{ marginRight: 6 }} />
                    <Text style={styles.songText}>{item.song}</Text>
                </View>
            </View>
        </View>
    );
};

export const VideosScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            {/* Top Navigation */}
            <View style={styles.topNav}>
                <TouchableOpacity><Search color="#fff" size={24} /></TouchableOpacity>
                <View style={styles.topNavCenter}>
                    <Text style={[styles.topNavText, styles.topNavTextActive]}>For You</Text>
                    <Text style={styles.topNavText}>Following</Text>
                </View>
                <TouchableOpacity onPress={() => navigation?.navigate('Camera')}>
                    <Camera color="#fff" size={24} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={MOCK_VIDEOS}
                renderItem={({ item }) => <VideoItem item={item} />}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                snapToAlignment="start"
                decelerationRate="fast"
                bounces={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    topNav: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        zIndex: 10,
    },
    topNavCenter: {
        flexDirection: 'row',
        gap: theme.spacing.lg,
    },
    topNavText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
        fontWeight: '700',
    },
    topNavTextActive: {
        color: '#fff',
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
        paddingBottom: 4,
    },
    videoContainer: {
        width: width,
        height: ITEM_HEIGHT,
        position: 'relative',
    },
    mockVideoBackground: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mockVideoText: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 250,
    },
    rightActions: {
        position: 'absolute',
        right: 12,
        bottom: 80,
        alignItems: 'center',
        gap: 20,
    },
    actionItem: {
        alignItems: 'center',
    },
    actionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    avatarContainer: {
        marginBottom: 10,
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#fff',
    },
    followButton: {
        position: 'absolute',
        bottom: -8,
        backgroundColor: theme.colors.primary,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    followButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 16,
    },
    songRecord: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        borderWidth: 8,
        borderColor: '#222',
    },
    bottomInfo: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        width: '75%',
    },
    username: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 8,
    },
    description: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
    },
    songRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    songText: {
        color: '#fff',
        fontSize: 14,
    },
});

