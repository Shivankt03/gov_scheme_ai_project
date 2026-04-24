import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import './InfoPage.css';

const STATUS_ICONS  = { 'Approved': '✅', 'Rejected': '❌', 'In Progress': '⏳', 'Under Review': '🔍', 'Submitted': '📤' };
const STATUS_COLORS = { 'Approved': '#10b981', 'Rejected': '#ef4444', 'In Progress': '#fbbf24', 'Under Review': '#6c63ff', 'Submitted': '#3b82f6' };

export default function ActivityHistoryPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationAPI.getMyApplications()
      .then(r => setApps(r.data || []))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, []);

  const events = apps.flatMap(app => [
    { date: app.applied_at || app.created_at, icon: '📤', color: '#6c63ff', title: `Applied to "${app.scheme?.name}"`, sub: 'Application submitted successfully' },
    app.status !== 'Submitted' && { date: app.updated_at || app.applied_at, icon: STATUS_ICONS[app.status], color: STATUS_COLORS[app.status], title: `Status updated: ${app.status}`, sub: app.scheme?.name },
  ]).filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="info-page">
      <div className="info-page-header">
        <h1 className="info-title">🕐 Activity History</h1>
        <p className="info-subtitle">A timeline of your scheme application activity</p>
      </div>

      {loading ? (
        <div className="info-loading"><div className="spinner"></div>Loading...</div>
      ) : events.length === 0 ? (
        <div className="info-empty">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h3>No activity yet</h3>
          <p>Your application history will appear here once you start applying.</p>
          <Link to="/schemes" className="info-btn">Browse Schemes →</Link>
        </div>
      ) : (
        <div className="timeline">
          {events.map((ev, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" style={{ background: ev.color }}>{ev.icon}</div>
              {i < events.length - 1 && <div className="timeline-line"></div>}
              <div className="timeline-content">
                <div className="timeline-title">{ev.title}</div>
                <div className="timeline-sub">{ev.sub}</div>
                <div className="timeline-date">{ev.date ? new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
