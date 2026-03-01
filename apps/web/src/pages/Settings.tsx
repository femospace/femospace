import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
    Shield, Lock, Watch, Smartphone, RefreshCcw, History,
    UserX, AlertTriangle, ChevronRight, ArrowLeft, Bell,
    Eye, Globe, User, Mail, X, Check, Loader2, AlertCircle,
    ToggleLeft, ToggleRight,
    Phone, Link2, Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { settingsService, PrivacySettings, NotificationSettings } from '../services/settings.service';
import { useTranslation } from 'react-i18next';

// ─── ISO Countries (all 194) ──────────────────────────────────────────────────
const COUNTRIES = [
    { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' }, { code: 'DZ', name: 'Algeria' },
    { code: 'AD', name: 'Andorra' }, { code: 'AO', name: 'Angola' }, { code: 'AG', name: 'Antigua and Barbuda' },
    { code: 'AR', name: 'Argentina' }, { code: 'AM', name: 'Armenia' }, { code: 'AU', name: 'Australia' },
    { code: 'AT', name: 'Austria' }, { code: 'AZ', name: 'Azerbaijan' }, { code: 'BS', name: 'Bahamas' },
    { code: 'BH', name: 'Bahrain' }, { code: 'BD', name: 'Bangladesh' }, { code: 'BB', name: 'Barbados' },
    { code: 'BY', name: 'Belarus' }, { code: 'BE', name: 'Belgium' }, { code: 'BZ', name: 'Belize' },
    { code: 'BJ', name: 'Benin' }, { code: 'BT', name: 'Bhutan' }, { code: 'BO', name: 'Bolivia' },
    { code: 'BA', name: 'Bosnia and Herzegovina' }, { code: 'BW', name: 'Botswana' }, { code: 'BR', name: 'Brazil' },
    { code: 'BN', name: 'Brunei' }, { code: 'BG', name: 'Bulgaria' }, { code: 'BF', name: 'Burkina Faso' },
    { code: 'BI', name: 'Burundi' }, { code: 'CV', name: 'Cabo Verde' }, { code: 'KH', name: 'Cambodia' },
    { code: 'CM', name: 'Cameroon' }, { code: 'CA', name: 'Canada' }, { code: 'CF', name: 'Central African Republic' },
    { code: 'TD', name: 'Chad' }, { code: 'CL', name: 'Chile' }, { code: 'CN', name: 'China' },
    { code: 'CO', name: 'Colombia' }, { code: 'KM', name: 'Comoros' }, { code: 'CG', name: 'Congo' },
    { code: 'CR', name: 'Costa Rica' }, { code: 'HR', name: 'Croatia' }, { code: 'CU', name: 'Cuba' },
    { code: 'CY', name: 'Cyprus' }, { code: 'CZ', name: 'Czech Republic' }, { code: 'DK', name: 'Denmark' },
    { code: 'DJ', name: 'Djibouti' }, { code: 'DM', name: 'Dominica' }, { code: 'DO', name: 'Dominican Republic' },
    { code: 'EC', name: 'Ecuador' }, { code: 'EG', name: 'Egypt' }, { code: 'SV', name: 'El Salvador' },
    { code: 'GQ', name: 'Equatorial Guinea' }, { code: 'ER', name: 'Eritrea' }, { code: 'EE', name: 'Estonia' },
    { code: 'SZ', name: 'Eswatini' }, { code: 'ET', name: 'Ethiopia' }, { code: 'FJ', name: 'Fiji' },
    { code: 'FI', name: 'Finland' }, { code: 'FR', name: 'France' }, { code: 'GA', name: 'Gabon' },
    { code: 'GM', name: 'Gambia' }, { code: 'GE', name: 'Georgia' }, { code: 'DE', name: 'Germany' },
    { code: 'GH', name: 'Ghana' }, { code: 'GR', name: 'Greece' }, { code: 'GD', name: 'Grenada' },
    { code: 'GT', name: 'Guatemala' }, { code: 'GN', name: 'Guinea' }, { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GY', name: 'Guyana' }, { code: 'HT', name: 'Haiti' }, { code: 'HN', name: 'Honduras' },
    { code: 'HU', name: 'Hungary' }, { code: 'IS', name: 'Iceland' }, { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' }, { code: 'IR', name: 'Iran' }, { code: 'IQ', name: 'Iraq' },
    { code: 'IE', name: 'Ireland' }, { code: 'IL', name: 'Israel' }, { code: 'IT', name: 'Italy' },
    { code: 'JM', name: 'Jamaica' }, { code: 'JP', name: 'Japan' }, { code: 'JO', name: 'Jordan' },
    { code: 'KZ', name: 'Kazakhstan' }, { code: 'KE', name: 'Kenya' }, { code: 'KI', name: 'Kiribati' },
    { code: 'KW', name: 'Kuwait' }, { code: 'KG', name: 'Kyrgyzstan' }, { code: 'LA', name: 'Laos' },
    { code: 'LV', name: 'Latvia' }, { code: 'LB', name: 'Lebanon' }, { code: 'LS', name: 'Lesotho' },
    { code: 'LR', name: 'Liberia' }, { code: 'LY', name: 'Libya' }, { code: 'LI', name: 'Liechtenstein' },
    { code: 'LT', name: 'Lithuania' }, { code: 'LU', name: 'Luxembourg' }, { code: 'MG', name: 'Madagascar' },
    { code: 'MW', name: 'Malawi' }, { code: 'MY', name: 'Malaysia' }, { code: 'MV', name: 'Maldives' },
    { code: 'ML', name: 'Mali' }, { code: 'MT', name: 'Malta' }, { code: 'MH', name: 'Marshall Islands' },
    { code: 'MR', name: 'Mauritania' }, { code: 'MU', name: 'Mauritius' }, { code: 'MX', name: 'Mexico' },
    { code: 'FM', name: 'Micronesia' }, { code: 'MD', name: 'Moldova' }, { code: 'MC', name: 'Monaco' },
    { code: 'MN', name: 'Mongolia' }, { code: 'ME', name: 'Montenegro' }, { code: 'MA', name: 'Morocco' },
    { code: 'MZ', name: 'Mozambique' }, { code: 'MM', name: 'Myanmar (Burma)' }, { code: 'NA', name: 'Namibia' },
    { code: 'NR', name: 'Nauru' }, { code: 'NP', name: 'Nepal' }, { code: 'NL', name: 'Netherlands' },
    { code: 'NZ', name: 'New Zealand' }, { code: 'NI', name: 'Nicaragua' }, { code: 'NE', name: 'Niger' },
    { code: 'NG', name: 'Nigeria' }, { code: 'NO', name: 'Norway' }, { code: 'OM', name: 'Oman' },
    { code: 'PK', name: 'Pakistan' }, { code: 'PW', name: 'Palau' }, { code: 'PA', name: 'Panama' },
    { code: 'PG', name: 'Papua New Guinea' }, { code: 'PY', name: 'Paraguay' }, { code: 'PE', name: 'Peru' },
    { code: 'PH', name: 'Philippines' }, { code: 'PL', name: 'Poland' }, { code: 'PT', name: 'Portugal' },
    { code: 'QA', name: 'Qatar' }, { code: 'RO', name: 'Romania' }, { code: 'RU', name: 'Russia' },
    { code: 'RW', name: 'Rwanda' }, { code: 'KN', name: 'Saint Kitts and Nevis' }, { code: 'LC', name: 'Saint Lucia' },
    { code: 'VC', name: 'Saint Vincent and Grenadines' }, { code: 'WS', name: 'Samoa' }, { code: 'SM', name: 'San Marino' },
    { code: 'ST', name: 'Sao Tome and Principe' }, { code: 'SA', name: 'Saudi Arabia' }, { code: 'SN', name: 'Senegal' },
    { code: 'RS', name: 'Serbia' }, { code: 'SC', name: 'Seychelles' }, { code: 'SL', name: 'Sierra Leone' },
    { code: 'SG', name: 'Singapore' }, { code: 'SK', name: 'Slovakia' }, { code: 'SI', name: 'Slovenia' },
    { code: 'SB', name: 'Solomon Islands' }, { code: 'SO', name: 'Somalia' }, { code: 'ZA', name: 'South Africa' },
    { code: 'SS', name: 'South Sudan' }, { code: 'ES', name: 'Spain' }, { code: 'LK', name: 'Sri Lanka' },
    { code: 'SD', name: 'Sudan' }, { code: 'SR', name: 'Suriname' }, { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' }, { code: 'SY', name: 'Syria' }, { code: 'TW', name: 'Taiwan' },
    { code: 'TJ', name: 'Tajikistan' }, { code: 'TZ', name: 'Tanzania' }, { code: 'TH', name: 'Thailand' },
    { code: 'TL', name: 'Timor-Leste' }, { code: 'TG', name: 'Togo' }, { code: 'TO', name: 'Tonga' },
    { code: 'TT', name: 'Trinidad and Tobago' }, { code: 'TN', name: 'Tunisia' }, { code: 'TR', name: 'Turkey' },
    { code: 'TM', name: 'Turkmenistan' }, { code: 'TV', name: 'Tuvalu' }, { code: 'UG', name: 'Uganda' },
    { code: 'UA', name: 'Ukraine' }, { code: 'AE', name: 'United Arab Emirates' }, { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' }, { code: 'UY', name: 'Uruguay' }, { code: 'UZ', name: 'Uzbekistan' },
    { code: 'VU', name: 'Vanuatu' }, { code: 'VE', name: 'Venezuela' }, { code: 'VN', name: 'Vietnam' },
    { code: 'YE', name: 'Yemen' }, { code: 'ZM', name: 'Zambia' }, { code: 'ZW', name: 'Zimbabwe' },
];

const LANGUAGES = [
    { code: 'en', name: 'English (US)' }, { code: 'ar', name: 'العربية' },
    { code: 'zh', name: '中文' }, { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }, { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' }, { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' }, { code: 'ko', name: '한국어' },
    { code: 'hi', name: 'हिन्दी' }, { code: 'it', name: 'Italiano' },
    { code: 'tr', name: 'Türkçe' }, { code: 'nl', name: 'Nederlands' },
];

// ─── Utility Components ───────────────────────────────────────────────────────

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}
    >
        {type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
        {message}
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={16} /></button>
    </motion.div>
);

const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)} className="flex-shrink-0">
        {value
            ? <ToggleRight size={32} className="text-blue-500" />
            : <ToggleLeft size={32} className="text-gray-400" />}
    </button>
);

const SkeletonLine = ({ w = 'full' }: { w?: string }) => (
    <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-${w} animate-pulse`} />
);

// ─── Sub-Panel Slide Animation ────────────────────────────────────────────────

const panelVariants: Variants = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, damping: 28, stiffness: 280 } },
    exit: { opacity: 0, x: 60, transition: { duration: 0.2 } }
};

// ─── Panel Wrapper ────────────────────────────────────────────────────────────

const SubPanel = ({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) => (
    <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 bg-[#f8fafc] dark:bg-[#0f172a] overflow-y-auto"
    >
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
                <button onClick={onBack} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">{title}</h1>
            </div>
        </header>
        <main className="max-w-2xl mx-auto px-6 py-6 pb-32">{children}</main>
    </motion.div>
);

// ─── Personal Information Panel ───────────────────────────────────────────────

const PersonalInfoPanel = ({ onBack, onToast }: { onBack: () => void; onToast: (m: string, t: 'success' | 'error') => void }) => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '', username: '', country: '', bio: '', website: '' });

    useEffect(() => {
        settingsService.getPersonalInfo().then(info => {
            setForm({
                firstName: info.firstName,
                lastName: info.lastName,
                username: info.username,
                country: info.country || '',
                bio: info.bio || '',
                website: info.website || '',
            });
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.updatePersonalInfo(form);
            await refreshUser();
            onToast('Profile updated successfully', 'success');
        } catch (e: any) {
            onToast(e?.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const Field = ({ label, value, onChange, readonly = false, icon: Icon, type = 'text', as = 'input' }: any) => (
        <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{label}</label>
            <div className="relative">
                {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                {as === 'textarea' ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        rows={3}
                        className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        readOnly={readonly}
                        className={`w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-3 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none ${readonly ? 'opacity-60 cursor-not-allowed' : ''}`}
                    />
                )}
            </div>
        </div>
    );

    if (loading) return (
        <SubPanel title="Personal Information" onBack={onBack}>
            <div className="space-y-4">{[...Array(5)].map((_, i) => <SkeletonLine key={i} />)}</div>
        </SubPanel>
    );

    return (
        <SubPanel title="Personal Information" onBack={onBack}>
            <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name" value={form.firstName} onChange={(v: string) => setForm(f => ({ ...f, firstName: v }))} icon={User} />
                    <Field label="Last Name" value={form.lastName} onChange={(v: string) => setForm(f => ({ ...f, lastName: v }))} icon={User} />
                </div>
                <Field label="Username" value={form.username} onChange={(v: string) => setForm(f => ({ ...f, username: v }))} icon={User} />
                <Field label="Femo Email (readonly)" value={user?.email || ''} onChange={() => { }} readonly icon={Mail} />
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Country</label>
                    <select
                        value={form.country}
                        onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                        className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">Select country...</option>
                        {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                </div>
                <Field label="Bio" value={form.bio} onChange={(v: string) => setForm(f => ({ ...f, bio: v }))} as="textarea" />
                <Field label="Website" value={form.website} onChange={(v: string) => setForm(f => ({ ...f, website: v }))} icon={Link2} type="url" />

                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </motion.button>
            </div>
        </SubPanel>
    );
};

// ─── Language & Region Panel ──────────────────────────────────────────────────

const LanguagePanel = ({ onBack, onToast }: { onBack: () => void; onToast: (m: string, t: 'success' | 'error') => void }) => {
    const { i18n } = useTranslation();
    const [lang, setLang] = useState(i18n.language?.slice(0, 2) || 'en');
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.updateLanguage(lang, timezone);
            i18n.changeLanguage(lang);
            onToast('Language & region updated', 'success');
        } catch {
            onToast('Failed to update', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SubPanel title="Language & Region" onBack={onBack}>
            <div className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Language</label>
                    <select value={lang} onChange={e => setLang(e.target.value)} className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Timezone</label>
                    <input type="text" value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    <p className="text-xs text-gray-400 mt-1">Auto-detected from your device</p>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving} className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    {saving ? 'Saving...' : 'Apply Changes'}
                </motion.button>
            </div>
        </SubPanel>
    );
};

// ─── Notifications Panel ──────────────────────────────────────────────────────

const NotificationsPanel = ({ onBack, onToast }: { onBack: () => void; onToast: (m: string, t: 'success' | 'error') => void }) => {
    const [settings, setSettings] = useState<NotificationSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        settingsService.getNotificationSettings().then(s => { setSettings(s); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const toggleCategory = (cat: string) => {
        if (!settings) return;
        const updated = { ...settings, categories: { ...(settings.categories as any), [cat]: !(settings.categories as any)[cat] } };
        setSettings(updated);
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            await settingsService.updateNotificationSettings(settings);
            onToast('Notification settings saved', 'success');
        } catch {
            onToast('Failed to save settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const CATS = ['social', 'content', 'community', 'system', 'monetization', 'business', 'ai'];

    if (loading) return <SubPanel title="Notifications" onBack={onBack}><div className="space-y-4">{CATS.map(c => <SkeletonLine key={c} />)}</div></SubPanel>;

    return (
        <SubPanel title="Notifications" onBack={onBack}>
            <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Control which categories of notifications you receive.</p>
                {CATS.map(cat => (
                    <div key={cat} className="flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div>
                            <p className="font-bold text-gray-800 dark:text-gray-100 capitalize">{cat}</p>
                            <p className="text-xs text-gray-500">{cat === 'social' ? 'Likes, comments, follows' : cat === 'system' ? 'Security alerts, updates' : cat === 'monetization' ? 'Payouts, earnings' : cat === 'ai' ? 'AI assistant messages' : `${cat} notifications`}</p>
                        </div>
                        <Toggle value={!!(settings?.categories as any)?.[cat] !== false} onChange={() => toggleCategory(cat)} />
                    </div>
                ))}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving} className="w-full mt-4 py-3.5 bg-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    {saving ? 'Saving...' : 'Save Settings'}
                </motion.button>
            </div>
        </SubPanel>
    );
};

// ─── Password Panel ───────────────────────────────────────────────────────────

const PasswordPanel = ({ onBack, onToast }: { onBack: () => void; onToast: (m: string, t: 'success' | 'error') => void }) => {
    const [form, setForm] = useState({ current: '', newPwd: '', confirm: '' });
    const [saving, setSaving] = useState(false);
    const [strength, setStrength] = useState(0);

    const calcStrength = (pwd: string) => {
        let s = 0;
        if (pwd.length >= 8) s++;
        if (/[A-Z]/.test(pwd)) s++;
        if (/[0-9]/.test(pwd)) s++;
        if (/[^A-Za-z0-9]/.test(pwd)) s++;
        setStrength(s);
    };

    const handleSave = async () => {
        if (form.newPwd !== form.confirm) { onToast('Passwords do not match', 'error'); return; }
        if (form.newPwd.length < 8) { onToast('Password must be at least 8 characters', 'error'); return; }
        setSaving(true);
        try {
            await settingsService.changePassword(form.current, form.newPwd);
            onToast('Password changed successfully. Please log in again.', 'success');
            setForm({ current: '', newPwd: '', confirm: '' });
        } catch (e: any) {
            onToast(e?.response?.data?.message || 'Failed to change password', 'error');
        } finally {
            setSaving(false);
        }
    };

    const strengthColors = ['bg-gray-200', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'];
    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

    return (
        <SubPanel title="Password & Login" onBack={onBack}>
            <div className="space-y-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">Change your password. After changing, all other sessions will be logged out.</p>
                {[
                    { label: 'Current Password', key: 'current' as const },
                    { label: 'New Password', key: 'newPwd' as const },
                    { label: 'Confirm New Password', key: 'confirm' as const },
                ].map(({ label, key }) => (
                    <div key={key}>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{label}</label>
                        <div className="relative">
                            <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                value={form[key]}
                                onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); if (key === 'newPwd') calcStrength(e.target.value); }}
                                className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-3 text-sm dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                ))}
                {form.newPwd && (
                    <div>
                        <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-gray-200 dark:bg-gray-700'}`} />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500">{strengthLabels[strength]}</p>
                    </div>
                )}
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl text-xs text-amber-700 dark:text-amber-400 space-y-1">
                    <p>✓ At least 8 characters</p>
                    <p>✓ Uppercase letter</p>
                    <p>✓ Number</p>
                    <p>✓ Special character</p>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving || !form.current || !form.newPwd || !form.confirm} className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                    {saving ? 'Changing...' : 'Change Password'}
                </motion.button>
            </div>
        </SubPanel>
    );
};

// ─── Login Activity Panel ─────────────────────────────────────────────────────

const LoginActivityPanel = ({ onBack, onToast: _onToast }: { onBack: () => void; onToast: (m: string, t: 'success' | 'error') => void }) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        settingsService.getLoginActivity().then(d => { setLogs(d || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const authLogs = logs.filter(l => l.category === 'AUTH' || l.action?.includes('LOGIN') || l.action?.includes('SESSION'));

    return (
        <SubPanel title="Login Activity" onBack={onBack}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Review all recent login events and sessions on your account.</p>
            {loading ? (
                <div className="space-y-3">{[...Array(4)].map((_, i) => <SkeletonLine key={i} />)}</div>
            ) : authLogs.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <History size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="font-semibold">No login activity found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {authLogs.map((log, i) => (
                        <div key={i} className="p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-bold text-sm text-gray-800 dark:text-gray-100">{log.action?.replace(/_/g, ' ')}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{log.ipAddress || 'Unknown IP'} • {log.metadata?.deviceId || 'Unknown Device'}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${log.status === 'FAILED' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {log.status || 'OK'}
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-2">{new Date(log.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </SubPanel>
    );
};

// ─── Blocked Users Panel ──────────────────────────────────────────────────────

const BlockedUsersPanel = ({ onBack, onToast }: { onBack: () => void; onToast: (m: string, t: 'success' | 'error') => void }) => {
    const [blocked, setBlocked] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        settingsService.getBlockedUsers().then(d => { setBlocked(d || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const handleUnblock = async (userId: string) => {
        try {
            await settingsService.unblockUser(userId);
            setBlocked(prev => prev.filter(b => b.userId !== userId));
            onToast('User unblocked', 'success');
        } catch {
            onToast('Failed to unblock user', 'error');
        }
    };

    return (
        <SubPanel title="Blocked Users" onBack={onBack}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Users you've blocked can't contact you, see your content or follow you.</p>
            {loading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <SkeletonLine key={i} />)}</div>
            ) : blocked.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <UserX size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="font-semibold">No blocked users</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {blocked.map((b, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <p className="font-semibold text-sm dark:text-white">{b.username || b.userId}</p>
                            </div>
                            <button onClick={() => handleUnblock(b.userId)} className="text-xs text-red-500 hover:text-red-600 font-bold px-3 py-1.5 border border-red-200 dark:border-red-800 rounded-lg">
                                Unblock
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </SubPanel>
    );
};

// ─── Privacy Panel ────────────────────────────────────────────────────────────

const PrivacyPanel = ({ onBack, onToast }: { onBack: () => void; onToast: (m: string, t: 'success' | 'error') => void }) => {
    const [settings, setSettings] = useState<PrivacySettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        settingsService.getPrivacySettings().then(d => { setSettings(d); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const update = (key: keyof PrivacySettings, value: any) => setSettings(prev => prev ? { ...prev, [key]: value } : prev);

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            await settingsService.updatePrivacySettings(settings);
            onToast('Privacy settings saved', 'success');
        } catch {
            onToast('Failed to save', 'error');
        } finally {
            setSaving(false);
        }
    };

    const VisibilitySelect = ({ label, value, onChange }: { label: string; value: string; onChange: (v: any) => void }) => (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{label}</p>
            <select value={value} onChange={e => onChange(e.target.value)} className="bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-3 py-1.5 text-sm dark:text-white outline-none">
                <option value="public">🌍 Public</option>
                <option value="followers">👥 Followers</option>
                <option value="private">🔒 Private</option>
            </select>
        </div>
    );

    if (loading || !settings) return <SubPanel title="Profile Privacy" onBack={onBack}><div className="space-y-3">{[...Array(4)].map((_, i) => <SkeletonLine key={i} />)}</div></SubPanel>;

    return (
        <SubPanel title="Profile Privacy" onBack={onBack}>
            <div className="space-y-3">
                <VisibilitySelect label="Profile Visibility" value={settings.profileVisibility} onChange={v => update('profileVisibility', v)} />
                <VisibilitySelect label="Post Visibility" value={settings.postVisibility} onChange={v => update('postVisibility', v)} />
                <VisibilitySelect label="Story Visibility" value={settings.storyVisibility} onChange={v => update('storyVisibility', v)} />
                <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div>
                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">Activity Status</p>
                        <p className="text-xs text-gray-500">Show when you're online</p>
                    </div>
                    <Toggle value={settings.activityStatus} onChange={v => update('activityStatus', v)} />
                </div>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div>
                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">Show Last Seen</p>
                        <p className="text-xs text-gray-500">Let others see when you were last active</p>
                    </div>
                    <Toggle value={settings.showLastSeen} onChange={v => update('showLastSeen', v)} />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving} className="w-full mt-2 py-3.5 bg-pink-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    {saving ? 'Saving...' : 'Save Privacy Settings'}
                </motion.button>
            </div>
        </SubPanel>
    );
};

// ─── Account Recovery Panel ───────────────────────────────────────────────────

const AccountRecoveryPanel = ({ onBack, onToast }: { onBack: () => void; onToast: (m: string, t: 'success' | 'error') => void }) => {
    const [form, setForm] = useState({ recoveryEmail: '', recoveryPhone: '' });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.updateAccountRecovery(form);
            onToast('Recovery info saved', 'success');
        } catch {
            onToast('Failed to save', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SubPanel title="Account Recovery" onBack={onBack}>
            <div className="space-y-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">Set up a recovery email and phone to regain access if you lose your login credentials.</p>
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Recovery Email</label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="email" value={form.recoveryEmail} onChange={e => setForm(f => ({ ...f, recoveryEmail: e.target.value }))} placeholder="recovery@email.com" className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-3 text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Recovery Phone</label>
                    <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="tel" value={form.recoveryPhone} onChange={e => setForm(f => ({ ...f, recoveryPhone: e.target.value }))} placeholder="+1 555 000 0000" className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-3 text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
                    </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl text-xs text-blue-700 dark:text-blue-400">
                    <p className="font-bold mb-1">📝 Admin Fallback Available</p>
                    <p>If you lose access to both recovery options, contact our support team with your Femo ID for manual verification.</p>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving} className="w-full py-3.5 bg-cyan-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    {saving ? 'Saving...' : 'Save Recovery Info'}
                </motion.button>
            </div>
        </SubPanel>
    );
};

// ─── Main Settings Page ───────────────────────────────────────────────────────

type PanelKey =
    | 'personalInfo' | 'language' | 'notifications' | 'password'
    | 'devices' | 'mfa' | 'recovery' | 'loginActivity' | 'blockedUsers'
    | 'reports' | 'profilePrivacy' | 'activityStatus' | null;

export const Settings = () => {
    const navigate = useNavigate();
    const [activePanel, setActivePanel] = useState<PanelKey>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    const SettingItem = ({ icon: Icon, title, subtitle, onClick, color = 'blue' }: any) => (
        <motion.div
            variants={itemVariants}
            whileHover={{ x: 4 }}
            onClick={onClick}
            className="flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer group transition-all"
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center`}>
                    <Icon size={20} className={`text-${color}-500`} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
                </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500" />
        </motion.div>
    );

    const SectionHeader = ({ title }: { title: string }) => (
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-8 mb-4 px-2">{title}</h2>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <button onClick={() => navigate('/menu')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Settings</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-4">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-1">
                    {/* ACCOUNT SECTION */}
                    <SectionHeader title="Account Settings" />
                    <SettingItem icon={Mail} title="Femo Mail" subtitle="Manage your internal emails" onClick={() => navigate('/mail')} color="blue" />
                    <SettingItem icon={User} title="Personal Information" subtitle="Update your name, email and phone" onClick={() => setActivePanel('personalInfo')} color="blue" />
                    <SettingItem icon={Globe} title="Language & Region" subtitle="English (US)" onClick={() => setActivePanel('language')} color="indigo" />
                    <SettingItem icon={Bell} title="Notifications" subtitle="Manage alerts and push notifications" onClick={() => setActivePanel('notifications')} color="purple" />

                    {/* SECURITY & TRUST SECTION */}
                    <SectionHeader title="Security & Trust" />
                    <SettingItem icon={Lock} title="Password & Login" subtitle="Change password and secure your account" onClick={() => setActivePanel('password')} color="emerald" />
                    <SettingItem icon={Smartphone} title="Devices & Sessions" subtitle="Manage and log out from devices" onClick={() => navigate('/security')} color="blue" />
                    <SettingItem icon={Shield} title="Two-step verification" subtitle="Add extra layer of security" onClick={() => navigate('/security')} color="orange" />
                    <SettingItem icon={RefreshCcw} title="Account Recovery" subtitle="Setup recovery options" onClick={() => setActivePanel('recovery')} color="cyan" />
                    <SettingItem icon={History} title="Login Activity" subtitle="Review your latest login events" onClick={() => setActivePanel('loginActivity')} color="yellow" />
                    <SettingItem icon={UserX} title="Blocked users" subtitle="Manage people you've blocked" onClick={() => setActivePanel('blockedUsers')} color="red" />
                    <SettingItem icon={AlertTriangle} title="Report center" subtitle="View status of your reports" onClick={() => navigate('/security')} color="rose" />

                    {/* PRIVACY SECTION */}
                    <SectionHeader title="Privacy" />
                    <SettingItem icon={Eye} title="Profile Privacy" subtitle="Control who sees your profile" onClick={() => setActivePanel('profilePrivacy')} color="pink" />
                    <SettingItem icon={Watch} title="Activity Status" subtitle="Manage active status visibility" onClick={() => setActivePanel('profilePrivacy')} color="slate" />
                </motion.div>
            </main>

            {/* Sub Panels */}
            <AnimatePresence>
                {activePanel === 'personalInfo' && <PersonalInfoPanel onBack={() => setActivePanel(null)} onToast={showToast} />}
                {activePanel === 'language' && <LanguagePanel onBack={() => setActivePanel(null)} onToast={showToast} />}
                {activePanel === 'notifications' && <NotificationsPanel onBack={() => setActivePanel(null)} onToast={showToast} />}
                {activePanel === 'password' && <PasswordPanel onBack={() => setActivePanel(null)} onToast={showToast} />}
                {activePanel === 'loginActivity' && <LoginActivityPanel onBack={() => setActivePanel(null)} onToast={showToast} />}
                {activePanel === 'blockedUsers' && <BlockedUsersPanel onBack={() => setActivePanel(null)} onToast={showToast} />}
                {activePanel === 'profilePrivacy' && <PrivacyPanel onBack={() => setActivePanel(null)} onToast={showToast} />}
                {activePanel === 'recovery' && <AccountRecoveryPanel onBack={() => setActivePanel(null)} onToast={showToast} />}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
};
