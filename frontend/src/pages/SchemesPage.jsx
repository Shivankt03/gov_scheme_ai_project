import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { schemeAPI, applicationAPI } from '../services/api';

export default function SchemesPage() {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [detailScheme, setDetailScheme] = useState(null);

  useEffect(() => {
    loadSchemes();
  }, []);

  async function loadSchemes() {
    setLoading(true);
    try {
      const res = await schemeAPI.list({ state: stateFilter });
      setSchemes(res.data);
    } catch {
      setSchemes([]);
    }
    setLoading(false);
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadSchemes();
      return;
    }
    setLoading(true);
    try {
      const res = await schemeAPI.search(searchQuery);
      setSchemes(res.data);
    } catch {
      setSchemes([]);
    }
    setLoading(false);
  }

  async function checkEligibility(schemeId) {
    if (!user) return;
    setCheckingEligibility(true);
    setEligibility(null);
    try {
      const res = await schemeAPI.checkEligibility(schemeId, user.id);
      setEligibility(res.data);
    } catch (err) {
      setEligibility({ eligible: false, score: 0, reasons: [err.response?.data?.detail || 'Could not check eligibility'] });
    }
    setCheckingEligibility(false);
  }

  async function handleApplyAndRedirect(scheme) {
    try {
      await applicationAPI.apply(scheme.id);
      setApplyMessage(`✅ Application recorded for "${scheme.name}"! Redirecting to official website...`);
      // Open govt website in a new tab
      if (scheme.application_link) {
        setTimeout(() => {
          window.open(scheme.application_link, '_blank', 'noopener,noreferrer');
        }, 1000);
      }
      setTimeout(() => setApplyMessage(''), 5000);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.detail?.includes('already applied')) {
        // Already applied — just open the link
        setApplyMessage(`ℹ️ You already applied. Opening official website...`);
        if (scheme.application_link) {
          window.open(scheme.application_link, '_blank', 'noopener,noreferrer');
        }
      } else {
        setApplyMessage(`❌ ${err.response?.data?.detail || 'Failed to apply'}`);
      }
      setTimeout(() => setApplyMessage(''), 4000);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>📋 Government Schemes</h1>
        <p>Browse, search, and apply for government schemes</p>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="scheme-search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search schemes by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="Filter by state"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          style={{ width: '180px' }}
        />
        <button type="submit" className="btn btn-primary">Search</button>
        <button type="button" className="btn btn-outline" onClick={() => { setSearchQuery(''); setStateFilter(''); loadSchemes(); }}>
          Clear
        </button>
      </form>

      {applyMessage && (
        <div className={`alert ${applyMessage.startsWith('✅') ? 'alert-success' : applyMessage.startsWith('ℹ️') ? 'alert-info' : 'alert-error'}`}>
          {applyMessage}
        </div>
      )}

      {loading ? (
        <div className="loading"><div className="spinner"></div> Loading schemes...</div>
      ) : schemes.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📭</div>
          <p>No schemes found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid-2">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="scheme-card card">
              {/* Accent stripe */}
              <div className="scheme-card-accent"></div>
              
              <div className="scheme-card-body">
                <h3>{scheme.name}</h3>
                {scheme.ministry && (
                  <p className="scheme-ministry">🏢 {scheme.ministry}</p>
                )}
                <p className="scheme-description">
                  {scheme.description?.slice(0, 150)}{scheme.description?.length > 150 ? '...' : ''}
                </p>

                {/* Criteria tags */}
                <div className="scheme-tags">
                  {scheme.state && <span className="badge badge-info">📍 {scheme.state}</span>}
                  {scheme.target_category && <span className="badge badge-info">🏷️ {scheme.target_category}</span>}
                  {scheme.target_occupation && <span className="badge badge-info">💼 {scheme.target_occupation}</span>}
                  {scheme.min_age && <span className="badge badge-info">🎂 {scheme.min_age}+</span>}
                  {scheme.max_income && <span className="badge badge-info">💰 ≤₹{scheme.max_income?.toLocaleString()}</span>}
                </div>

                {scheme.benefit && (
                  <p className="scheme-benefit">✨ {scheme.benefit}</p>
                )}

                {/* Actions */}
                <div className="scheme-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => { setSelectedScheme(scheme); checkEligibility(scheme.id); }}>
                    Check Eligibility
                  </button>
                  {user && (
                    <button className="btn btn-accent btn-sm" onClick={() => handleApplyAndRedirect(scheme)}>
                      🚀 Apply & Visit Website
                    </button>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={() => setDetailScheme(scheme)}>
                    View Details
                  </button>
                </div>

                {/* Official website link */}
                {scheme.application_link && (
                  <a href={scheme.application_link} target="_blank" rel="noreferrer" className="scheme-external-link">
                    🌐 Visit Official Website ↗
                  </a>
                )}

                {/* Eligibility result (inline) */}
                {selectedScheme?.id === scheme.id && eligibility && (
                  <div className="eligibility-result">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className={`badge ${eligibility.eligible ? 'badge-success' : 'badge-danger'}`}>
                        {eligibility.eligible ? '✅ Eligible' : '❌ Not Eligible'}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Score: {Math.round((eligibility.score || 0) * 100)}%
                      </span>
                    </div>
                    <ul className="reasons-list">
                      {eligibility.reasons?.map((r, i) => {
                        const cls = r.startsWith('✅') ? 'match' : r.startsWith('⚠️') || r.startsWith('ℹ️') ? 'warning' : 'fail';
                        return <li key={i} className={`reason-item ${cls}`}>{r}</li>;
                      })}
                    </ul>
                  </div>
                )}
                {selectedScheme?.id === scheme.id && checkingEligibility && (
                  <div className="loading" style={{ padding: '1rem' }}><div className="spinner"></div> Checking...</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scheme Detail Modal */}
      {detailScheme && (
        <div className="modal-overlay" onClick={() => setDetailScheme(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDetailScheme(null)}>✕</button>
            <div className="modal-header-accent"></div>
            <h2>{detailScheme.name}</h2>
            {detailScheme.ministry && (
              <p className="scheme-ministry" style={{ marginBottom: '1rem' }}>🏢 {detailScheme.ministry}</p>
            )}
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {detailScheme.description}
            </p>

            <div className="modal-info-grid">
              {detailScheme.state && (
                <div className="modal-info-item">
                  <span className="modal-info-label">📍 State</span>
                  <span className="modal-info-value">{detailScheme.state}</span>
                </div>
              )}
              {detailScheme.target_category && (
                <div className="modal-info-item">
                  <span className="modal-info-label">🏷️ Category</span>
                  <span className="modal-info-value">{detailScheme.target_category}</span>
                </div>
              )}
              {detailScheme.target_occupation && (
                <div className="modal-info-item">
                  <span className="modal-info-label">💼 Occupation</span>
                  <span className="modal-info-value">{detailScheme.target_occupation}</span>
                </div>
              )}
              {detailScheme.min_age && (
                <div className="modal-info-item">
                  <span className="modal-info-label">🎂 Min Age</span>
                  <span className="modal-info-value">{detailScheme.min_age}+</span>
                </div>
              )}
              {detailScheme.max_income && (
                <div className="modal-info-item">
                  <span className="modal-info-label">💰 Max Income</span>
                  <span className="modal-info-value">₹{detailScheme.max_income?.toLocaleString()}</span>
                </div>
              )}
              {detailScheme.benefit && (
                <div className="modal-info-item" style={{ gridColumn: '1 / -1' }}>
                  <span className="modal-info-label">✨ Benefit</span>
                  <span className="modal-info-value">{detailScheme.benefit}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {detailScheme.application_link && (
                <a href={detailScheme.application_link} target="_blank" rel="noreferrer" className="btn btn-accent">
                  🌐 Visit Official Website ↗
                </a>
              )}
              <button className="btn btn-primary" onClick={() => { handleApplyAndRedirect(detailScheme); setDetailScheme(null); }}>
                🚀 Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
