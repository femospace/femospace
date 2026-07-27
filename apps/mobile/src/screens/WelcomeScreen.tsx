import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, SafeAreaView, Dimensions } from 'react-native';
import { LogIn, UserPlus, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { useTranslation } from 'react-i18next';
import MaskedView from '@react-native-masked-view/masked-view';
import { LanguageSelector } from '../components/LanguageSelector';
import { ContactModal } from '../components/ContactModal';
import { LANGUAGES } from '../data/languages';

const { width, height } = Dimensions.get('window');

const Particle = ({ color, size, initialX, initialY, delay }: any) => {
    return (
        <MotiView
            from={{ translateX: initialX, translateY: initialY, opacity: 0.1 }}
            animate={{ 
                translateX: [initialX - 30, initialX + 30, initialX], 
                translateY: [initialY - 30, initialY + 30, initialY],
                opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
                loop: true,
                type: 'timing',
                duration: 6000 + Math.random() * 3000,
                delay: delay,
            }}
            style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                shadowColor: color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: size / 2,
                elevation: 10,
            }}
        />
    );
}

const AnimatedBackground = () => {
    return (
        <View style={StyleSheet.absoluteFillObject}>
            <Particle color="#4a90e2" size={60} initialX={width * 0.2} initialY={height * 0.2} delay={0} />
            <Particle color="#a855f7" size={80} initialX={width * 0.8} initialY={height * 0.4} delay={1000} />
            <Particle color="#3b82f6" size={50} initialX={width * 0.3} initialY={height * 0.7} delay={2000} />
            <Particle color="#4a90e2" size={40} initialX={width * 0.7} initialY={height * 0.8} delay={1500} />
            <Particle color="#a855f7" size={70} initialX={width * 0.1} initialY={height * 0.5} delay={500} />
        </View>
    );
};

const GradientText = (props: any) => {
    if (Platform.OS === 'web') {
        return (
            <Text
                {...props}
                style={[
                    props.style,
                    {
                        backgroundImage: 'linear-gradient(to right, #60a5fa, #c084fc, #60a5fa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    } as any
                ]}
            />
        );
    }
    return (
        <MaskedView
            style={{ height: 120, width: '100%', flexDirection: 'row' }}
            maskElement={
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={props.style}>{props.children}</Text>
                </View>
            }
        >
            <LinearGradient
                colors={['#60a5fa', '#c084fc', '#60a5fa']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
            />
        </MaskedView>
    );
};

export const WelcomeScreen = ({ navigation }: any) => {
    const { t, i18n } = useTranslation();
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    const currentLang = LANGUAGES.find((lang) => lang.code === i18n.language) ||
        LANGUAGES.find((lang) => lang.code === i18n.language.split('-')[0]);

    return (
        <SafeAreaView style={styles.container}>
            <AnimatedBackground />
            
            {/* Top Navigation */}
            <View style={styles.topNav}>
                <View style={styles.topLeft}>
                    <Image source={require('../../assets/icons/logo_512.png')} style={styles.smallLogo} />
                    <Text style={styles.brandName}>Femo Space</Text>
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
                    <Image source={require('../../assets/icons/logo_512.png')} style={styles.bigLogo} />
                </MotiView>

                <MotiView
                    from={{ opacity: 0, translateY: 30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 800, delay: 200 }}
                    style={styles.titleContainer}
                >
                    <GradientText style={styles.title}>
                        {t('welcome.title', 'Welcome to Femo Space')}
                    </GradientText>
                </MotiView>

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
                    <TouchableOpacity onPress={() => setShowContactModal(true)}>
                        <Text style={styles.footerLink}>{t('footer.contact', 'Contact Us')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Legal', { type: 'terms' })}>
                        <Text style={styles.footerLink}>{t('footer.terms', 'Terms')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Legal', { type: 'privacy' })}>
                        <Text style={styles.footerLink}>{t('footer.privacy', 'Privacy Policy')}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.languageBtn} onPress={() => setShowLanguageSelector(true)}>
                    <Globe color="#fff" size={14} />
                    <Text style={styles.languageBtnText}>{currentLang ? currentLang.name : 'English'}</Text>
                </TouchableOpacity>
            </View>

            <LanguageSelector 
                visible={showLanguageSelector} 
                onClose={() => setShowLanguageSelector(false)} 
            />

            <ContactModal
                visible={showContactModal}
                onClose={() => setShowContactModal(false)}
                navigation={navigation}
            />
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
        zIndex: 10,
    },
    topLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallLogo: {
        width: 32,
        height: 32,
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
        zIndex: 10,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    bigLogo: {
        width: 80,
        height: 80,
    },
    titleContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: width > 400 ? 56 : 48,
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 60,
    },
    subtitle: {
        fontSize: 18,
        color: '#cbd5e1',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 40,
        fontWeight: '300',
        paddingHorizontal: 20,
    },
    actionButtons: {
        flexDirection: width > 400 ? 'row' : 'column',
        gap: 16,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 40,
        paddingVertical: 16,
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
        paddingVertical: 16,
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
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        zIndex: 10,
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
