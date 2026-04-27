import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recommendationAPI, applicationAPI, profileAPI } from '../services/api';
import { useTranslation } from '../i18n/index.js';
import './DashboardPage.css';

// ─── Mini donut SVG ──────────────────────────────────────────────────────────
function DonutChart({ segments }) {
  const r = 54, cx = 60, cy = 60, circ = 2 * Math.PI * r;
  let offset = 0;
  const colors = ['#6c63ff', '#fbbf24', '#a78bfa', '#10b981'];
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circ;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={colors[i % colors.length]} strokeWidth="14"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset * circ / 100}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        );
        offset += seg.pct;
        return el;
      })}
      <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="18" fontWeight="800">
        {segments.reduce((s, sg) => s + sg.count, 0)}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10">
        Total
      </text>
    </svg>
  );
}

// ─── Circular match gauge ─────────────────────────────────────────────────────
function MatchGauge({ pct }) {
  const r = 64, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
      <circle cx="80" cy="80" r={r} fill="none"
        stroke="url(#gaugeGrad)" strokeWidth="14"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        transform="rotate(-90 80 80)"
      />
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6c63ff" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <text x="80" y="74" textAnchor="middle" fill="white" fontSize="26" fontWeight="900">{pct}%</text>
      <text x="80" y="93" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11">Overall Match</text>
    </svg>
  );
}

// ─── Score bar row ─────────────────────────────────────────────────────────────
function MatchBar({ label, pct, color }) {
  return (
    <div className="db-match-bar-row">
      <span className="db-match-bar-label">{label}</span>
      <div className="db-match-bar-track">
        <div className="db-match-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="db-match-bar-pct">{pct}%</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [hasProfile, setHasProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const profileRes = await profileAPI.getMyProfile();
      setHasProfile(!!profileRes.data?.profile);
    } catch { setHasProfile(false); }
    try {
      const [recoRes, appRes] = await Promise.all([
        recommendationAPI.getRecommendations().catch(() => ({ data: [] })),
        applicationAPI.getMyApplications().catch(() => ({ data: [] })),
      ]);
      setRecommendations(recoRes.data || []);
      setApplications(appRes.data || []);
    } catch {}
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="db-main">
        <div className="db-loading"><div className="spinner"></div>Loading your dashboard...</div>
      </div>
    );
  }

  // ── Derived stats ────────────────────────────────────────────────────────────────────
  // Saved count from localStorage (bookmark toggle in SchemesPage uses 'nitiAiSaved')
  const savedCount = (() => { try { return JSON.parse(localStorage.getItem('janSuvidha_saved') || '[]').length; } catch { return 0; } })();

  // Applications in progress: Applied, Submitted, Under Review all count as "in progress"
  const inProgress = applications.filter(a => ['Applied', 'Submitted', 'In Progress', 'Under Review'].includes(a.status)).length;
  const approved   = applications.filter(a => a.status === 'Approved').length;
  const highMatchRecs = recommendations.filter(r => (r.score || 0) >= 0.6);
  const topMatch   = highMatchRecs.length > 0 ? Math.round((highMatchRecs[0]?.score || 0) * 100) : 0;

  // Application status donut
  const submitted  = applications.filter(a => a.status === 'Submitted').length;
  const applied    = applications.filter(a => a.status === 'Applied').length;
  const underRev   = applications.filter(a => a.status === 'Under Review').length;
  const appStatuses = [
    { label: 'Applied',       count: applied,   pct: applications.length > 0 ? Math.round(applied / applications.length * 100) : 0 },
    { label: 'Submitted',     count: submitted, pct: applications.length > 0 ? Math.round(submitted / applications.length * 100) : 0 },
    { label: 'Under Review',  count: underRev,  pct: applications.length > 0 ? Math.round(underRev / applications.length * 100) : 0 },
    { label: 'Approved',      count: approved,  pct: applications.length > 0 ? Math.round(approved / applications.length * 100) : 0 },
  ].filter(s => s.count > 0);

  // Dynamically calculate top 3 categories based on user's highest scheme matches (from high matches)
  const categoryScores = {};
  highMatchRecs.forEach(r => {
    const cat = r.target_category || 'General';
    const score = Math.round((r.score || 0) * 100);
    if (!categoryScores[cat] || score > categoryScores[cat]) {
       categoryScores[cat] = score;
    }
  });
  
  const catBars = Object.keys(categoryScores).length > 0 
    ? Object.entries(categoryScores)
        .sort((a,b) => b[1] - a[1])
        .slice(0, 3)
        .map(([label, pct], i) => ({ label, pct, color: ['#6c63ff', '#10b981', '#fbbf24', '#ec4899'][i % 4] }))
    : [
        { label: 'Education',     pct: 0, color: '#6c63ff' },
        { label: 'Scholarship',   pct: 0, color: '#10b981' },
      ];


  const statusColors = { 'In Progress': '#fbbf24', 'Approved': '#10b981', 'Rejected': '#f87171', 'Submitted': '#6c63ff' };

  return (
    <div className="db-main">
      {/* ── Top header ── */}
      <div className="db-header">
        <div>
          <h1 className="db-welcome">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
          <p className="db-welcome-sub">Here's what's happening with your scheme journey today.</p>
        </div>
        <div className="db-header-actions">
          <div className="db-search">
            <span>🔍</span>
            <input placeholder="Search schemes, categories..." />
          </div>
          <button className="db-icon-btn">🔔</button>
          <button className="db-icon-btn">☀️</button>
        </div>
      </div>

      {/* ── Profile prompt ── */}
      {!hasProfile && (
        <div className="db-profile-prompt">
          <span>⚠️</span>
          <span>Complete your profile to get personalized scheme recommendations!</span>
          <Link to="/profile" className="db-prompt-btn">Complete Profile →</Link>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="db-stats-grid">
        {[
          { icon: '✦', val: highMatchRecs.length, label: 'Recommended',            sub: `Top matches (>60%)`,  color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', to: '/recommendations' },
          { icon: '🔖', val: savedCount,             label: 'Saved Schemes',           sub: 'View your saved schemes →',                                color: '#10b981', bg: 'rgba(16,185,129,0.1)',  to: '/saved' },
          { icon: '📋', val: inProgress,             label: 'Applications in progress', sub: 'Track your applications →',                                color: '#f97316', bg: 'rgba(249,115,22,0.1)',  to: '/applications' },
          { icon: '✅', val: approved,               label: 'Applications approved',    sub: 'Congratulations! →',                                       color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', to: '/applications' },
        ].map(({ icon, val, label, sub, color, bg, to }) => (
          <Link to={to} className="db-stat-card" key={label} style={{ '--sc': color, '--sb': bg, textDecoration: 'none' }}>
            <div className="db-stat-icon">{icon}</div>
            <div className="db-stat-body">
              <div className="db-stat-val">{val}</div>
              <div className="db-stat-label">{label}</div>
              <div className="db-stat-sub">{sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Middle 2-col ── */}
      <div className="db-mid-grid">
        {/* AI Match */}
        <div className="db-card">
          <div className="db-card-title">AI Recommendation Match</div>
          {highMatchRecs.length > 0 ? (
            <>
              <p className="db-match-tagline">
                Great match! You are highly eligible for <strong style={{ color: '#a78bfa' }}>{highMatchRecs.length} schemes</strong>
              </p>
              <div className="db-match-layout">
                <MatchGauge pct={topMatch || 85} />
                <div className="db-match-bars">
                  {catBars.map(b => <MatchBar key={b.label} {...b} />)}
                </div>
              </div>
              <Link to="/recommendations" className="db-view-all-btn">View All Recommendations →</Link>
            </>
          ) : (
            <div className="db-empty-state">
              <div className="db-empty-icon">🤖</div>
              <p>{hasProfile ? 'No matching schemes found.' : 'Complete your profile for AI recommendations.'}</p>
              {!hasProfile && <Link to="/profile" className="db-view-all-btn">Complete Profile →</Link>}
            </div>
          )}
        </div>

        {/* Application Status */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">Application Status Overview</div>
            <Link to="/applications" className="db-view-all-link">View All</Link>
          </div>
          {applications.length > 0 ? (
            <div className="db-app-status-layout">
              <DonutChart segments={appStatuses.length > 0 ? appStatuses : [{ count: 1, pct: 100 }]} />
              <div className="db-legend">
                {[
                  { label: 'In Progress', color: '#6c63ff', count: inProgress },
                  { label: 'Submitted',   color: '#fbbf24', count: Math.max(0, applications.length - inProgress - approved) },
                  { label: 'Under Review',color: '#a78bfa', count: 0 },
                  { label: 'Approved',    color: '#10b981', count: approved },
                ].map(({ label, color, count }) => (
                  <div key={label} className="db-legend-item">
                    <span className="db-legend-dot" style={{ background: color }}></span>
                    <span className="db-legend-label">{label}</span>
                    <span className="db-legend-count">{count} ({applications.length > 0 ? Math.round(count / applications.length * 100) : 0}%)</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="db-empty-state">
              <div className="db-empty-icon">📊</div>
              <p>No applications yet. Start applying to schemes!</p>
              <Link to="/schemes" className="db-view-all-btn">Browse Schemes →</Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom 2-col ── */}
      <div className="db-mid-grid">
        {/* Recently Recommended */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">Recently Recommended for You</div>
            <Link to="/recommendations" className="db-view-all-link">View All</Link>
          </div>
          {highMatchRecs.length > 0 ? (
            <div className="db-rec-list">
              {highMatchRecs.slice(0, 5).map((scheme) => (
                <div key={scheme.id} className="db-rec-item">
                  <div className="db-rec-avatar">{scheme.name?.[0] || 'S'}</div>
                  <div className="db-rec-info">
                    <div className="db-rec-name">{scheme.name}</div>
                    <div className="db-rec-cat">{scheme.target_category || 'General'}</div>
                  </div>
                  <div className="db-rec-match">{Math.round((scheme.score || 0.8) * 100)}% Match</div>
                  <Link to={`/recommendations`} className="db-rec-btn">View Details</Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="db-empty-state">
              <div className="db-empty-icon">📋</div>
              <p>{hasProfile ? 'No recommendations yet.' : 'Complete your profile to get recommendations.'}</p>
            </div>
          )}
        </div>

        {/* Latest Updates / Recent Applications */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">Latest Updates</div>
            <Link to="/applications" className="db-view-all-link">View All</Link>
          </div>
          <div className="db-updates-list">
            {applications.length > 0 ? applications.slice(0, 3).map((app, i) => (
              <div key={app.id} className="db-update-item">
                <div className="db-update-icon" style={{ background: statusColors[app.status] || '#6c63ff' }}>
                  {app.status === 'Approved' ? '✅' : app.status === 'Rejected' ? '❌' : '📋'}
                </div>
                <div className="db-update-info">
                  <div className="db-update-title">Application status: {app.status}</div>
                  <div className="db-update-sub">{app.scheme?.name || 'Government Scheme'}</div>
                  <div className="db-update-time">{i + 1} day{i !== 0 ? 's' : ''} ago</div>
                </div>
              </div>
            )) : [
              { icon: '📢', color: '#7c3aed', title: 'New scheme launched in your state', sub: 'Check Schemes page for latest additions', time: '2 hours ago' },
              { icon: '⏰', color: '#f97316', title: 'Application deadline reminder', sub: 'PM Scholarship Scheme — Apply soon!', time: '1 day ago' },
              { icon: '🔔', color: '#10b981', title: 'Profile setup recommended', sub: 'Get personalized AI recommendations', time: 'Just now' },
            ].map(({ icon, color, title, sub, time }) => (
              <div key={title} className="db-update-item">
                <div className="db-update-icon" style={{ background: color }}>{icon}</div>
                <div className="db-update-info">
                  <div className="db-update-title">{title}</div>
                  <div className="db-update-sub">{sub}</div>
                  <div className="db-update-time">{time}</div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/applications" className="db-view-all-btn" style={{ marginTop: '1rem' }}>View All Updates →</Link>
        </div>
      </div>

      {/* ── Chat CTA banner ── */}
      <div className="db-chat-banner">
        <div className="db-chat-bot">🤖</div>
        <div className="db-chat-text">
          <div className="db-chat-title">Need Help Finding the Right Scheme?</div>
          <div className="db-chat-sub">Chat with our AI assistant to get personalized recommendations</div>
        </div>
        <button
          className="db-chat-btn"
          onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
        >
          💬 Chat with AI
        </button>
      </div>
    </div>
  );
}
