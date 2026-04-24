import { useState, useEffect } from 'react';
import { applicationAPI } from '../services/api';
import { useTranslation } from '../i18n/index.js';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [trackingForm, setTrackingForm] = useState({ tracking_id: '', tracking_link: '' });
  const [saveMessage, setSaveMessage] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    loadApplications();
  }, []);

  function loadApplications() {
    setLoading(true);
    applicationAPI.getMyApplications()
      .then((res) => setApplications(res.data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }

  function startEditing(app) {
    setEditingId(app.id);
    setTrackingForm({
      tracking_id: app.tracking_id || '',
      tracking_link: app.tracking_link || '',
    });
  }

  async function saveTracking(appId) {
    try {
      await applicationAPI.updateTracking(appId, trackingForm.tracking_id, trackingForm.tracking_link);
      setSaveMessage(t('applications.trackingUpdated'));
      setEditingId(null);
      loadApplications();
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage(`${t('applications.trackingFailed')}: ${err.response?.data?.detail || ''}`);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  }

  const statusConfig = {
    'Applied':      { badge: 'badge-info',    icon: '📤', step: 0 },
    'Under Review': { badge: 'badge-warning', icon: '🔍', step: 1 },
    'Approved':     { badge: 'badge-success', icon: '✅', step: 2 },
    'Rejected':     { badge: 'badge-danger',  icon: '❌', step: 0 },
  };

  const steps = [t('applications.applied'), t('applications.underReview'), t('applications.approved')];

  if (loading) {
    return <div className="page"><div className="loading"><div className="spinner"></div> {t('applications.loading')}</div></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('applications.title')}</h1>
        <p>{t('applications.subtitle')}</p>
      </div>

      {saveMessage && (
        <div className={`alert ${saveMessage.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
          {saveMessage}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📭</div>
          <p>{t('applications.noApplications')}</p>
          <a href="/schemes" className="btn btn-accent" style={{ marginTop: '1rem' }}>{t('applications.browseSchemes')}</a>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => {
            const config = statusConfig[app.status] || statusConfig['Applied'];
            const schemeName = app.scheme?.name || `Scheme #${app.scheme_id}`;
            const schemeLink = app.scheme?.application_link;
            const currentStep = config.step;

            return (
              <div key={app.id} className="application-card card">
                {/* Status ribbon */}
                <div className={`app-status-ribbon ${app.status === 'Rejected' ? 'rejected' : ''}`}>
                  {config.icon} {app.status}
                </div>

                <div className="app-card-content">
                  {/* Left: Info */}
                  <div className="app-info">
                    <h3 className="app-scheme-name">{schemeName}</h3>
                    {app.scheme?.ministry && (
                      <p className="app-ministry">{t('applications.ministry')} {app.scheme.ministry}</p>
                    )}

                    <div className="app-meta">
                      {app.application_date && (
                        <span className="app-meta-item">
                          {t('applications.appliedDate')}: {new Date(app.application_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {/* Tracking Info */}
                    <div className="app-tracking">
                      {editingId === app.id ? (
                        <div className="tracking-form">
                          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                            <label>{t('applications.trackingIdLabel')}</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t('applications.trackingIdPlaceholder')}
                              value={trackingForm.tracking_id}
                              onChange={(e) => setTrackingForm({ ...trackingForm, tracking_id: e.target.value })}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                            <label>{t('applications.trackingUrlLabel')}</label>
                            <input
                              type="url"
                              className="form-control"
                              placeholder={t('applications.trackingUrlPlaceholder')}
                              value={trackingForm.tracking_link}
                              onChange={(e) => setTrackingForm({ ...trackingForm, tracking_link: e.target.value })}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-accent btn-sm" onClick={() => saveTracking(app.id)}>
                              {t('applications.save')}
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>
                              {t('applications.cancel')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {app.tracking_id && (
                            <div className="tracking-display">
                              <span className="tracking-label">{t('applications.trackingId')}</span>
                              <span className="tracking-value">{app.tracking_id}</span>
                            </div>
                          )}
                          {app.tracking_link && (
                            <a href={app.tracking_link} target="_blank" rel="noreferrer" className="tracking-link-btn">
                              {t('applications.trackApplication')}
                            </a>
                          )}
                        </>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="app-actions">
                      {editingId !== app.id && (
                        <button className="btn btn-outline btn-sm" onClick={() => startEditing(app)}>
                          {app.tracking_id ? t('applications.updateTracking') : t('applications.addTracking')}
                        </button>
                      )}
                      {schemeLink && (
                        <a href={schemeLink} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                          {t('applications.visitScheme')}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right: Progress timeline */}
                  <div className="app-progress">
                    <div className="progress-timeline">
                      {steps.map((step, i) => {
                        const isActive = app.status !== 'Rejected' && currentStep >= i;
                        const isCurrent = app.status !== 'Rejected' && currentStep === i;
                        const isRejected = app.status === 'Rejected';

                        return (
                          <div key={step} className="progress-step-container">
                            <div className={`progress-dot ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''} ${isRejected && i === 0 ? 'rejected' : ''}`}>
                              {isActive ? '✓' : i + 1}
                            </div>
                            <span className={`progress-label ${isActive ? 'active' : ''}`}>{step}</span>
                            {i < steps.length - 1 && (
                              <div className={`progress-line ${isActive && currentStep > i ? 'active' : ''}`}></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {app.status === 'Rejected' && (
                      <div className="rejected-notice">
                        <span className="badge badge-danger">{t('applications.applicationRejected')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
