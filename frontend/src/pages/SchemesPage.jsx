import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { schemeAPI, applicationAPI } from '../services/api';
import { useTranslation } from '../i18n/index.js';
import SchemeDetailModal from '../components/SchemeDetailModal';

export default function SchemesPage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const [schemes, setSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [stateFilter, setStateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [occupationFilter, setOccupationFilter] = useState(searchParams.get('occupation') || '');
  const [schemeTypeFilter, setSchemeTypeFilter] = useState(searchParams.get('schemeType') || '');
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [detailScheme, setDetailScheme] = useState(null);
  const [savedIds, setSavedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('janSuvidha_saved') || '[]')); } catch { return new Set(); }
  });

  function toggleSave(scheme) {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(scheme.id)) { next.delete(scheme.id); }
      else { next.add(scheme.id); }
      localStorage.setItem('janSuvidha_saved', JSON.stringify([...next]));
      return next;
    });
  }

  useEffect(() => {
    // Re-read URL params when they change
    const q   = searchParams.get('q') || '';
    const cat = searchParams.get('category') || '';
    const occ = searchParams.get('occupation') || '';
    const typ = searchParams.get('schemeType') || '';
    setSearchQuery(q);
    setCategoryFilter(cat);
    setOccupationFilter(occ);
    setSchemeTypeFilter(typ);
  }, [searchParams]);

  useEffect(() => {
    loadSchemes();
  }, [i18n.language, categoryFilter, occupationFilter, schemeTypeFilter]);

  async function loadSchemes() {
    setLoading(true);
    try {
      const res = await schemeAPI.list({
        state: stateFilter,
        category: categoryFilter,
        occupation: occupationFilter,
        language: i18n.language,
      });
      let data = res.data || [];
      // Client-side filter for schemeType (if backend doesn't support it)
      if (schemeTypeFilter) {
        data = data.filter(s => s.scheme_type === schemeTypeFilter || (schemeTypeFilter === 'State' && s.state !== 'All'));
      }
      setSchemes(data);
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
      const res = await schemeAPI.search(searchQuery, i18n.language);
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
      setApplyMessage(t('schemes.applicationRecorded', { name: scheme.name }));
      if (scheme.application_link) {
        setTimeout(() => {
          window.open(scheme.application_link, '_blank', 'noopener,noreferrer');
        }, 1000);
      }
      setTimeout(() => setApplyMessage(''), 5000);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.detail?.includes('already applied')) {
        setApplyMessage(t('schemes.alreadyApplied'));
        if (scheme.application_link) {
          window.open(scheme.application_link, '_blank', 'noopener,noreferrer');
        }
      } else {
        setApplyMessage(`${t('schemes.applyFailed')}: ${err.response?.data?.detail || ''}`);
      }
      setTimeout(() => setApplyMessage(''), 4000);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('schemes.title')}</h1>
        <p>{t('schemes.subtitle')}</p>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="scheme-search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-control search-input"
            placeholder={t('schemes.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <input
          type="text"
          className="form-control"
          placeholder={t('schemes.filterByState')}
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          style={{ width: '180px' }}
        />
        <button type="submit" className="btn btn-primary">{t('schemes.search')}</button>
        <button type="button" className="btn btn-outline" onClick={() => { setSearchQuery(''); setStateFilter(''); loadSchemes(); }}>
          {t('schemes.clear')}
        </button>
      </form>

      {applyMessage && (
        <div className={`alert ${applyMessage.startsWith('✅') ? 'alert-success' : applyMessage.startsWith('ℹ️') ? 'alert-info' : 'alert-error'}`}>
          {applyMessage}
        </div>
      )}

      {loading ? (
        <div className="loading"><div className="spinner"></div> {t('schemes.loadingSchemes')}</div>
      ) : schemes.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📭</div>
          <p>{t('schemes.noSchemes')}</p>
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
                  <p className="scheme-ministry">{t('schemes.ministry')} {scheme.ministry}</p>
                )}
                <p className="scheme-description">
                  {scheme.description?.slice(0, 150)}{scheme.description?.length > 150 ? '...' : ''}
                </p>

                {/* Criteria tags */}
                <div className="scheme-tags">
                  {scheme.scheme_type && <span className={`badge ${scheme.scheme_type === 'Central' ? 'badge-success' : 'badge-warning'}`}>{scheme.scheme_type}</span>}
                  {scheme.state && scheme.state !== 'All' && <span className="badge badge-info">{t('schemes.state')} {scheme.state}</span>}
                  {scheme.target_category && <span className="badge badge-info">{t('schemes.category')} {scheme.target_category}</span>}
                  {scheme.target_occupation && <span className="badge badge-info">{t('schemes.occupation')} {scheme.target_occupation}</span>}
                  {scheme.min_age && <span className="badge badge-info">{t('schemes.minAge')} {scheme.min_age}+</span>}
                  {scheme.max_income && <span className="badge badge-info">{t('schemes.maxIncome')} ≤₹{scheme.max_income?.toLocaleString()}</span>}
                </div>

                {scheme.benefit && (
                  <p className="scheme-benefit">{t('schemes.benefit')} {scheme.benefit}</p>
                )}

                {/* Actions */}
                <div className="scheme-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => { setSelectedScheme(scheme); checkEligibility(scheme.id); }}>
                    {t('schemes.checkEligibility')}
                  </button>
                  {user && (
                    <button className="btn btn-accent btn-sm" onClick={() => handleApplyAndRedirect(scheme)}>
                      {t('schemes.applyVisit')}
                    </button>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={() => setDetailScheme(scheme)}>
                    {t('schemes.viewDetails')}
                  </button>
                  <button
                    className={`btn btn-sm ${savedIds.has(scheme.id) ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => toggleSave(scheme)}
                    title={savedIds.has(scheme.id) ? 'Remove from saved' : 'Save scheme'}
                  >
                    {savedIds.has(scheme.id) ? '🔖 Saved' : '🔖 Save'}
                  </button>
                </div>

                {/* Official website link */}
                {scheme.application_link && (
                  <a href={scheme.application_link} target="_blank" rel="noreferrer" className="scheme-external-link">
                    {t('schemes.visitOfficial')}
                  </a>
                )}

                {/* Eligibility result (inline) */}
                {selectedScheme?.id === scheme.id && eligibility && (
                  <div className="eligibility-result">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className={`badge ${eligibility.eligible ? 'badge-success' : 'badge-danger'}`}>
                        {eligibility.eligible ? t('schemes.eligible') : t('schemes.notEligible')}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {t('schemes.score')}: {Math.round((eligibility.score || 0) * 100)}%
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
                  <div className="loading" style={{ padding: '1rem' }}><div className="spinner"></div> {t('schemes.checking')}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Premium Scheme Detail Modal ── */}
      <SchemeDetailModal
        scheme={detailScheme}
        onClose={() => setDetailScheme(null)}
      />
    </div>
  );
}
