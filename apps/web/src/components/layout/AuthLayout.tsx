import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { TopBar } from '../TopBar';
import { Footer } from '../Footer';
import { AnimatedBackground } from '../AnimatedBackground';
import { LanguageSelector } from '../LanguageSelector';
import { ContactModal } from '../ContactModal';

export const AuthLayout: React.FC = () => {
    const navigate = useNavigate();
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0f172a] dark flex flex-col">
            {/* Animated Background */}
            <AnimatedBackground />

            {/* Top Bar - Minimal version for auth pages */}
            <TopBar
                onLoginClick={() => navigate('/auth/login')}
                onRegisterClick={() => navigate('/auth/register')}
                showButtons={false}
            />

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center p-4 relative z-10 pt-20 pb-20">
                <Outlet />
            </main>

            {/* Footer with Language Selector */}
            <Footer
                onLanguageClick={() => setShowLanguageSelector(true)}
                onContactClick={() => setShowContactModal(true)}
                isAuth
            />

            {/* Language Selector Modal */}
            <AnimatePresence>
                {showLanguageSelector && (
                    <LanguageSelector onClose={() => setShowLanguageSelector(false)} />
                )}
            </AnimatePresence>

            {/* Contact Modal */}
            <AnimatePresence>
                {showContactModal && (
                    <ContactModal onClose={() => setShowContactModal(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};
