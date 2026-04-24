/**
 * Custom i18n implementation using pure React Context.
 * Zero external dependencies — same API as react-i18next.
 * Usage: const { t, i18n } = useTranslation();
 */
import { createContext, useContext, useState, useCallback, createElement } from 'react';

// ─── Language metadata (used by Navbar switcher) ─────────────────────────────
export const LANGUAGES = [
  { code: 'en', label: 'English',   nativeLabel: 'English',    flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',     nativeLabel: 'हिन्दी',      flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi',   nativeLabel: 'मराठी',       flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil',     nativeLabel: 'தமிழ்',       flag: '🇮🇳' },
  { code: 'te', label: 'Telugu',    nativeLabel: 'తెలుగు',      flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali',   nativeLabel: 'বাংলা',       flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati',  nativeLabel: 'ગુજરાતી',     flag: '🇮🇳' },
];

// ─── Load all translation JSONs statically (Vite handles JSON imports natively) ─
import en from './en.json';
import hi from './hi.json';
import mr from './mr.json';
import ta from './ta.json';
import te from './te.json';
import bn from './bn.json';
import gu from './gu.json';

const TRANSLATIONS = { en, hi, mr, ta, te, bn, gu };

// ─── Deep key resolver: t('nav.dashboard') → translations.nav.dashboard ──────
function resolvePath(obj, path) {
  return path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object') return acc[key];
    return undefined;
  }, obj);
}

// ─── Context ──────────────────────────────────────────────────────────────────
const I18nContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('janSuvidhaLanguage') || 'en';
  });

  const changeLanguage = useCallback((code) => {
    if (TRANSLATIONS[code]) {
      setLanguage(code);
      localStorage.setItem('janSuvidhaLanguage', code);
    }
  }, []);

  // Translation function with interpolation: t('key', { name: 'John' })
  const t = useCallback((key, vars) => {
    const dict = TRANSLATIONS[language]?.translation || TRANSLATIONS.en.translation;
    const fallback = TRANSLATIONS.en.translation;

    let value = resolvePath(dict, key) ?? resolvePath(fallback, key) ?? key;

    // Handle interpolation: {{name}} → vars.name
    if (vars && typeof value === 'string') {
      value = value.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
    }

    return value;
  }, [language]);

  const value = {
    t,
    i18n: {
      language,
      changeLanguage,
    },
  };

  // Use createElement instead of JSX (this file is .js, not .jsx)
  return createElement(I18nContext.Provider, { value }, children);
}

// ─── Hook — same API as react-i18next ─────────────────────────────────────────
export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used inside <I18nProvider>');
  return ctx;
}
