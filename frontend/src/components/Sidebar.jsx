import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/index.js';
import { LANGUAGES } from '../i18n/index.js';
import './Sidebar.css';

const NAV_SECTIONS = [
  {
    title: 'MAIN',
    items: [
      { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
    ],
  },
  {
    title: 'DISCOVER',
    items: [
      { to: '/schemes', icon: '🔍', label: 'Find Schemes' },
      { to: '/recommendations', icon: '🤖', label: 'AI Recommendation' },
      { to: '/categories', icon: '🏷️', label: 'Categories' },
      { to: '/schemes?schemeType=State', icon: '📍', label: 'State Schemes' },
    ],
  },
  {
    title: 'MY SPACE',
    items: [
      { to: '/profile', icon: '👤', label: 'My Profile' },
      { to: '/saved', icon: '🔖', label: 'Saved Schemes' },
      { to: '/applications', icon: '📂', label: 'My Applications' },
      { to: '/activity', icon: '🕐', label: 'Activity History' },
    ],
  },
  {
    title: 'RESOURCES',
    items: [
      { to: '/docs', icon: '📖', label: 'Documentation' },
      { to: '/news', icon: '📰', label: 'News & Updates' },
      { to: '/help', icon: '💬', label: 'Help & Support' },
      { to: '/feedback', icon: '📝', label: 'Feedback' },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/');
  }

  function isActive(to) {
    if (to.includes('?')) {
      const [path, qs] = to.split('?');
      return location.pathname === path && location.search.includes(qs.split('=')[1]);
    }
    // Exact match only (avoid /schemes matching /schemes?...)
    return location.pathname === to && (to !== '/schemes' || !location.search);
  }

  return (
    <aside className="sidebar">
      {/* ── Logo ── */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>
          <img src="/ChatGPT%20Image%20Apr%2026,%202026,%2008_13_47%20PM.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.1)' }} />
        </div>
        <div>
          <div className="sidebar-logo-name">Jan Suvidha</div>
          <div className="sidebar-logo-tagline">Empowering Your Future</div>
        </div>
      </div>

      {/* ── Language (top, always visible) ── */}
      <div className="sidebar-lang-top">
        <span className="sidebar-lang-globe">🌐</span>
        <select
          className="sidebar-lang-select"
          value={i18n.language}
          onChange={e => i18n.changeLanguage(e.target.value)}
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.flag} {l.nativeLabel}</option>
          ))}
        </select>
      </div>

      {/* ── Scrollable middle (nav + lang) ── */}
      <div className="sidebar-scroll">
        <nav className="sidebar-nav">
          {NAV_SECTIONS.map(({ title, items }) => (
            <div key={title} className="sidebar-section">
              <div className="sidebar-section-label">{title}</div>
              {items.map(({ to, icon, label }) => (
                <NavLink
                  key={label + to}
                  to={to}
                  className={() => `sidebar-link${isActive(to) ? ' active' : ''}`}
                >
                  <span className="sidebar-link-icon">{icon}</span>
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

      </div>

      {/* ── Fixed bottom: upgrade + user ── */}
      <div className="sidebar-bottom">

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div className="sidebar-user-email">{user?.email || ''}</div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Logout">↩</button>
        </div>
      </div>
    </aside>
  );
}
