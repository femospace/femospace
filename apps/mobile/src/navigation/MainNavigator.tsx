import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { VideosScreen } from '../screens/VideosScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { MarketplaceScreen } from '../screens/MarketplaceScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { theme } from '../theme';
import { View, StyleSheet, Platform, Image, useColorScheme } from 'react-native';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
    const isDark = useColorScheme() === 'dark' || true; // forcing dark for now as rest of app is dark

    return (
        <View style={styles.container}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: [styles.tabBar, { backgroundColor: isDark ? '#0f172a' : '#ffffff' }],
                    tabBarActiveTintColor: isDark ? theme.colors.primary : '#000',
                    tabBarInactiveTintColor: theme.colors.textMuted,
                    tabBarShowLabel: true,
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontWeight: '600',
                        marginTop: -5,
                        marginBottom: 5,
                    }
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ focused, size }) => (
                            <Image 
                                source={focused || isDark ? require('../../assets/icons/home_dark_mode_icon.png') : require('../../assets/icons/home_light_mode_icon.png')} 
                                style={{ width: size, height: size, tintColor: focused ? theme.colors.primary : theme.colors.textMuted }} 
                                resizeMode="contain"
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Videos"
                    component={VideosScreen}
                    options={{
                        tabBarIcon: ({ focused, size }) => (
                            <Image 
                                source={focused || isDark ? require('../../assets/icons/video_dark_mode_icon.png') : require('../../assets/icons/video_light_mode_icon.png')} 
                                style={{ width: size, height: size, tintColor: focused ? theme.colors.primary : theme.colors.textMuted }} 
                                resizeMode="contain"
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Chat"
                    component={ChatScreen}
                    options={{
                        tabBarIcon: ({ focused, size }) => (
                            <Image 
                                source={focused || isDark ? require('../../assets/icons/massages_dark_mode_icon.png') : require('../../assets/icons/messages_light_mode_icon.png')} 
                                style={{ width: size, height: size, tintColor: focused ? theme.colors.primary : theme.colors.textMuted }} 
                                resizeMode="contain"
                            />
                        ),
                        tabBarBadge: 3,
                        tabBarBadgeStyle: { backgroundColor: theme.colors.danger, color: '#fff', fontSize: 10 }
                    }}
                />
                <Tab.Screen
                    name="Notifications"
                    component={NotificationsScreen}
                    options={{
                        tabBarIcon: ({ focused, size }) => (
                            <Image 
                                source={focused || isDark ? require('../../assets/icons/notification_dark_mode_icon.png') : require('../../assets/icons/notification_light_mode_icon.png')} 
                                style={{ width: size, height: size, tintColor: focused ? theme.colors.primary : theme.colors.textMuted }} 
                                resizeMode="contain"
                            />
                        ),
                        tabBarBadge: 5,
                        tabBarBadgeStyle: { backgroundColor: theme.colors.danger, color: '#fff', fontSize: 10 }
                    }}
                />
                <Tab.Screen
                    name="Marketplace"
                    component={MarketplaceScreen}
                    options={{
                        tabBarIcon: ({ focused, size }) => (
                            <Image 
                                source={focused || isDark ? require('../../assets/icons/marketplace_dark_mode_icon.png') : require('../../assets/icons/marketplace_light_mode_icon.png')} 
                                style={{ width: size, height: size, tintColor: focused ? theme.colors.primary : theme.colors.textMuted }} 
                                resizeMode="contain"
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Menu"
                    component={MenuScreen}
                    options={{
                        tabBarIcon: ({ focused, size }) => (
                            <Image 
                                source={focused || isDark ? require('../../assets/icons/menu_dark_mode_icon.png') : require('../../assets/icons/menu_light_mode_icon.png')} 
                                style={{ width: size, height: size, tintColor: focused ? theme.colors.primary : theme.colors.textMuted }} 
                                resizeMode="contain"
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    tabBar: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        height: Platform.OS === 'ios' ? 88 : 70,
        paddingTop: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
});
