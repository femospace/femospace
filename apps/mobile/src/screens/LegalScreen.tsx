import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react-native';

export const LegalScreen = ({ route, navigation }: any) => {
    const { type } = route.params || { type: 'terms' };
    const { t } = useTranslation();

    const title = type === 'terms' ? t('legal.termsTitle', 'Terms & Conditions') :
        type === 'privacy' ? t('legal.privacyTitle', 'Privacy Policy') :
            'Help Center';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.meta}>
                    {t('legal.lastUpdated', 'Last Updated')}: {new Date().toLocaleDateString()}  •  v1.0.0
                </Text>

                {type === 'terms' ? (
                    <View>
                        <Text style={styles.h2}>Terms of Service</Text>
                        <Text style={styles.p}>Welcome to Femo Space. By accessing or using our platform, you agree to be bound by these Terms of Service.</Text>
                        <Text style={styles.h3}>1. Acceptance of Terms</Text>
                        <Text style={styles.p}>By accessing or using our services, you confirm that you accept these terms and conditions.</Text>
                        <Text style={styles.h3}>2. User Conduct</Text>
                        <Text style={styles.p}>You agree to use Femo Space only for lawful purposes and properly.</Text>
                        <Text style={styles.h3}>3. Content</Text>
                        <Text style={styles.p}>Users are responsible for the content they post on Femo Space.</Text>
                    </View>
                ) : (
                    <View>
                        <Text style={styles.h2}>Privacy Policy</Text>
                        <Text style={styles.p}>Your privacy is important to us. This policy explains how we collect, use, and protect your data.</Text>
                        <Text style={styles.h3}>1. Information Collection</Text>
                        <Text style={styles.p}>We collect information you provide directly to us, such as when you create an account.</Text>
                        <Text style={styles.h3}>2. Data Usage</Text>
                        <Text style={styles.p}>We use your data to provide and improve our services.</Text>
                        <Text style={styles.h3}>3. Data Protection</Text>
                        <Text style={styles.p}>We implement security measures to protect your personal information.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        backgroundColor: '#1e293b',
    },
    backBtn: {
        padding: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    meta: {
        color: '#94a3b8',
        fontSize: 12,
        marginBottom: 20,
    },
    h2: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    h3: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 8,
    },
    p: {
        color: '#cbd5e1',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 12,
    }
});
