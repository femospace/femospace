import React, { useState, useEffect, useRef } from 'react';
import {
    COUNTRIES,
    searchCountries,
    detectUserCountry,
    type Country,
} from '../data/countries';
import './CountrySelector.css';

interface CountrySelectorProps {
    value: string; // ISO country code
    onChange: (countryCode: string) => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
    value,
    onChange,
    error,
    required = false,
    placeholder = 'Select your country',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCountries, setFilteredCountries] = useState<Country[]>(COUNTRIES);
    const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectedCountry = COUNTRIES.find((c) => c.code === value);

    // Auto-detect user's country on mount
    useEffect(() => {
        const detectCountry = async () => {
            const detected = await detectUserCountry();
            if (detected) {
                setDetectedCountry(detected);
                // Auto-select if no value is set
                if (!value) {
                    onChange(detected);
                }
            }
        };
        detectCountry();
    }, []);

    // Filter countries based on search
    useEffect(() => {
        if (searchQuery.trim()) {
            const results = searchCountries(searchQuery);
            setFilteredCountries(results);
            setHighlightedIndex(0);
        } else {
            // Show detected country first, then alphabetical
            const sorted = [...COUNTRIES];
            if (detectedCountry) {
                const detectedIndex = sorted.findIndex((c) => c.code === detectedCountry);
                if (detectedIndex > -1) {
                    const [detected] = sorted.splice(detectedIndex, 1);
                    sorted.unshift(detected);
                }
            }
            setFilteredCountries(sorted);
        }
    }, [searchQuery, detectedCountry]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Auto-focus search when dropdown opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSelect = (countryCode: string) => {
        onChange(countryCode);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < filteredCountries.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredCountries[highlightedIndex]) {
                    handleSelect(filteredCountries[highlightedIndex].code);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setSearchQuery('');
                break;
        }
    };

    // Scroll highlighted item into view
    useEffect(() => {
        if (isOpen) {
            const highlightedElement = document.querySelector('.country-item.highlighted');
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [highlightedIndex, isOpen]);

    return (
        <div className="country-selector-wrapper" ref={dropdownRef}>
            {/* Selector Button */}
            <button
                type="button"
                className={`country-selector-button ${error ? 'error' : ''} ${isOpen ? 'open' : ''
                    }`}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-required={required}
            >
                {selectedCountry ? (
                    <div className="selected-country">
                        <span className="country-flag">{selectedCountry.flag}</span>
                        <span className="country-name">{selectedCountry.name}</span>
                        {detectedCountry === selectedCountry.code && (
                            <span className="detected-badge">Detected</span>
                        )}
                    </div>
                ) : (
                    <span className="placeholder">{placeholder}</span>
                )}
                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

            {/* Error Message */}
            {error && <div className="country-selector-error">{error}</div>}

            {/* Dropdown */}
            {isOpen && (
                <div className="country-dropdown" role="listbox">
                    {/* Search Input */}
                    <div className="country-search">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search countries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="country-search-input"
                            aria-label="Search countries"
                        />
                        {searchQuery && (
                            <button
                                className="clear-search"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Country List */}
                    <div className="country-list">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country, index) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    className={`country-item ${value === country.code ? 'selected' : ''
                                        } ${index === highlightedIndex ? 'highlighted' : ''}`}
                                    onClick={() => handleSelect(country.code)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    role="option"
                                    aria-selected={value === country.code}
                                >
                                    <span className="country-flag">{country.flag}</span>
                                    <span className="country-name">{country.name}</span>
                                    {detectedCountry === country.code && (
                                        <span className="detected-badge">Detected</span>
                                    )}
                                    {value === country.code && <span className="checkmark">✓</span>}
                                </button>
                            ))
                        ) : (
                            <div className="no-results">
                                <p>No countries found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
