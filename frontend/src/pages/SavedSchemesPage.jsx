import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI, schemeAPI } from '../services/api';
import './InfoPage.css';

export default function SavedSchemesPage() {
  // Use localStorage for saved schemes (client-side bookmarking)
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nitiAiSaved') || '[]'); } catch { return []; }
  });
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await schemeAPI.list({ language: 'en' });
        const all = res.data || [];
        setSchemes(all.filter(s => savedIds.includes(s.id)));
      } catch { setSchemes([]); }
      setLoading(false);
    }
    load();
  }, []);

  function removeSaved(id) {
    const updated = savedIds.filter(i => i !== id);
    setSavedIds(updated);
    localStorage.setItem('nitiAiSaved', JSON.stringify(updated));
    setSchemes(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div className="info-page">
      <div className="info-page-header">
        <h1 className="info-title">🔖 Saved Schemes</h1>
        <p className="info-subtitle">Schemes you have bookmarked for later</p>
      </div>

      {loading ? (
        <div className="info-loading"><div className="spinner"></div>Loading...</div>
      ) : schemes.length === 0 ? (
        <div className="info-empty">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔖</div>
          <h3>No saved schemes yet</h3>
          <p>Bookmark schemes from the Find Schemes page to see them here.</p>
          <Link to="/schemes" className="info-btn">Browse Schemes →</Link>
        </div>
      ) : (
        <div className="saved-list">
          {schemes.map(s => (
            <div key={s.id} className="saved-card">
              <div className="saved-icon">{s.name?.[0]}</div>
              <div className="saved-info">
                <div className="saved-name">{s.name}</div>
                <div className="saved-ministry">{s.ministry}</div>
                <div className="saved-desc">{s.description?.slice(0, 100)}...</div>
              </div>
              <div className="saved-actions">
                <Link to="/schemes" className="info-btn-sm">View Details</Link>
                <button className="info-btn-danger" onClick={() => removeSaved(s.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
