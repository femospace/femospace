import { COUNTRIES as ALL_COUNTRIES } from '../data/countries';

export const COUNTRIES = ALL_COUNTRIES.map(c => ({
    code: c.code,
    name: c.name,
    flag: c.flag
}));

export const GENDERS = [
    { value: 'Male', label: 'Male', icon: '👨' },
    { value: 'Female', label: 'Female', icon: '👩' },
    { value: 'Non-binary', label: 'Non-binary', icon: '🧑' },
    { value: 'Other', label: 'Other', icon: '✨' },
    { value: 'Prefer not to say', label: 'Prefer not to say', icon: '🔒' },
];
