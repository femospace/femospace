import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTRIES, Country } from '../../constants/countries';
import { useTheme } from '../../contexts/ThemeContext';
import clsx from 'clsx';

interface CountrySelectorProps {
    value?: string;
    onChange: (country: Country) => void;
    label?: string;
    error?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ value, onChange, label, error }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedCountry = COUNTRIES.find(c => c.code === value);

    const filteredCountries = COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {label && (
                <label className={clsx(
                    "block text-[10px] font-black uppercase tracking-widest mb-2",
                    isDark ? "text-white/40" : "text-slate-400"
                )}>
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300",
                    isDark
                        ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                        : "bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100",
                    isOpen && "ring-2 ring-blue-500/20 border-blue-500",
                    error && "border-red-500/50 ring-2 ring-red-500/10"
                )}
            >
                <div className="flex items-center gap-3">
                    {selectedCountry ? (
                        <>
                            <span className="text-xl">{selectedCountry.emoji}</span>
                            <span className="font-bold text-sm">{selectedCountry.name}</span>
                        </>
                    ) : (
                        <span className={clsx("text-sm", isDark ? "text-white/30" : "text-slate-400")}>
                            Select a country
                        </span>
                    )}
                </div>
                <ChevronDown className={clsx(
                    "w-5 h-5 transition-transform duration-300",
                    isOpen && "rotate-180",
                    isDark ? "text-white/20" : "text-slate-400"
                )} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={clsx(
                            "absolute z-[100] top-full mt-3 w-full rounded-[32px] border overflow-hidden shadow-2xl backdrop-blur-3xl",
                            isDark
                                ? "bg-neutral-900/90 border-white/10 shadow-black/50"
                                : "bg-white/95 border-slate-200 shadow-slate-200/50"
                        )}
                    >
                        {/* Search Header */}
                        <div className={clsx(
                            "p-4 border-b",
                            isDark ? "border-white/5" : "border-slate-100"
                        )}>
                            <div className="relative">
                                <Search className={clsx(
                                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4",
                                    isDark ? "text-white/20" : "text-slate-400"
                                )} />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search 194 countries..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={clsx(
                                        "w-full bg-transparent border-none py-3 pl-11 pr-4 text-sm font-bold focus:ring-0",
                                        isDark ? "text-white placeholder:text-white/20" : "text-slate-900 placeholder:text-slate-400"
                                    )}
                                />
                            </div>
                        </div>

                        {/* Country List */}
                        <div className="max-h-[350px] overflow-y-auto px-2 py-2 remove-scrollbar">
                            {filteredCountries.length > 0 ? (
                                filteredCountries.map((country) => (
                                    <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                            onChange(country);
                                            setIsOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className={clsx(
                                            "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                                            value === country.code
                                                ? "bg-blue-600 text-white"
                                                : isDark
                                                    ? "hover:bg-white/5 text-white/70 hover:text-white"
                                                    : "hover:bg-blue-50 text-slate-600 hover:text-blue-600"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl group-hover:scale-110 transition-transform">{country.emoji}</span>
                                            <div className="flex flex-col items-start">
                                                <span className="font-bold text-sm">{country.name}</span>
                                                <span className={clsx(
                                                    "text-[10px] font-black uppercase tracking-tighter opacity-50",
                                                    value === country.code ? "text-white" : ""
                                                )}>
                                                    {country.code}
                                                </span>
                                            </div>
                                        </div>
                                        {value === country.code && (
                                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className={clsx(
                                    "py-10 text-center flex flex-col items-center gap-3",
                                    isDark ? "text-white/20" : "text-slate-400"
                                )}>
                                    <Search className="w-12 h-12 opacity-50" />
                                    <p className="text-sm font-bold uppercase tracking-widest">No results found</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-500 pl-2">
                    {error}
                </p>
            )}
        </div>
    );
};
