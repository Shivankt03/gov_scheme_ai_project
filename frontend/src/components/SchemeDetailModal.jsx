import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationAPI } from '../services/api';
import { useTranslation } from '../i18n/index.js';
import './SchemeDetailModal.css';


// ─── Helper: render a bullet/numbered list from a newline or comma string ───
function DetailList({ text }) {
  if (!text) return <p className="sdd-empty">—</p>;
  const lines = text
    .split(/\n|•|·/)
    .map(l => l.trim())
    .filter(Boolean);
  if (lines.length === 1) return <p className="sdd-text">{text}</p>;
  return (
    <ul className="sdd-list">
      {lines.map((line, i) => (
        <li key={i} className="sdd-list-item">
          <span className="sdd-bullet">▸</span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Helper: numbered steps for How to Apply ────────────────────────────────
function StepList({ text }) {
  if (!text) return <p className="sdd-empty">—</p>;
  const lines = text
    .split(/\n/)
    .map(l => l.trim())
    .filter(Boolean);
  return (
    <ol className="sdd-steps">
      {lines.map((line, i) => {
        // Strip "Step N:" prefix if present
        const clean = line.replace(/^step\s*\d+[:.]\s*/i, '');
        return (
          <li key={i} className="sdd-step">
            <span className="sdd-step-num">{i + 1}</span>
            <span className="sdd-step-text">{clean}</span>
          </li>
        );
      })}
    </ol>
  );
}

// ─── Eligibility pill row ────────────────────────────────────────────────────
function EligibilityGrid({ scheme, t }) {
  const items = [
    scheme.target_category && { icon: '🏷️', label: t('schemes.category'), val: scheme.target_category },
    scheme.target_occupation && { icon: '💼', label: t('schemes.occupation'), val: scheme.target_occupation },
    scheme.state && { icon: '📍', label: t('schemes.state'), val: scheme.state },
    scheme.min_age && { icon: '🎂', label: t('schemes.minAge'), val: `${scheme.min_age}+ years` },
    scheme.max_income && { icon: '💰', label: t('schemes.maxIncome'), val: `≤ ₹${scheme.max_income.toLocaleString('en-IN')}` },
    scheme.scheme_type && { icon: '🏛️', label: t('schemes.type'), val: scheme.scheme_type },
  ].filter(Boolean);

  if (!items.length) return <p className="sdd-empty">Open to all citizens.</p>;
  return (
    <div className="sdd-eligibility-grid">
      {items.map(({ icon, label, val }) => (
        <div key={label} className="sdd-eligibility-pill">
          <span className="sdd-pill-icon">{icon}</span>
          <div>
            <span className="sdd-pill-label">{label}</span>
            <span className="sdd-pill-value">{val}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Modal Component ────────────────────────────────────────────────────
export default function SchemeDetailModal({ scheme, onClose }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  if (!scheme) return null;

  async function handleApply() {
    if (!user) return;
    setApplying(true);
    try {
      await applicationAPI.apply(scheme.id);
      setApplyMsg('success');
    } catch (err) {
      setApplyMsg(err.response?.status === 400 ? 'already' : 'error');
    } finally {
      setApplying(false);
      if (scheme.application_link) {
        setTimeout(() => window.open(scheme.application_link, '_blank', 'noopener,noreferrer'), 800);
      }
    }
  }

  const tabs = [
    { id: 'overview',   icon: '📖', label: 'Overview' },
    { id: 'eligibility',icon: '✅', label: 'Eligibility' },
    { id: 'benefits',   icon: '💰', label: 'Benefits' },
    { id: 'documents',  icon: '📄', label: 'Documents' },
    { id: 'howto',      icon: '📝', label: 'How to Apply' },
  ];

  return (
    <div className="sdm-overlay" onClick={onClose}>
      <div className="sdm-panel" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="sdm-header">
          <div className="sdm-header-bg"></div>
          <div className="sdm-header-content">
            <div className="sdm-badges">
              {scheme.scheme_type && (
                <span className={`sdm-type-badge ${scheme.scheme_type === 'Central' ? 'central' : 'state'}`}>
                  {scheme.scheme_type === 'Central' ? '🏛️ Central Scheme' : '📍 State Scheme'}
                </span>
              )}
              {scheme.application_deadline && (
                <span className="sdm-deadline-badge">
                  ⏰ Deadline: {new Date(scheme.application_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
            <h1 className="sdm-title">{scheme.name}</h1>
            {scheme.ministry && (
              <p className="sdm-ministry">
                <span className="sdm-ministry-icon">🏢</span> {scheme.ministry}
              </p>
            )}
          </div>
          <button className="sdm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── Tabs ── */}
        <div className="sdm-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`sdm-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className="sdm-body">

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="sdd-section">
              <div className="sdd-section-header">
                <span className="sdd-section-icon">📌</span>
                <h2 className="sdd-section-title">About this Scheme</h2>
              </div>
              <p className="sdd-text sdd-description">{scheme.description || '—'}</p>

              {/* Quick info strip */}
              <div className="sdd-quick-strip">
                {scheme.state && (
                  <div className="sdd-quick-item">
                    <span className="sdd-quick-label">State</span>
                    <span className="sdd-quick-value">{scheme.state}</span>
                  </div>
                )}
                {scheme.min_age && (
                  <div className="sdd-quick-item">
                    <span className="sdd-quick-label">Min Age</span>
                    <span className="sdd-quick-value">{scheme.min_age}+</span>
                  </div>
                )}
                {scheme.max_income && (
                  <div className="sdd-quick-item">
                    <span className="sdd-quick-label">Max Income</span>
                    <span className="sdd-quick-value">₹{scheme.max_income.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {scheme.target_category && (
                  <div className="sdd-quick-item">
                    <span className="sdd-quick-label">Category</span>
                    <span className="sdd-quick-value">{scheme.target_category}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Eligibility */}
          {activeTab === 'eligibility' && (
            <div className="sdd-section">
              <div className="sdd-section-header">
                <span className="sdd-section-icon">✅</span>
                <h2 className="sdd-section-title">Eligibility Criteria</h2>
              </div>
              <p className="sdd-helper">Who can apply for this scheme:</p>
              <EligibilityGrid scheme={scheme} t={t} />
            </div>
          )}

          {/* Benefits */}
          {activeTab === 'benefits' && (
            <div className="sdd-section">
              <div className="sdd-section-header">
                <span className="sdd-section-icon">💰</span>
                <h2 className="sdd-section-title">Benefits</h2>
              </div>
              <div className="sdd-benefit-highlight">
                <DetailList text={scheme.benefit} />
              </div>
            </div>
          )}

          {/* Documents */}
          {activeTab === 'documents' && (
            <div className="sdd-section">
              <div className="sdd-section-header">
                <span className="sdd-section-icon">📄</span>
                <h2 className="sdd-section-title">Required Documents</h2>
              </div>
              <p className="sdd-helper">Keep these documents ready before applying:</p>
              <DetailList text={scheme.documents_required} />
            </div>
          )}

          {/* How to Apply */}
          {activeTab === 'howto' && (
            <div className="sdd-section">
              <div className="sdd-section-header">
                <span className="sdd-section-icon">📝</span>
                <h2 className="sdd-section-title">How to Apply</h2>
              </div>
              <StepList text={scheme.how_to_apply} />
            </div>
          )}
        </div>

        {/* ── Apply Footer ── */}
        <div className="sdm-footer">
          {applyMsg === 'success' && (
            <span className="sdm-apply-msg success">✅ Application recorded! Redirecting...</span>
          )}
          {applyMsg === 'already' && (
            <span className="sdm-apply-msg info">ℹ️ Already applied. Opening official site...</span>
          )}
          {applyMsg === 'error' && (
            <span className="sdm-apply-msg error">❌ Could not apply. Please try again.</span>
          )}
          <div className="sdm-footer-actions">
            {scheme.application_link && (
              <a
                href={scheme.application_link}
                target="_blank"
                rel="noreferrer"
                className="sdm-btn-secondary"
              >
                🌐 Official Website ↗
              </a>
            )}
            {user && (
              <button
                className="sdm-btn-primary"
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? (
                  <><span className="sdm-spinner"></span> Applying...</>
                ) : (
                  <>🚀 {t('schemes.applyNow')}</>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
