import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, SafeAreaView, Platform } from 'react-native';
import { Sparkles, Image as ImageIcon } from 'lucide-react-native';

export const HomeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Top Navigation */}
            <View style={styles.topNav}>
                <View style={styles.topLeft}>
                    <Image source={require('../../assets/icons/logo_512.png')} style={styles.navLogo} />
                    <Text style={styles.navBrand}>FemoSpace</Text>
                </View>
                <View style={styles.searchContainer}>
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Search Users, Pages, Groups..."
                        placeholderTextColor="#94a3b8"
                    />
                </View>
                <Image source={{ uri: 'https://i.pravatar.cc/150?u=a3' }} style={styles.navAvatar} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity style={styles.tabActive}>
                        <Sparkles color="#fff" size={16} />
                        <Text style={styles.tabTextActive}>For You</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Following</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Trending</Text>
                    </TouchableOpacity>
                </View>

                {/* Create Post Input */}
                <View style={styles.createPostCard}>
                    <View style={styles.createPostInputWrapper}>
                        <Image source={{ uri: 'https://i.pravatar.cc/150?u=a3' }} style={styles.createPostAvatar} />
                        <Text style={styles.createPostPlaceholder}>What's happening in your space, Ushan?</Text>
                    </View>
                </View>

                {/* Welcome Card */}
                <View style={styles.welcomeCard}>
                    <View style={styles.welcomeIconContainer}>
                        <Sparkles color="#3b82f6" size={32} />
                    </View>
                    <Text style={styles.welcomeTitle}>Welcome to your new space!</Text>
                    <Text style={styles.welcomeSubtitle}>This is where your universe lives. Post something above to see it saved here forever.</Text>
                    
                    <TouchableOpacity style={styles.startPostingBtn}>
                        <Text style={styles.startPostingText}>Start Posting</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.proTipContainer}>
                        <Text style={styles.proTipTitle}>🏆 PRO TIP: 🚀</Text>
                        <Text style={styles.proTipText}>You can share photos, videos, and even AI-generated thoughts. Everything you post is securely saved to your FEMO SPACE account.</Text>
                    </View>
                </View>

                {/* Who to Follow Widget (Adapted for mobile) */}
                <View style={styles.widgetCard}>
                    <Text style={styles.widgetTitle}>WHO TO FOLLOW</Text>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={styles.followItem}>
                            <View style={styles.followAvatar} />
                            <View style={styles.followInfo}>
                                <Text style={styles.followName}>TrendSetter_{i}</Text>
                                <Text style={styles.followHandle}>@creator_{i}</Text>
                            </View>
                            <TouchableOpacity style={styles.followAddBtn}>
                                <Text style={styles.followAddText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity>
                        <Text style={styles.showMoreText}>Show more</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    topNav: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    topLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    navLogo: {
        width: 32,
        height: 32,
        marginRight: 8,
    },
    navBrand: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    searchContainer: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        borderRadius: 20,
        paddingHorizontal: 16,
        height: 40,
        justifyContent: 'center',
        marginRight: 16,
    },
    searchInput: {
        fontSize: 14,
        color: '#334155',
    },
    navAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 4,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    tabActive: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4f46e5',
        borderRadius: 20,
        paddingVertical: 10,
        gap: 6,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    tabTextActive: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    tabText: {
        color: '#64748b',
        fontWeight: '600',
        fontSize: 14,
    },
    createPostCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    createPostInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    createPostAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    createPostPlaceholder: {
        color: '#94a3b8',
        fontSize: 16,
    },
    welcomeCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    welcomeIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 8,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    startPostingBtn: {
        backgroundColor: '#0f172a',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 24,
        marginBottom: 32,
    },
    startPostingText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    proTipContainer: {
        backgroundColor: '#fffbf1',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fef08a',
        alignSelf: 'stretch',
    },
    proTipTitle: {
        fontWeight: 'bold',
        color: '#ca8a04',
        marginBottom: 8,
    },
    proTipText: {
        color: '#a16207',
        fontSize: 12,
        lineHeight: 18,
    },
    widgetCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    widgetTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 16,
        letterSpacing: 1,
    },
    followItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    followAvatar: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#e2e8f0',
        marginRight: 12,
    },
    followInfo: {
        flex: 1,
    },
    followName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    followHandle: {
        fontSize: 12,
        color: '#64748b',
    },
    followAddBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    followAddText: {
        color: '#3b82f6',
        fontSize: 20,
        fontWeight: '300',
        marginTop: -2,
    },
    showMoreText: {
        color: '#3b82f6',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 8,
    },
});
