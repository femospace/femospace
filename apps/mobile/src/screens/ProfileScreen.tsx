import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Settings, PlusCircle, Edit3, Grid, List, Bookmark, ShieldCheck, Zap } from 'lucide-react-native';
import { theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Header Background */}
                <View style={styles.headerBackground}>
                    <LinearGradient
                        colors={['rgba(59, 130, 246, 0.2)', 'transparent']}
                        style={styles.headerGradient}
                    />
                </View>

                {/* Profile Stats Overview */}
                <View style={styles.profileInfo}>
                    <View style={styles.avatarBorder}>
                        <Image source={{ uri: 'https://i.pravatar.cc/200?u=alex' }} style={styles.avatar} />
                        <View style={styles.badgeContainer}>
                            <ShieldCheck color="#3b82f6" size={20} />
                        </View>
                    </View>

                    <View style={styles.baseInfo}>
                        <Text style={styles.username}>@alex_femo</Text>
                        <View style={styles.metaRow}>
                            <Zap color={theme.colors.accent} size={14} />
                            <Text style={styles.statusText}>VIP Level 4</Text>
                        </View>
                        <Text style={styles.bio}>Digital Architect & Ecosystem Modeler. Building the next generation of social identity systems. #femoonline</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>12.4K</Text>
                            <Text style={styles.statLabel}>Syncs</Text>
                        </View>
                        <View style={[styles.statItem, styles.statDivider]}>
                            <Text style={styles.statValue}>8.1K</Text>
                            <Text style={styles.statLabel}>Network</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>245</Text>
                            <Text style={styles.statLabel}>Insights</Text>
                        </View>
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.primaryAction}>
                            <Text style={styles.primaryActionText}>Edit Protocol</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryAction}>
                            <Settings color="#fff" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tab Selection */}
                <View style={styles.tabs}>
                    <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                        <Grid color="#3b82f6" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <List color={theme.colors.textMuted} size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Bookmark color={theme.colors.textMuted} size={24} />
                    </TouchableOpacity>
                </View>

                {/* Post Grid (Placeholder) */}
                <View style={styles.postGrid}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <View key={i} style={styles.gridItem}>
                            <View style={styles.imagePlaceholder}>
                                <Grid color="rgba(255,255,255,0.05)" size={40} />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    headerBackground: {
        height: 180,
        backgroundColor: '#0a0f18',
    },
    headerGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    profileInfo: {
        paddingHorizontal: theme.spacing.xl,
        marginTop: -60,
        alignItems: 'center',
    },
    avatarBorder: {
        width: 120,
        height: 120,
        borderRadius: 44,
        borderWidth: 4,
        borderColor: theme.colors.background,
        backgroundColor: '#1e293b',
        padding: 2,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
    },
    badgeContainer: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: theme.colors.background,
        borderRadius: 14,
        padding: 4,
        borderWidth: 2,
        borderColor: '#3b82f6',
    },
    baseInfo: {
        alignItems: 'center',
        marginTop: theme.spacing.lg,
    },
    username: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 1,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    statusText: {
        fontSize: 12,
        color: theme.colors.accent,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    bio: {
        fontSize: 14,
        color: theme.colors.textMuted,
        textAlign: 'center',
        lineHeight: 20,
        marginTop: theme.spacing.md,
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 24,
        marginTop: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        width: '100%',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statDivider: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#fff',
    },
    statLabel: {
        fontSize: 10,
        color: theme.colors.textMuted,
        fontWeight: '800',
        textTransform: 'uppercase',
        marginTop: 2,
        letterSpacing: 1,
    },
    actionRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginTop: 24,
        width: '100%',
    },
    primaryAction: {
        flex: 1,
        height: 52,
        backgroundColor: '#fff',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryActionText: {
        color: '#000',
        fontSize: 15,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    secondaryAction: {
        width: 52,
        height: 52,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    tabs: {
        flexDirection: 'row',
        marginTop: 32,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#3b82f6',
    },
    postGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 1,
    },
    gridItem: {
        width: width / 3 - 2,
        height: width / 3 - 2,
        margin: 1,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    imagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
