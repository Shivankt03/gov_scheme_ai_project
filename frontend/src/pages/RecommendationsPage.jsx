import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationAPI } from '../services/api';
import { useTranslation } from '../i18n/index.js';
import './InfoPage.css';

function MatchBar({ pct, color }) {
  return (
    <div className="rec-bar-track">
      <div className="rec-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

const COLORS = ['#6c63ff', '#10b981', '#f97316', '#3b82f6', '#ec4899', '#fbbf24', '#8b5cf6', '#14b8a6'];

export default function RecommendationsPage() {
  const { t } = useTranslation();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    recommendationAPI.getRecommendations()
      .then(r => setRecs(r.data || []))
      .catch(() => setRecs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="info-page">
      <div className="info-page-header">
        <h1 className="info-title">🤖 AI Recommendations</h1>
        <p className="info-subtitle">Schemes matched to your profile by our AI eligibility engine</p>
      </div>

      {loading ? (
        <div className="info-loading"><div className="spinner"></div>Analysing your profile...</div>
      ) : recs.length === 0 ? (
        <div className="info-empty">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
          <h3>No recommendations yet</h3>
          <p>Complete your profile so our AI can find matching schemes for you.</p>
          <Link to="/profile" className="info-btn">Complete Profile →</Link>
        </div>
      ) : (
        <>
          {recs.filter(r => (r.score || 0) >= 0.6).length > 0 && (
            <>
              <h2 className="rec-section-title">✨ Top Matches</h2>
              <div className="rec-full-list">
                {recs.filter(r => (r.score || 0) >= 0.6).map((s, i) => (
                  <div
                    key={s.id}
                    className={`rec-full-card${selected === s.id ? ' expanded' : ''}`}
                    onClick={() => setSelected(selected === s.id ? null : s.id)}
                  >
                    <div className="rec-full-left">
                      <div className="rec-full-avatar" style={{ background: COLORS[i % COLORS.length] }}>
                        {s.name?.[0]}
                      </div>
                      <div>
                        <div className="rec-full-name">{s.name}</div>
                        <div className="rec-full-ministry">{s.ministry}</div>
                      </div>
                    </div>

                    <div className="rec-full-bar">
                      <MatchBar pct={Math.round((s.score || 0) * 100)} color={COLORS[i % COLORS.length]} />
                    </div>

                    <div className="rec-full-score" style={{ color: COLORS[i % COLORS.length] }}>
                      {Math.round((s.score || 0) * 100)}%
                    </div>

                    <span className={`rec-badge ${s.match_level === 'Excellent Match' ? 'excellent' : s.match_level === 'Good Match' ? 'good' : 'partial'}`}>
                      {s.match_level || 'Match'}
                    </span>

                    <Link to="/schemes" className="rec-full-btn" onClick={e => e.stopPropagation()}>
                      View Details
                    </Link>

                    {selected === s.id && (
                      <div className="rec-full-reasons">
                        <p className="rec-desc">{s.description?.slice(0, 200)}...</p>
                        {s.reasons?.map((r, ri) => (
                          <div key={ri} className={`rec-reason ${r.startsWith('✅') ? 'match' : r.startsWith('⚠️') ? 'warn' : 'fail'}`}>
                            {r}
                          </div>
                        ))}
                        {s.benefit && <div className="rec-benefit">💰 {s.benefit}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {recs.filter(r => (r.score || 0) < 0.6).length > 0 && (
            <>
              <h2 className="rec-section-title" style={{ marginTop: '2rem', fontSize: '1.2rem', color: '#9ca3af' }}>Other Potential Matches (Profile Incomplete)</h2>
              <div className="rec-full-list" style={{ opacity: 0.85 }}>
                {recs.filter(r => (r.score || 0) < 0.6).map((s, i) => (
                  <div
                    key={s.id}
                    className={`rec-full-card${selected === s.id ? ' expanded' : ''}`}
                    onClick={() => setSelected(selected === s.id ? null : s.id)}
                  >
                    <div className="rec-full-left">
                      <div className="rec-full-avatar" style={{ background: '#4b5563' }}>
                        {s.name?.[0]}
                      </div>
                      <div>
                        <div className="rec-full-name">{s.name}</div>
                        <div className="rec-full-ministry">{s.ministry}</div>
                      </div>
                    </div>

                    <div className="rec-full-bar">
                      <MatchBar pct={Math.round((s.score || 0) * 100)} color="#6b7280" />
                    </div>

                    <div className="rec-full-score" style={{ color: '#9ca3af' }}>
                      {Math.round((s.score || 0) * 100)}%
                    </div>

                    <span className="rec-badge" style={{ background: 'rgba(107,114,128,0.2)', color: '#d1d5db' }}>
                      {s.match_level || 'Info Required'}
                    </span>

                    <Link to="/schemes" className="rec-full-btn" onClick={e => e.stopPropagation()}>
                       View Details
                    </Link>

                    {selected === s.id && (
                      <div className="rec-full-reasons">
                        <p className="rec-desc">{s.description?.slice(0, 200)}...</p>
                        {s.reasons?.map((r, ri) => (
                          <div key={ri} className={`rec-reason ${r.startsWith('✅') ? 'match' : r.startsWith('⚠️') ? 'warn' : 'fail'}`}>
                            {r}
                          </div>
                        ))}
                        {s.benefit && <div className="rec-benefit">💰 {s.benefit}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
