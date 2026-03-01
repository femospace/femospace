import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Phone, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ContactModalProps {
    onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const contacts = [
        { type: 'chat', value: 'Start Live Chat', label: 'Instant Support', action: 'chat' },
        { type: 'community', value: 'Visit Community', label: 'Community Help', action: 'community' },
        { type: 'email', value: 'femospace@gmail.com', label: 'Support Email' },
        { type: 'email', value: 'femospace@femo.com', label: 'Official Email' },
        { type: 'email', value: 'sscorporate@femo.com', label: 'Corporate Email' },
        { type: 'email', value: 'sscorporate@gmail.com', label: 'Corporate Support' },
        { type: 'phone', value: '+12345678999', label: 'Support Phone' },
    ];

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {t('contact.title', 'Contact Us')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-300 text-sm mb-4">
                        {t('contact.description', 'Reach out to us via any of the following channels:')}
                    </p>

                    <div className="space-y-3">
                        {contacts.map((contact, index) => (
                            <motion.div
                                key={contact.value}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition-colors group cursor-pointer"
                                onClick={() => {
                                    if ((contact as any).action) {
                                        if ((contact as any).action === 'chat') {
                                            if (!isAuthenticated) {
                                                localStorage.setItem('pendingSupportAction', 'chat');
                                                navigate('/auth/login');
                                            } else {
                                                navigate('/chat?support=true');
                                            }
                                            onClose();
                                        } else if ((contact as any).action === 'community') {
                                            // Redirecting to the existing groups/pages logic serving as the community center.
                                            navigate('/search?q=Help%20Community');
                                            onClose();
                                        }
                                    } else {
                                        handleCopy(contact.value, index);
                                    }
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    {contact.type === 'email' ? <Mail size={18} /> :
                                        contact.type === 'phone' ? <Phone size={18} /> :
                                            contact.type === 'chat' ? <span className="text-xl">💬</span> :
                                                <span className="text-xl">👥</span>}
                                </div>

                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs text-gray-400 font-medium">{contact.label}</p>
                                    <p className="text-sm text-white font-mono truncate">{contact.value}</p>
                                </div>

                                {!(contact as any).action && (
                                    <div className="p-2 text-gray-400 group-hover:text-blue-400 transition-colors">
                                        {copiedIndex === index ? (
                                            <Check size={18} className="text-emerald-400" />
                                        ) : (
                                            <Copy size={18} />
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 text-center">
                        <p className="text-xs text-gray-500">
                            {t('contact.response_time', 'We typically respond within 24 hours.')}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
