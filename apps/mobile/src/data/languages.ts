/**
 * GLOBAL LANGUAGE DATABASE
 * Complete ISO-639 language codes with native names
 * Supports ALL major, regional, and minority languages
 * RTL languages properly marked
 */

export interface Language {
    code: string;
    name: string; // Native name
    englishName: string;
    rtl?: boolean; // Right-to-left
    popular?: boolean;
}

export const LANGUAGES: Language[] = [
    // === POPULAR LANGUAGES (Top 30) ===
    { code: 'en', name: 'English', englishName: 'English', popular: true },
    { code: 'es', name: 'Español', englishName: 'Spanish', popular: true },
    { code: 'zh-CN', name: '中文（简体）', englishName: 'Chinese (Simplified)', popular: true },
    { code: 'zh-TW', name: '中文（繁體）', englishName: 'Chinese (Traditional)', popular: true },
    { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', popular: true },
    { code: 'ar', name: 'العربية', englishName: 'Arabic', rtl: true, popular: true },
    { code: 'bn', name: 'বাংলা', englishName: 'Bengali', popular: true },
    { code: 'pt', name: 'Português', englishName: 'Portuguese', popular: true },
    { code: 'ru', name: 'Русский', englishName: 'Russian', popular: true },
    { code: 'ja', name: '日本語', englishName: 'Japanese', popular: true },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', popular: true },
    { code: 'de', name: 'Deutsch', englishName: 'German', popular: true },
    { code: 'jv', name: 'Basa Jawa', englishName: 'Javanese', popular: true },
    { code: 'ko', name: '한국어', englishName: 'Korean', popular: true },
    { code: 'fr', name: 'Français', englishName: 'French', popular: true },
    { code: 'te', name: 'తెలుగు', englishName: 'Telugu', popular: true },
    { code: 'mr', name: 'मराठी', englishName: 'Marathi', popular: true },
    { code: 'tr', name: 'Türkçe', englishName: 'Turkish', popular: true },
    { code: 'ta', name: 'தமிழ்', englishName: 'Tamil', popular: true },
    { code: 'vi', name: 'Tiếng Việt', englishName: 'Vietnamese', popular: true },
    { code: 'ur', name: 'اردو', englishName: 'Urdu', rtl: true, popular: true },
    { code: 'it', name: 'Italiano', englishName: 'Italian', popular: true },
    { code: 'th', name: 'ไทย', englishName: 'Thai', popular: true },
    { code: 'gu', name: 'ગુજરાતી', englishName: 'Gujarati', popular: true },
    { code: 'pl', name: 'Polski', englishName: 'Polish', popular: true },
    { code: 'uk', name: 'Українська', englishName: 'Ukrainian', popular: true },
    { code: 'ml', name: 'മലയാളം', englishName: 'Malayalam', popular: true },
    { code: 'kn', name: 'ಕನ್ನಡ', englishName: 'Kannada', popular: true },
    { code: 'or', name: 'ଓଡ଼ିଆ', englishName: 'Odia', popular: true },
    { code: 'my', name: 'မြန်မာဘာသာ', englishName: 'Burmese', popular: true },

    // === MAJOR REGIONAL LANGUAGES ===
    { code: 'af', name: 'Afrikaans', englishName: 'Afrikaans' },
    { code: 'sq', name: 'Shqip', englishName: 'Albanian' },
    { code: 'am', name: 'አማርኛ', englishName: 'Amharic' },
    { code: 'hy', name: 'Հայերեն', englishName: 'Armenian' },
    { code: 'az', name: 'Azərbaycan', englishName: 'Azerbaijani' },
    { code: 'eu', name: 'Euskara', englishName: 'Basque' },
    { code: 'be', name: 'Беларуская', englishName: 'Belarusian' },
    { code: 'bs', name: 'Bosanski', englishName: 'Bosnian' },
    { code: 'bg', name: 'Български', englishName: 'Bulgarian' },
    { code: 'ca', name: 'Català', englishName: 'Catalan' },
    { code: 'ceb', name: 'Cebuano', englishName: 'Cebuano' },
    { code: 'hr', name: 'Hrvatski', englishName: 'Croatian' },
    { code: 'cs', name: 'Čeština', englishName: 'Czech' },
    { code: 'da', name: 'Dansk', englishName: 'Danish' },
    { code: 'nl', name: 'Nederlands', englishName: 'Dutch' },
    { code: 'eo', name: 'Esperanto', englishName: 'Esperanto' },
    { code: 'et', name: 'Eesti', englishName: 'Estonian' },
    { code: 'fi', name: 'Suomi', englishName: 'Finnish' },
    { code: 'gl', name: 'Galego', englishName: 'Galician' },
    { code: 'ka', name: 'ქართული', englishName: 'Georgian' },
    { code: 'el', name: 'Ελληνικά', englishName: 'Greek' },
    { code: 'ha', name: 'Hausa', englishName: 'Hausa' },
    { code: 'he', name: 'עברית', englishName: 'Hebrew', rtl: true },
    { code: 'hu', name: 'Magyar', englishName: 'Hungarian' },
    { code: 'is', name: 'Íslenska', englishName: 'Icelandic' },
    { code: 'ig', name: 'Igbo', englishName: 'Igbo' },
    { code: 'id', name: 'Bahasa Indonesia', englishName: 'Indonesian' },
    { code: 'ga', name: 'Gaeilge', englishName: 'Irish' },
    { code: 'kk', name: 'Қазақ', englishName: 'Kazakh' },
    { code: 'km', name: 'ខ្មែរ', englishName: 'Khmer' },
    { code: 'rw', name: 'Kinyarwanda', englishName: 'Kinyarwanda' },
    { code: 'ku', name: 'Kurdî', englishName: 'Kurdish' },
    { code: 'ky', name: 'Кыргызча', englishName: 'Kyrgyz' },
    { code: 'lo', name: 'ລາວ', englishName: 'Lao' },
    { code: 'lv', name: 'Latviešu', englishName: 'Latvian' },
    { code: 'lt', name: 'Lietuvių', englishName: 'Lithuanian' },
    { code: 'lb', name: 'Lëtzebuergesch', englishName: 'Luxembourgish' },
    { code: 'mk', name: 'Македонски', englishName: 'Macedonian' },
    { code: 'mg', name: 'Malagasy', englishName: 'Malagasy' },
    { code: 'ms', name: 'Bahasa Melayu', englishName: 'Malay' },
    { code: 'mt', name: 'Malti', englishName: 'Maltese' },
    { code: 'mi', name: 'Māori', englishName: 'Maori' },
    { code: 'mn', name: 'Монгол', englishName: 'Mongolian' },
    { code: 'ne', name: 'नेपाली', englishName: 'Nepali' },
    { code: 'no', name: 'Norsk', englishName: 'Norwegian' },
    { code: 'ps', name: 'پښتو', englishName: 'Pashto', rtl: true },
    { code: 'fa', name: 'فارسی', englishName: 'Persian', rtl: true },
    { code: 'ro', name: 'Română', englishName: 'Romanian' },
    { code: 'sm', name: 'Samoa', englishName: 'Samoan' },
    { code: 'sr', name: 'Српски', englishName: 'Serbian' },
    { code: 'sn', name: 'Shona', englishName: 'Shona' },
    { code: 'sd', name: 'سنڌي', englishName: 'Sindhi', rtl: true },
    { code: 'si', name: 'සිංහල', englishName: 'Sinhala' },
    { code: 'sk', name: 'Slovenčina', englishName: 'Slovak' },
    { code: 'sl', name: 'Slovenščina', englishName: 'Slovenian' },
    { code: 'so', name: 'Soomaali', englishName: 'Somali' },
    { code: 'st', name: 'Sesotho', englishName: 'Sotho' },
    { code: 'su', name: 'Basa Sunda', englishName: 'Sundanese' },
    { code: 'sw', name: 'Kiswahili', englishName: 'Swahili' },
    { code: 'sv', name: 'Svenska', englishName: 'Swedish' },
    { code: 'tg', name: 'Тоҷикӣ', englishName: 'Tajik' },
    { code: 'tl', name: 'Tagalog', englishName: 'Tagalog' },
    { code: 'tk', name: 'Türkmen', englishName: 'Turkmen' },
    { code: 'uz', name: 'Oʻzbek', englishName: 'Uzbek' },
    { code: 'cy', name: 'Cymraeg', englishName: 'Welsh' },
    { code: 'xh', name: 'isiXhosa', englishName: 'Xhosa' },
    { code: 'yi', name: 'ייִדיש', englishName: 'Yiddish', rtl: true },
    { code: 'yo', name: 'Yorùbá', englishName: 'Yoruba' },
    { code: 'zu', name: 'isiZulu', englishName: 'Zulu' },

    // === ADDITIONAL LANGUAGES ===
    { code: 'as', name: 'অসমীয়া', englishName: 'Assamese' },
    { code: 'ay', name: 'Aymar aru', englishName: 'Aymara' },
    { code: 'bm', name: 'Bamanankan', englishName: 'Bambara' },
    { code: 'bho', name: 'भोजपुरी', englishName: 'Bhojpuri' },
    { code: 'dv', name: 'ދިވެހި', englishName: 'Dhivehi', rtl: true },
    { code: 'ee', name: 'Eʋegbe', englishName: 'Ewe' },
    { code: 'fy', name: 'Frysk', englishName: 'Frisian' },
    { code: 'gn', name: 'Guarani', englishName: 'Guarani' },
    { code: 'ht', name: 'Kreyòl Ayisyen', englishName: 'Haitian Creole' },
    { code: 'haw', name: 'ʻŌlelo Hawaiʻi', englishName: 'Hawaiian' },
    { code: 'hmn', name: 'Hmoob', englishName: 'Hmong' },
    { code: 'iu', name: 'ᐃᓄᒃᑎᑐᑦ', englishName: 'Inuktitut' },
    { code: 'kri', name: 'Krio', englishName: 'Krio' },
    { code: 'ckb', name: 'کوردیی ناوەندی', englishName: 'Kurdish (Sorani)', rtl: true },
    { code: 'la', name: 'Latina', englishName: 'Latin' },
    { code: 'ln', name: 'Lingála', englishName: 'Lingala' },
    { code: 'lg', name: 'Luganda', englishName: 'Luganda' },
    { code: 'mai', name: 'मैथिली', englishName: 'Maithili' },
    { code: 'mni-Mtei', name: 'ꯃꯩꯇꯩꯂꯣꯟ', englishName: 'Meiteilon (Manipuri)' },
    { code: 'lus', name: 'Mizo ṭawng', englishName: 'Mizo' },
    { code: 'ny', name: 'Chichewa', englishName: 'Nyanja' },
    { code: 'om', name: 'Afaan Oromoo', englishName: 'Oromo' },
    { code: 'qu', name: 'Runasimi', englishName: 'Quechua' },
    { code: 'sa', name: 'संस्कृतम्', englishName: 'Sanskrit' },
    { code: 'gd', name: 'Gàidhlig', englishName: 'Scottish Gaelic' },
    { code: 'nso', name: 'Sepedi', englishName: 'Sepedi' },
    { code: 'tn', name: 'Setswana', englishName: 'Setswana' },
    { code: 'ti', name: 'ትግርኛ', englishName: 'Tigrinya' },
    { code: 'ts', name: 'Xitsonga', englishName: 'Tsonga' },
    { code: 'tt', name: 'Татар', englishName: 'Tatar' },
    { code: 'ug', name: 'ئۇيغۇرچە', englishName: 'Uyghur', rtl: true },
];

// Helper functions
export const getPopularLanguages = (): Language[] =>
    LANGUAGES.filter(lang => lang.popular);

export const getAllLanguages = (): Language[] => LANGUAGES;

export const getLanguageByCode = (code: string): Language | undefined =>
    LANGUAGES.find(lang => lang.code === code);

export const isRTL = (code: string): boolean =>
    LANGUAGES.find(lang => lang.code === code)?.rtl || false;

export const searchLanguages = (query: string): Language[] => {
    const lowerQuery = query.toLowerCase();
    return LANGUAGES.filter(
        lang =>
            lang.name.toLowerCase().includes(lowerQuery) ||
            lang.englishName.toLowerCase().includes(lowerQuery) ||
            lang.code.toLowerCase().includes(lowerQuery)
    );
};

// Language codes for easy access
export const LANGUAGE_CODES = LANGUAGES.map(lang => lang.code);

// Popular language codes
export const POPULAR_LANGUAGE_CODES = getPopularLanguages().map(lang => lang.code);
