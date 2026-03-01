import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { COUNTRIES } from '../../../data/countries';
import { useTranslation } from 'react-i18next';

interface CountrySelectorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export const CountrySelector = ({ value, onChange, label = 'Country' }: CountrySelectorProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const selectedCountry = COUNTRIES.find(c => c.name === value);
    const filteredCountries = COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                {label === 'Country' ? t('auth.register.credentials.country') : label}
            </label>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-left flex items-center justify-between hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                    <span className="flex items-center gap-2">
                        {selectedCountry ? (
                            <>
                                <span className="text-2xl">{selectedCountry.flag}</span>
                                <span>{selectedCountry.name}</span>
                            </>
                        ) : (
                            <span className="text-gray-500">{t('auth.register.credentials.selectCountry')}</span>
                        )}
                    </span>
                    <ChevronDown
                        size={20}
                        className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsOpen(false)}
                            />

                            {/* Dropdown */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-20 w-full mt-2 bg-gray-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                            >
                                {/* Search */}
                                <div className="p-3 border-b border-white/10">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder={t('auth.register.credentials.searchCountries')}
                                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* List */}
                                <div className="max-h-60 overflow-y-auto">
                                    {filteredCountries.map((country) => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            onClick={() => {
                                                onChange(country.name);
                                                setIsOpen(false);
                                                setSearch('');
                                            }}
                                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
                                        >
                                            <span className="text-2xl">{country.flag}</span>
                                            <span className="text-white">{country.name}</span>
                                        </button>
                                    ))}
                                    {filteredCountries.length === 0 && (
                                        <div className="px-4 py-8 text-center text-gray-500">
                                            {t('auth.register.credentials.noCountries')}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
