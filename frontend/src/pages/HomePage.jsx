import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/index.js';

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#07090F] text-gray-100 font-sans selection:bg-niti-primary selection:text-white overflow-x-hidden">
      {/* Navbar spacer */}
      <div className="h-16"></div>

      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-40 flex flex-col items-center justify-center text-center overflow-hidden">

        {/* Background Gradient Orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] bg-niti-primary/30 rounded-full blur-[120px] -z-10 animate-glow-pulse"></div>
        <div className="absolute bottom-[-100px] right-[-80px] w-[500px] h-[500px] bg-niti-accent/20 rounded-full blur-[120px] -z-10 animate-glow-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-niti-cyan/5 rounded-full blur-[150px] -z-10"></div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
          <span className="text-white">{t('home.heroLine1')}</span>
          <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-niti-primary via-niti-light to-niti-cyan">
            {t('home.heroLine2')}
          </span>
          <span className="text-white">{t('home.heroLine3')}</span>
        </h1>

        <p className="text-lg md:text-xl text-[#7B8DB0] mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          {t('home.heroSubtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link to="/dashboard"
              className="px-10 py-4 w-full sm:w-auto rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-niti-primary to-niti-light hover:scale-105 hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-all duration-300"
            >
              {t('home.goToDashboard')}
            </Link>
          ) : (
            <>
              <Link to="/register"
                className="px-10 py-4 w-full sm:w-auto rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-niti-accent to-niti-accent-light hover:scale-105 hover:shadow-[0_0_40px_rgba(255,79,31,0.5)] transition-all duration-300"
              >
                {t('home.getStartedFree')}
              </Link>
              <Link to="/login"
                className="px-10 py-4 w-full sm:w-auto rounded-2xl font-bold text-lg text-white border border-niti-primary/50 bg-niti-primary/10 hover:bg-niti-primary/20 hover:border-niti-primary transition-all duration-300"
              >
                {t('home.loginToAccount')}
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 px-6 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-black text-niti-light">100+</p>
            <p className="text-xs md:text-sm text-[#7B8DB0] mt-1">{t('home.stats.schemes')}</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-niti-accent-light">{t('home.stats.aiPowered')}</p>
            <p className="text-xs md:text-sm text-[#7B8DB0] mt-1">{t('home.stats.eligibilityEngine')}</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-niti-success">{t('home.stats.free')}</p>
            <p className="text-xs md:text-sm text-[#7B8DB0] mt-1">{t('home.stats.alwaysForever')}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-niti-light font-semibold uppercase tracking-widest text-sm mb-3">{t('home.why')}</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">{t('home.featuresHeading')}</h2>
            <p className="text-[#7B8DB0] max-w-xl mx-auto text-lg">{t('home.featuresSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 - Chatbot */}
            <div className="relative p-8 rounded-3xl bg-[#0F1320] border border-white/5 hover:-translate-y-3 hover:border-niti-primary/60 hover:shadow-[0_0_50px_rgba(124,58,237,0.2)] transition-all duration-400 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-niti-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-niti-primary to-niti-light flex items-center justify-center mb-6 text-2xl shadow-[0_4px_20px_rgba(124,58,237,0.4)] group-hover:scale-110 transition-transform duration-300">
                  🤖
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t('home.feature1Title')}</h3>
                <p className="text-[#7B8DB0] leading-relaxed">{t('home.feature1Desc')}</p>
              </div>
            </div>

            {/* Feature 2 - Eligibility (Center, featured) */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-b from-niti-primary/20 to-[#0F1320] border border-niti-primary/40 hover:-translate-y-3 hover:shadow-[0_0_60px_rgba(124,58,237,0.3)] transition-all duration-400 group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-niti-primary to-niti-light rounded-t-3xl"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-niti-accent to-niti-accent-light flex items-center justify-center mb-6 text-2xl shadow-[0_4px_20px_rgba(255,79,31,0.4)] group-hover:scale-110 transition-transform duration-300">
                  ⚡
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-niti-primary/30 text-niti-light text-xs font-bold uppercase tracking-wider mb-4">{t('home.feature2Badge')}</div>
                <h3 className="text-xl font-bold text-white mb-3">{t('home.feature2Title')}</h3>
                <p className="text-[#7B8DB0] leading-relaxed">{t('home.feature2Desc')}</p>
              </div>
            </div>

            {/* Feature 3 - Direct Apply */}
            <div className="relative p-8 rounded-3xl bg-[#0F1320] border border-white/5 hover:-translate-y-3 hover:border-niti-success/60 hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] transition-all duration-400 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-niti-success/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-niti-success to-emerald-600 flex items-center justify-center mb-6 text-2xl shadow-[0_4px_20px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-300">
                  🔗
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t('home.feature3Title')}</h3>
                <p className="text-[#7B8DB0] leading-relaxed">{t('home.feature3Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050709] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-niti-primary to-niti-light flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <span className="text-lg font-bold text-white">Niti<span className="text-niti-light">AI</span></span>
            <span className="text-[#3D4E6E] text-sm">{t('home.footerTagline')}</span>
          </div>
          <div className="flex gap-6 text-sm text-[#7B8DB0]">
            <a href="#" className="hover:text-white transition-colors">{t('home.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('home.terms')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('home.contact')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
