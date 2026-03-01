import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Search, ChevronRight } from 'lucide-react';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useAuth } from '../../contexts/AuthContext';
import './LegalPage.css';

export const LegalPage: React.FC<{ type: 'terms' | 'privacy' | 'help' }> = ({ type }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    // Simplified without fetching for now
    // const [doc, setDoc] = useState<LegalDoc | null>(null);
    // const [loading, setLoading] = useState(true);

    const { isAuthenticated } = useAuth();
    const [showLangSelector, setShowLangSelector] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const title = type === 'terms' ? t('legal.termsTitle', 'Terms & Conditions') :
        type === 'privacy' ? t('legal.privacyTitle', 'Privacy Policy') :
            'Help Center';

    const handleLiveChat = () => {
        if (!isAuthenticated) {
            localStorage.setItem('pendingSupportAction', 'chat');
            navigate('/auth/login');
        } else {
            navigate('/chat?support=true');
        }
    };
    return (
        <div className="legal-page">
            <header className="legal-header">
                <div className="header-content">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                        <span>{t('common.back', 'Back')}</span>
                    </button>
                    <h1>{title}</h1>
                    <button className="lang-toggle" onClick={() => setShowLangSelector(true)}>
                        <Globe size={20} />
                        <span>{i18n.language.toUpperCase()}</span>
                    </button>
                </div>
            </header>

            <main className="legal-content">
                <div className="doc-wrapper">
                    <div className="doc-meta">
                        {t('legal.lastUpdated', 'Last Updated')}: {new Date().toLocaleDateString()}
                        <span className="version">v1.0.0</span>
                    </div>
                    <div className="rich-text">
                        {type === 'terms' ? (
                            <div>
                                <h2>Terms of Service</h2>
                                <p>Welcome to Femo Space. By accessing or using our platform, you agree to be bound by these Terms of Service.</p>
                                <h3>1. Acceptance of Terms</h3>
                                <p>By accessing or using our services, you confirm that you accept these terms and conditions.</p>
                                <h3>2. User Conduct</h3>
                                <p>You agree to use Femo Space only for lawful purposes and properly.</p>
                                <h3>3. Content</h3>
                                <p>Users are responsible for the content they post on Femo Space.</p>
                            </div>
                        ) : type === 'privacy' ? (
                            <div>
                                <h2>Privacy Policy</h2>
                                <p>Your privacy is important to us. This policy explains how we collect, use, and protect your data.</p>
                                <h3>1. Information Collection</h3>
                                <p>We collect information you provide directly to us, such as when you create an account.</p>
                                <h3>2. Data Usage</h3>
                                <p>We use your data to provide and improve our services.</p>
                                <h3>3. Data Protection</h3>
                                <p>We implement security measures to protect your personal information.</p>
                            </div>
                        ) : (
                            <div className="help-center-content">
                                <div className="relative mb-6">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <Search size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search FAQs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold">Category-based Articles</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {['Account Issues', 'Creator Tool Help', 'Monetization Help', 'Bugs & Reports', 'Feature Requests'].filter(c => c.toLowerCase().includes(searchQuery.toLowerCase())).map((cat, i) => (
                                            <div key={i} className="p-4 bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10" onClick={() => navigate('/search?q=Help%20Community')}>
                                                <span className="font-medium">{cat}</span>
                                                <ChevronRight size={18} className="text-gray-400" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-10 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-center">
                                    <h3 className="text-lg font-bold mb-2">Still need help?</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Our support team is always ready to help you.</p>
                                    <button
                                        onClick={handleLiveChat}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-blue-500/30"
                                    >
                                        Start Live Chat
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {showLangSelector && (
                <LanguageSelector onClose={() => setShowLangSelector(false)} />
            )}

            <footer className="legal-footer">
                <div className="footer-links">
                    <button onClick={() => i18n.changeLanguage('en')} className="english-switch">
                        Switch to English
                    </button>
                    <span>&copy; {new Date().getFullYear()} SS Corporate Inc</span>
                </div>
            </footer>
        </div>
    );
};
