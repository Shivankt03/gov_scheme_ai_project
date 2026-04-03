import { useState, useEffect } from 'react';
import { applicationAPI } from '../services/api';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [trackingForm, setTrackingForm] = useState({ tracking_id: '', tracking_link: '' });
  const [saveMessage, setSaveMessage] = useState('');

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
      setSaveMessage('✅ Tracking info updated!');
      setEditingId(null);
      loadApplications();
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage(`❌ ${err.response?.data?.detail || 'Failed to update'}`);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  }

  const statusConfig = {
    'Applied': { badge: 'badge-info', icon: '📤', step: 0 },
    'Under Review': { badge: 'badge-warning', icon: '🔍', step: 1 },
    'Approved': { badge: 'badge-success', icon: '✅', step: 2 },
    'Rejected': { badge: 'badge-danger', icon: '❌', step: 0 },
  };

  const steps = ['Applied', 'Under Review', 'Approved'];

  if (loading) {
    return <div className="page"><div className="loading"><div className="spinner"></div> Loading applications...</div></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>📄 My Applications</h1>
        <p>Track the status of your scheme applications and manage tracking details</p>
      </div>

      {saveMessage && (
        <div className={`alert ${saveMessage.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
          {saveMessage}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📭</div>
          <p>You haven't applied to any schemes yet.</p>
          <a href="/schemes" className="btn btn-accent" style={{ marginTop: '1rem' }}>Browse Schemes →</a>
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
                      <p className="app-ministry">🏢 {app.scheme.ministry}</p>
                    )}

                    <div className="app-meta">
                      {app.application_date && (
                        <span className="app-meta-item">
                          📅 Applied: {new Date(app.application_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {/* Tracking Info */}
                    <div className="app-tracking">
                      {editingId === app.id ? (
                        <div className="tracking-form">
                          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                            <label>Tracking ID (from govt website)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. PMKISAN-2026-XXXXXXXX"
                              value={trackingForm.tracking_id}
                              onChange={(e) => setTrackingForm({ ...trackingForm, tracking_id: e.target.value })}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                            <label>Tracking URL (optional)</label>
                            <input
                              type="url"
                              className="form-control"
                              placeholder="https://pmkisan.gov.in/track/..."
                              value={trackingForm.tracking_link}
                              onChange={(e) => setTrackingForm({ ...trackingForm, tracking_link: e.target.value })}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-accent btn-sm" onClick={() => saveTracking(app.id)}>
                              💾 Save
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {app.tracking_id && (
                            <div className="tracking-display">
                              <span className="tracking-label">🔗 Tracking ID:</span>
                              <span className="tracking-value">{app.tracking_id}</span>
                            </div>
                          )}
                          {app.tracking_link && (
                            <a href={app.tracking_link} target="_blank" rel="noreferrer" className="tracking-link-btn">
                              📊 Track Application Status ↗
                            </a>
                          )}
                        </>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="app-actions">
                      {editingId !== app.id && (
                        <button className="btn btn-outline btn-sm" onClick={() => startEditing(app)}>
                          ✏️ {app.tracking_id ? 'Update' : 'Add'} Tracking Info
                        </button>
                      )}
                      {schemeLink && (
                        <a href={schemeLink} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                          🌐 Visit Scheme Website ↗
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
                        <span className="badge badge-danger">Application Rejected</span>
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
