import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/index.js';
import { LANGUAGES } from '../i18n/index.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) =>
    location.pathname === path
      ? 'text-niti-light border-b-2 border-niti-light font-semibold'
      : 'text-[#7B8DB0] hover:text-white';

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  function changeLanguage(code) {
    i18n.changeLanguage(code);
    localStorage.setItem('janSuvidhaLanguage', code);
    setLangOpen(false);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#07090F]/85 backdrop-blur-xl border-b border-niti-primary/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:shadow-[0_0_25px_rgba(124,58,237,0.7)] transition-all duration-300 overflow-hidden text-center">
            <img src="/ChatGPT%20Image%20Apr%2026,%202026,%2008_13_47%20PM.png" alt="Logo" className="w-full h-full object-contain scale-110" />
          </div>
          <span className="text-xl font-extrabold tracking-wide text-white">
            JanSuvidha
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-5">
          {user ? (
            <>
              <li><Link to="/dashboard" className={`text-sm font-medium pb-1 transition-all ${isActive('/dashboard')}`}>{t('nav.dashboard')}</Link></li>
              <li><Link to="/schemes" className={`text-sm font-medium pb-1 transition-all ${isActive('/schemes')}`}>{t('nav.schemes')}</Link></li>
              <li><Link to="/profile" className={`text-sm font-medium pb-1 transition-all ${isActive('/profile')}`}>{t('nav.profile')}</Link></li>
              <li><Link to="/applications" className={`text-sm font-medium pb-1 transition-all ${isActive('/applications')}`}>{t('nav.applications')}</Link></li>
              {user.role === 'admin' && (
                <li>
                  <Link to="/admin" className="px-3 py-1.5 text-sm rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium">
                    ⚙ {t('nav.admin')}
                  </Link>
                </li>
              )}
            </>
          ) : (
            <>
              <li><Link to="/login" className="text-sm font-medium text-[#7B8DB0] hover:text-white transition-colors">{t('nav.login')}</Link></li>
              <li>
                <Link to="/register"
                  className="px-5 py-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-niti-primary to-niti-light hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-105 transition-all duration-200"
                >
                  {t('nav.getStarted')}
                </Link>
              </li>
            </>
          )}

          {/* 🌐 Language Switcher */}
          <li className="relative" ref={dropdownRef}>
            <button
              id="language-switcher-btn"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-sm font-medium text-[#7B8DB0] hover:text-white hover:border-niti-primary/50 hover:bg-niti-primary/10 transition-all duration-200"
              title={t('nav.language')}
            >
              <span className="text-base">{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.nativeLabel}</span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-[#0f1320]/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                <div className="p-1.5">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      id={`lang-${lang.code}`}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${i18n.language === lang.code
                        ? 'bg-niti-primary/20 text-niti-light font-semibold'
                        : 'text-[#7B8DB0] hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="font-medium">{lang.nativeLabel}</span>
                      <span className="ml-auto text-xs text-[#3D4E6E]">{lang.label}</span>
                      {i18n.language === lang.code && (
                        <span className="text-niti-light text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </li>

          {/* Logout */}
          {user && (
            <li>
              <button
                onClick={logout}
                className="ml-2 px-4 py-1.5 rounded-xl border border-white/10 text-sm font-medium text-[#7B8DB0] hover:text-white hover:border-white/30 transition-all"
              >
                {t('nav.logout')}
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
