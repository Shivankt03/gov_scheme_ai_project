import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/index.js';

const GitHubIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.835 2.809 1.305 3.492.998.108-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const TwitterIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.594 0-6.492 2.901-6.492 6.492 0 .512.057 1.01.173 1.496-5.405-.271-10.187-2.86-13.387-6.795-.56.96-.883 2.077-.883 3.256 0 2.254 1.147 4.243 2.887 5.419-.847-.025-1.649-.26-2.35-.647-.029.749.208 1.45.746 2.005.679.679 1.574 1.186 2.603 1.307-.207.056-.424.086-.647.086-.159 0-.315-.015-.467-.045.767 2.405 2.989 4.168 5.636 4.217-2.868 2.247-6.49 3.586-10.462 3.586-.681 0-1.35-.039-2.006-.118 3.692 2.378 8.016 3.766 12.692 3.766 15.232 0 23.52-12.69 23.52-23.52 0-.357-.012-.71-.031-1.063z" />
  </svg>
);

const LinkedInIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#07090F] text-gray-100 font-sans selection:bg-niti-primary selection:text-white overflow-x-hidden">
      {/* Navbar spacer */}
      <div className="h-16"></div>

      {/* Hero Section */}
      <main className="relative z-10 overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] bg-niti-primary/20 rounded-full blur-[120px] -z-10 animate-glow-pulse"></div>
        <div className="absolute bottom-[-100px] right-[-80px] w-[500px] h-[500px] bg-niti-accent/10 rounded-full blur-[120px] -z-10 animate-glow-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32">
          {/* Top Pill / Badge */}
          <div className="flex justify-center mb-8">
            <Link to="/schemes" className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium hover:bg-white/5 bg-white/[0.02] backdrop-blur-md transition-colors">
              <div className="flex -space-x-2">
                <img className="w-5 h-5 rounded-full border border-[#07090F]" src="https://i.pravatar.cc/150?img=1" alt="User 1" />
                <img className="w-5 h-5 rounded-full border border-[#07090F]" src="https://i.pravatar.cc/150?img=2" alt="User 2" />
                <img className="w-5 h-5 rounded-full border border-[#07090F]" src="https://i.pravatar.cc/150?img=3" alt="User 3" />
              </div>
              <span className="text-gray-300 hidden sm:inline ml-1 font-semibold">
                Join 2400+ citizens finding schemes
              </span>
              <span className="text-gray-300 sm:hidden ml-1 font-semibold">
                Explore Platform
              </span>
              <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="text-center relative z-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl mb-6">
              <span className="block text-white mb-2">{t('home.heroLine1')}</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-niti-primary via-niti-light to-niti-cyan mb-2 pb-1">
                {t('home.heroLine2')}
              </span>
              <span className="block text-white pb-2">{t('home.heroLine3')}</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-400 max-w-xl md:max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              {t('home.heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link to="/dashboard" className="h-11 px-8 min-w-[200px] bg-white text-[#07090F] hover:bg-gray-200 inline-flex items-center justify-center rounded-md text-base font-semibold transition-transform hover:scale-105 shadow-[0_4px_14px_0_rgba(255,255,255,0.25)]">
                  {t('home.goToDashboard')}
                </Link>
              ) : (
                <>
                  <Link to="/register" className="h-11 px-8 min-w-[200px] bg-white text-[#07090F] hover:bg-gray-200 inline-flex items-center justify-center rounded-md text-base font-semibold transition-all hover:scale-105 shadow-[0_4px_14px_0_rgba(255,255,255,0.25)]">
                    {t('home.getStartedFree')}
                  </Link>
                  <Link to="/login" className="h-11 px-8 min-w-[200px] bg-[#111421] text-white border border-white/10 hover:bg-[#1a1f33] inline-flex items-center justify-center rounded-md text-base font-semibold transition-colors">
                    {t('home.loginToAccount')}
                  </Link>
                </>
              )}
            </div>
            
            {/* Trust Banner integrated cleanly */}
            <div className="mt-16 sm:mt-24 flex flex-col items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
              <p className="text-xs font-bold text-niti-light uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t('home.trustPoweredBy')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <span>{t('home.trustOfficial')}</span>
                </div>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/10"></div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  <span>{t('home.trustUpdated')}</span>
                </div>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/10"></div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                  <span>{t('home.trustNoLogin')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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

      {/* How It Works Section */}
      <section className="py-24 px-6 relative bg-[#0A0D14]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-niti-success font-semibold uppercase tracking-widest text-sm mb-3">{t('home.howItWorks')}</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">{t('home.howItWorksHeading')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[30px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-niti-primary/10 via-niti-cyan/30 to-niti-success/10 -z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-[#0F1320] border-2 border-niti-primary/30 flex items-center justify-center text-2xl font-black text-white mb-6 group-hover:bg-niti-primary group-hover:border-niti-primary transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.1)] group-hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('home.step1Title')}</h3>
              <p className="text-[#7B8DB0] max-w-sm">{t('home.step1Desc')}</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group mt-8 md:mt-0">
              <div className="w-16 h-16 rounded-2xl bg-[#0F1320] border-2 border-niti-cyan/30 flex items-center justify-center text-2xl font-black text-white mb-6 group-hover:bg-niti-cyan group-hover:border-niti-cyan transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('home.step2Title')}</h3>
              <p className="text-[#7B8DB0] max-w-sm">{t('home.step2Desc')}</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group mt-8 md:mt-0">
              <div className="w-16 h-16 rounded-2xl bg-[#0F1320] border-2 border-niti-success/30 flex items-center justify-center text-2xl font-black text-white mb-6 group-hover:bg-niti-success group-hover:border-niti-success transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('home.step3Title')}</h3>
              <p className="text-[#7B8DB0] max-w-sm">{t('home.step3Desc')}</p>
            </div>
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
      <footer className="bg-gradient-to-r from-[#07090F] to-[#0A0D14] text-white py-14 px-6 font-sans border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <img src="/ChatGPT%20Image%20Apr%2026,%202026,%2008_13_47%20PM.png" alt="JanSuvidha Logo" className="w-12 h-12 object-contain rounded-xl" />
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-niti-primary to-niti-light tracking-tight">
                JanSuvidha
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Innovating for a better tomorrow. We are committed to delivering high-quality AI solutions that empower citizens and bridge the gap with government welfare schemes.
            </p>
            <div className="flex space-x-5 pt-3">
              <a href="#" className="text-gray-500 hover:text-niti-light transition-transform transform hover:scale-110">
                <GitHubIcon size={24} />
              </a>
              <a href="#" className="text-gray-500 hover:text-niti-light transition-transform transform hover:scale-110">
                <TwitterIcon size={24} />
              </a>
              <a href="#" className="text-gray-500 hover:text-niti-light transition-transform transform hover:scale-110">
                <LinkedInIcon size={24} />
              </a>
            </div>
          </div>
          <div className="space-y-5 text-left md:ml-8">
            <h3 className="text-lg font-bold text-gray-100">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-niti-light transition-colors text-sm"> {/* Changed text size */}
                  Home
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="text-gray-400 hover:text-niti-light transition-colors text-sm">
                  Find Schemes
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-niti-light transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-niti-light transition-colors text-sm">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-5 text-left">
            <h3 className="text-lg font-bold text-gray-100">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-niti-light transition-colors text-sm">
                  Help / Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-niti-light transition-colors text-sm">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-niti-light transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-niti-light transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-5 text-left">
            <h3 className="text-lg font-bold text-gray-100">
              Contact Us
            </h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-400">
                New Delhi, India
              </p>
              <p className="text-gray-400">
                Email: Shivanktiwari423@gmail.com
              </p>
              <p className="text-gray-400">
                Phone: +91 7354112726
              </p>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm pt-8 mt-12 border-t border-white/10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            &copy; {new Date().getFullYear()} JanSuvidha. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Empowering citizens with <span className="text-red-500 text-lg">&hearts;</span> by Team JANSUVIDHA
          </p>
        </div>
      </footer>
    </div>
  );
}
