import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, SafeAreaView } from 'react-native';
import { LogIn, UserPlus, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { useTranslation } from 'react-i18next';

export const WelcomeScreen = ({ navigation }: any) => {
    const { t } = useTranslation();

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Navigation */}
            <View style={styles.topNav}>
                <View style={styles.topLeft}>
                    <Image source={require('../../assets/icons/logo_512.png')} style={styles.smallLogo} />
                    <Text style={styles.brandName}>FemoSpace</Text>
                </View>
                <View style={styles.topRight}>
                    <TouchableOpacity style={styles.topNavBtn} onPress={() => navigation.navigate('Login')}>
                        <LogIn color="#fff" size={16} />
                        <Text style={styles.topNavBtnText}>{t('welcome.login', 'Login')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <LinearGradient
                            colors={['#3b82f6', '#2563eb']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.topNavRegisterBtn}
                        >
                            <UserPlus color="#fff" size={16} />
                            <Text style={styles.topNavRegisterBtnText}>{t('welcome.register', 'Register')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                <MotiView
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 800 }}
                    style={styles.logoContainer}
                >
                    <View style={styles.glow} />
                    <Image source={require('../../assets/icons/logo_512.png')} style={styles.bigLogo} />
                </MotiView>

                <MotiText
                    from={{ opacity: 0, translateY: 30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 800, delay: 200 }}
                    style={styles.title}
                >
                    {t('welcome.title', 'Welcome to Femo Space')}
                </MotiText>

                <MotiText
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 800, delay: 400 }}
                    style={styles.subtitle}
                >
                    {t('welcome.tagline', 'Connect, Create, Earn – New Gen Social Experience')}
                </MotiText>

                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 800, delay: 600 }}
                    style={styles.actionButtons}
                >
                    <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginBtnText}>{t('welcome.login', 'Login')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <LinearGradient
                            colors={['#3b82f6', '#2563eb']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.registerBtn}
                        >
                            <Text style={styles.registerBtnText}>{t('welcome.register', 'Register')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </MotiView>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerTextLeft}>{t('footer.copyright', '© 2026 SS Corporate Inc')}</Text>
                
                <View style={styles.footerLinks}>
                    <TouchableOpacity><Text style={styles.footerLink}>{t('footer.contact', 'Contact Us')}</Text></TouchableOpacity>
                    <TouchableOpacity><Text style={styles.footerLink}>{t('footer.terms', 'Terms')}</Text></TouchableOpacity>
                    <TouchableOpacity><Text style={styles.footerLink}>{t('footer.privacy', 'Privacy Policy')}</Text></TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.languageBtn}>
                    <Globe color="#fff" size={14} />
                    <Text style={styles.languageBtnText}>English</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    topNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    topLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallLogo: {
        width: 28,
        height: 28,
        marginRight: 8,
    },
    brandName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    topRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    topNavBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    topNavBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    topNavRegisterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    topNavRegisterBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    glow: {
        position: 'absolute',
        width: 120,
        height: 120,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderRadius: 60,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 10,
    },
    bigLogo: {
        width: 80,
        height: 80,
        zIndex: 1,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: '#fff', // Use white as base color for title, since MaskedView isn't present
        textAlign: 'center',
        lineHeight: 52,
    },
    subtitle: {
        fontSize: 16,
        color: '#cbd5e1',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 40,
        fontWeight: '300',
    },
    actionButtons: {
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        gap: 16,
        width: Platform.OS === 'web' ? 'auto' : '100%',
        alignItems: 'center',
    },
    loginBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        minWidth: 200,
        alignItems: 'center',
    },
    loginBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerBtn: {
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 12,
        minWidth: 200,
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 8,
    },
    registerBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    footerTextLeft: {
        color: '#64748b',
        fontSize: 12,
    },
    footerLinks: {
        flexDirection: 'row',
        gap: 16,
    },
    footerLink: {
        color: '#94a3b8',
        fontSize: 12,
    },
    languageBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    languageBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});
