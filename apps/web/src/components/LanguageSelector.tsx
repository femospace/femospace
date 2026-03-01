import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    LANGUAGES,
    getPopularLanguages,
    getAllLanguages,
    searchLanguages,
    isRTL,
    type Language,
} from '../data/languages';
import './LanguageSelector.css';

interface LanguageSelectorProps {
    onClose?: () => void;
    mode?: 'modal' | 'popover';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    onClose,
    mode = 'modal',
}) => {
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLanguages, setFilteredLanguages] = useState<Language[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const currentLanguage = i18n.language;
    const popularLanguages = getPopularLanguages();
    const allLanguages = getAllLanguages();

    useEffect(() => {
        setIsVisible(true);
        // Auto-focus search input
        setTimeout(() => searchInputRef.current?.focus(), 100);
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            setFilteredLanguages(searchLanguages(searchQuery));
        } else {
            setFilteredLanguages([]);
        }
    }, [searchQuery]);

    const handleLanguageChange = async (languageCode: string) => {
        // Change language instantly (no reload)
        await i18n.changeLanguage(languageCode);

        // Apply RTL if needed
        const rtl = isRTL(languageCode);
        document.documentElement.dir = rtl ? 'rtl' : 'ltr';
        document.documentElement.lang = languageCode;

        // Persist to localStorage (for guests)
        localStorage.setItem('i18nextLng', languageCode);

        // TODO: If user is logged in, save to backend
        // await updateUserLanguagePreference(languageCode);

        // Close modal with animation
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
    };

    const handleSwitchToEnglish = () => {
        if (currentLanguage !== 'en') {
            handleLanguageChange('en');
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
    };

    const displayLanguages = searchQuery.trim() ? filteredLanguages : allLanguages;
    const showPopular = !searchQuery.trim();

    return (
        <div
            className={`language-selector-backdrop ${isVisible ? 'visible' : ''}`}
            onClick={handleClose}
        >
            {/* Modal/Popover */}
            <div
                className={`language-selector ${mode} ${isVisible ? 'visible' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="language-selector-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="language-selector-header">
                    <h2 id="language-selector-title" className="flex items-center gap-3">
                        <img
                            src="/icons/languages_light_mode_icon.png"
                            alt=""
                            className="w-8 h-8 dark:hidden"
                        />
                        <img
                            src="/icons/languages_dark_mode_icon.png"
                            alt=""
                            className="w-8 h-8 hidden dark:block"
                        />
                        {t('selector.title')}
                    </h2>
                    <button
                        className="close-button"
                        onClick={handleClose}
                        aria-label={t('selector.close', { defaultValue: 'Close' })}
                    >
                        ✕
                    </button>
                </div>

                {/* Search Bar */}
                <div className="language-selector-search">
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={t('selector.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                            aria-label={t('selector.searchPlaceholder')}
                            autoFocus
                        />
                        {searchQuery && (
                            <button
                                className="clear-search"
                                onClick={() => setSearchQuery('')}
                                aria-label={t('selector.clearSearch', { defaultValue: 'Clear search' })}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Quick Switch to English */}
                {currentLanguage !== 'en' && (
                    <div className="quick-switch-section">
                        <button
                            className="quick-switch-button"
                            onClick={handleSwitchToEnglish}
                        >
                            <span className="flag">🇬🇧</span>
                            <span>{t('welcome.switchToEnglish')}</span>
                        </button>
                    </div>
                )}

                {/* Language List */}
                <div className="language-selector-content">
                    {/* Popular Languages */}
                    {showPopular && (
                        <div className="language-section">
                            <h3 className="section-title">{t('selector.popular')}</h3>
                            <div className="language-grid">
                                {popularLanguages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className={`language-item ${currentLanguage === lang.code ? 'active' : ''
                                            }`}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        dir={lang.rtl ? 'rtl' : 'ltr'}
                                    >
                                        <span className="native-name">{lang.name}</span>
                                        {currentLanguage === lang.code && (
                                            <span className="checkmark">✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Languages / Search Results */}
                    <div className="language-section">
                        <h3 className="section-title">
                            {searchQuery.trim()
                                ? t('selector.results', { count: displayLanguages.length })
                                : t('selector.all')}
                        </h3>
                        <div className="language-list">
                            {displayLanguages.length > 0 ? (
                                displayLanguages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className={`language-item ${currentLanguage === lang.code ? 'active' : ''
                                            }`}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        dir={lang.rtl ? 'rtl' : 'ltr'}
                                    >
                                        <div className="language-info">
                                            <span className="native-name">{lang.name}</span>
                                            <span className="english-name">{lang.englishName}</span>
                                        </div>
                                        {currentLanguage === lang.code && (
                                            <span className="checkmark">✓</span>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="no-results">
                                    <p>{t('selector.noResults', { query: searchQuery })}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="language-selector-footer">
                    <p className="footer-text">
                        {t('selector.footer')}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Language Selector Trigger Button
interface LanguageTriggerProps {
    onClick: () => void;
    className?: string;
}

export const LanguageTrigger: React.FC<LanguageTriggerProps> = ({
    onClick,
    className = '',
}) => {
    const { i18n } = useTranslation();

    // Find matching language, handling regional codes (e.g., 'en-US' -> 'en')
    const currentLang = LANGUAGES.find((lang) => lang.code === i18n.language) ||
        LANGUAGES.find((lang) => lang.code === i18n.language.split('-')[0]);

    return (
        <button
            className={`language-trigger ${className}`}
            onClick={onClick}
            aria-label="Change language"
            type="button"
        >
            <span className="globe-icon">🌐</span>
            <span className="current-language">
                {currentLang ? currentLang.name : 'English'}
            </span>
        </button>
    );
};
