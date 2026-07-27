import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Globe, X, Search, Check } from 'lucide-react-native';
import { LANGUAGES, getPopularLanguages, searchLanguages, type Language } from '../data/languages';

interface LanguageSelectorProps {
    visible: boolean;
    onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ visible, onClose }) => {
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLanguages, setFilteredLanguages] = useState<Language[]>([]);

    const popularLanguages = getPopularLanguages();
    const allLanguages = LANGUAGES;
    const currentLanguage = i18n.language;

    useEffect(() => {
        if (searchQuery.trim()) {
            setFilteredLanguages(searchLanguages(searchQuery));
        } else {
            setFilteredLanguages([]);
        }
    }, [searchQuery]);

    const handleLanguageChange = async (languageCode: string) => {
        await i18n.changeLanguage(languageCode);
        onClose();
    };

    const handleSwitchToEnglish = () => {
        if (currentLanguage !== 'en') {
            handleLanguageChange('en');
        }
    };

    const displayLanguages = searchQuery.trim() ? filteredLanguages : allLanguages;
    const showPopular = !searchQuery.trim();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Globe color="#fff" size={24} />
                            <Text style={styles.title}>{t('selector.title', 'Choose a Language')}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#94a3b8" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Search color="#94a3b8" size={20} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={t('selector.searchPlaceholder', 'Search languages...')}
                            placeholderTextColor="#64748b"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <X color="#94a3b8" size={20} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Quick Switch to English */}
                    {currentLanguage !== 'en' && (
                        <TouchableOpacity style={styles.quickSwitch} onPress={handleSwitchToEnglish}>
                            <Text style={styles.quickSwitchEmoji}>🇬🇧</Text>
                            <Text style={styles.quickSwitchText}>{t('welcome.switchToEnglish', 'Switch to English')}</Text>
                        </TouchableOpacity>
                    )}

                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                        {/* Popular Languages */}
                        {showPopular && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>{t('selector.popular', 'Popular Languages')}</Text>
                                <View style={styles.grid}>
                                    {popularLanguages.map((lang) => (
                                        <TouchableOpacity
                                            key={lang.code}
                                            style={[styles.languageItem, currentLanguage === lang.code && styles.activeItem]}
                                            onPress={() => handleLanguageChange(lang.code)}
                                        >
                                            <Text style={[styles.languageName, currentLanguage === lang.code && styles.activeText]}>
                                                {lang.name}
                                            </Text>
                                            {currentLanguage === lang.code && <Check color="#3b82f6" size={16} />}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* All Languages / Search Results */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                {searchQuery.trim()
                                    ? t('selector.results', { count: displayLanguages.length, defaultValue: `Results (${displayLanguages.length})` })
                                    : t('selector.all', 'All Languages')}
                            </Text>
                            
                            {displayLanguages.length > 0 ? (
                                <View style={styles.list}>
                                    {displayLanguages.map((lang) => (
                                        <TouchableOpacity
                                            key={lang.code}
                                            style={[styles.listItem, currentLanguage === lang.code && styles.activeItem]}
                                            onPress={() => handleLanguageChange(lang.code)}
                                        >
                                            <View style={styles.listInfo}>
                                                <Text style={[styles.languageName, currentLanguage === lang.code && styles.activeText]}>
                                                    {lang.name}
                                                </Text>
                                                <Text style={styles.englishName}>{lang.englishName}</Text>
                                            </View>
                                            {currentLanguage === lang.code && <Check color="#3b82f6" size={20} />}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.noResults}>
                                    <Text style={styles.noResultsText}>
                                        {t('selector.noResults', { query: searchQuery, defaultValue: `No languages found matching "${searchQuery}"` })}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            {t('selector.footer', 'Language changes apply instantly across all pages')}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#1e293b',
        marginTop: Platform.OS === 'ios' ? 40 : 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        marginHorizontal: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        marginLeft: 12,
        marginRight: 12,
        outlineStyle: 'none',
    },
    quickSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3b82f620',
        marginHorizontal: 24,
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#3b82f650',
    },
    quickSwitchEmoji: {
        fontSize: 24,
        marginRight: 12,
    },
    quickSwitchText: {
        color: '#60a5fa',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#334155',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: '47%',
        flex: 1,
    },
    activeItem: {
        backgroundColor: '#3b82f620',
        borderColor: '#3b82f6',
        borderWidth: 1,
    },
    languageName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    activeText: {
        color: '#60a5fa',
    },
    list: {
        backgroundColor: '#0f172a',
        borderRadius: 16,
        overflow: 'hidden',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
    },
    listInfo: {
        flex: 1,
    },
    englishName: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 4,
    },
    noResults: {
        padding: 24,
        alignItems: 'center',
    },
    noResultsText: {
        color: '#64748b',
        fontSize: 16,
        textAlign: 'center',
    },
    footer: {
        padding: 20,
        backgroundColor: '#0f172a',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#334155',
    },
    footerText: {
        color: '#64748b',
        fontSize: 12,
    },
});
