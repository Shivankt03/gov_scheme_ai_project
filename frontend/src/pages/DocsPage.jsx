import { Link } from 'react-router-dom';
import './InfoPage.css';

const DOCS = [
  { icon: '🚀', title: 'Getting Started', desc: 'Learn how to set up your profile and get personalized scheme recommendations from our AI engine.', link: '/profile' },
  { icon: '🤖', title: 'AI Recommendation Engine', desc: 'Our hybrid AI system matches your profile against 40+ schemes using eligibility scoring and semantic analysis.', link: '/recommendations' },
  { icon: '🌐', title: 'Multilanguage Support', desc: 'Jan Suvidha supports 7 Indian languages — English, Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati.', link: null },
  { icon: '📱', title: 'Telegram Bot', desc: 'Access scheme recommendations directly on Telegram. Type /start on the Jan Suvidha bot to get started.', link: null },
  { icon: '📋', title: 'Application Tracking', desc: 'Track your scheme applications with real-time status updates from submission to approval.', link: '/applications' },
  { icon: '💡', title: 'Eligibility Check', desc: 'Instantly check your eligibility for any scheme based on your age, income, state, category, and occupation.', link: '/schemes' },
];

const TECH = [
  { label: 'Frontend', value: 'React 19 + Vite + Custom i18n' },
  { label: 'Backend',  value: 'FastAPI + SQLAlchemy + Uvicorn' },
  { label: 'AI Engine', value: 'Groq LLaMA 3.3 + Google Gemini' },
  { label: 'Database', value: 'SQLite (dev) / PostgreSQL (prod)' },
  { label: 'Auth',     value: 'JWT Bearer Token' },
  { label: 'Bot',      value: 'Telegram Bot API' },
];

export default function DocsPage() {
  return (
    <div className="info-page">
      <div className="info-page-header">
        <h1 className="info-title">📖 Documentation</h1>
        <p className="info-subtitle">Everything you need to know about using Jan Suvidha</p>
      </div>

      <div className="doc-grid">
        {DOCS.map(d => (
          <div key={d.title} className="doc-card">
            <div className="doc-icon">{d.icon}</div>
            <h3 className="doc-title">{d.title}</h3>
            <p className="doc-desc">{d.desc}</p>
            {d.link && <Link to={d.link} className="doc-link">Learn more →</Link>}
          </div>
        ))}
      </div>

      <div className="info-section">
        <h2 className="info-section-title">🛠️ Tech Stack</h2>
        <div className="tech-table">
          {TECH.map(t => (
            <div key={t.label} className="tech-row">
              <span className="tech-label">{t.label}</span>
              <span className="tech-value">{t.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title">⚡ Quick Links</h2>
        <div className="quick-links">
          {[
            { to: '/profile',      icon: '👤', label: 'Setup Profile' },
            { to: '/schemes',      icon: '📋', label: 'Browse Schemes' },
            { to: '/applications', icon: '📂', label: 'My Applications' },
            { to: '/feedback',     icon: '📝', label: 'Give Feedback' },
          ].map(l => (
            <Link key={l.to} to={l.to} className="quick-link-btn">
              {l.icon} {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
