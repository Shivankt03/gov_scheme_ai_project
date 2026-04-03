import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recommendationAPI, applicationAPI, profileAPI } from '../services/api';

function ScoreBar({ score, matchLevel }) {
  const scoreClass =
    score >= 0.8 ? 'score-excellent' :
    score >= 0.6 ? 'score-good' :
    score >= 0.4 ? 'score-partial' : 'score-low';

  const badgeClass =
    score >= 0.8 ? 'badge-success' :
    score >= 0.6 ? 'badge-info' :
    score >= 0.4 ? 'badge-warning' : 'badge-danger';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={`badge ${badgeClass}`}>{matchLevel}</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{Math.round(score * 100)}%</span>
      </div>
      <div className="score-bar">
        <div className={`score-bar-fill ${scoreClass}`} style={{ width: `${score * 100}%` }}></div>
      </div>
    </div>
  );
}

function ReasonsList({ reasons }) {
  return (
    <ul className="reasons-list">
      {reasons?.map((reason, i) => {
        const cls = reason.startsWith('✅') ? 'match' :
                    reason.startsWith('⚠️') || reason.startsWith('ℹ️') ? 'warning' : 'fail';
        return <li key={i} className={`reason-item ${cls}`}>{reason}</li>;
      })}
    </ul>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [hasProfile, setHasProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const profileRes = await profileAPI.getMyProfile();
      setHasProfile(!!profileRes.data?.profile);
    } catch {
      setHasProfile(false);
    }

    try {
      const [recoRes, appRes] = await Promise.all([
        recommendationAPI.getRecommendations().catch(() => ({ data: [] })),
        applicationAPI.getMyApplications().catch(() => ({ data: [] })),
      ]);
      setRecommendations(recoRes.data || []);
      setApplications(appRes.data || []);
    } catch {
      // ignore
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="page"><div className="loading"><div className="spinner"></div> Loading dashboard...</div></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Welcome, {user?.name} 👋</h1>
        <p>Your personalized government scheme dashboard</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-light)' }}>{recommendations.length}</div>
          <div className="stat-label">Recommended Schemes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--success-light)' }}>{applications.length}</div>
          <div className="stat-label">Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--primary-light)' }}>
            {applications.filter(a => a.status === 'Approved').length}
          </div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: hasProfile ? 'var(--success-light)' : 'var(--warning)' }}>
            {hasProfile ? '✓' : '!'}
          </div>
          <div className="stat-label">{hasProfile ? 'Profile Complete' : 'Profile Needed'}</div>
        </div>
      </div>

      {/* Profile prompt */}
      {!hasProfile && (
        <div className="card" style={{ borderColor: 'var(--warning)', marginBottom: '2rem' }}>
          <h3>⚠️ Complete Your Profile</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1rem' }}>
            Fill in your profile to get personalized scheme recommendations based on your age, income, occupation, and more.
          </p>
          <Link to="/profile" className="btn btn-accent">Complete Profile →</Link>
        </div>
      )}

      {/* Recommendations */}
      <h2 style={{ marginBottom: '1rem' }}>🎯 Recommended Schemes</h2>
      {recommendations.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📋</div>
          <p>{hasProfile ? 'No matching schemes found.' : 'Complete your profile to see recommendations.'}</p>
        </div>
      ) : (
        <div className="grid-2">
          {recommendations.map((scheme) => (
            <div key={scheme.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}>
              <h3 style={{ marginBottom: '0.5rem' }}>{scheme.name}</h3>
              {scheme.ministry && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                  🏢 {scheme.ministry}
                </p>
              )}
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {scheme.description?.slice(0, 120)}{scheme.description?.length > 120 ? '...' : ''}
              </p>

              <ScoreBar score={scheme.score || 0} matchLevel={scheme.match_level || 'Unknown'} />

              {expandedId === scheme.id && scheme.reasons && (
                <>
                  <ReasonsList reasons={scheme.reasons} />
                  {scheme.benefit && (
                    <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                      <strong>Benefit:</strong> {scheme.benefit}
                    </p>
                  )}
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/schemes`} className="btn btn-primary btn-sm">View Details</Link>
                    {scheme.application_link && (
                      <a href={scheme.application_link} target="_blank" rel="noreferrer" className="btn btn-accent btn-sm">
                        Apply External ↗
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
