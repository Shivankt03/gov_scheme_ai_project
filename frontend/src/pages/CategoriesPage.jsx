import { useNavigate } from 'react-router-dom';
import './InfoPage.css';

const CATEGORIES = [
  { icon: '🌾', label: 'Agriculture', desc: 'Farmer welfare, crop insurance, irrigation', query: 'Farmer', type: 'occupation', color: '#10b981' },
  { icon: '📚', label: 'Education',   desc: 'Scholarships, mid-day meals, skill training', query: 'Student', type: 'occupation', color: '#6c63ff' },
  { icon: '🏥', label: 'Health',      desc: 'Insurance, maternal benefits, treatment support', query: 'Health', type: 'search', color: '#3b82f6' },
  { icon: '🏠', label: 'Housing',     desc: 'Affordable housing, PMAY, rural homes', query: 'Awas', type: 'search', color: '#f97316' },
  { icon: '💰', label: 'Finance',     desc: 'Mudra loans, banking access, insurance', query: 'Finance', type: 'search', color: '#fbbf24' },
  { icon: '👩', label: 'Women',       desc: 'Maternity, widow pension, women empowerment', query: 'Female', type: 'category', color: '#ec4899' },
  { icon: '♿', label: 'Disability',  desc: 'Assistive devices, UDID card, pensions', query: 'Disability', type: 'search', color: '#8b5cf6' },
  { icon: '👴', label: 'Senior Citizens', desc: 'Old age pension, life insurance, PMVVY', query: 'Retired', type: 'occupation', color: '#14b8a6' },
  { icon: '🏗️', label: 'Employment', desc: 'MGNREGS, skill development, self-employment', query: 'Unemployed', type: 'occupation', color: '#ef4444' },
  { icon: '📍', label: 'State Schemes', desc: 'State-specific welfare schemes', query: 'State', type: 'type', color: '#06b6d4' },
  { icon: '🎯', label: 'BPL / SC / OBC', desc: 'Schemes for reserved categories', query: 'SC', type: 'category', color: '#a78bfa' },
  { icon: '💻', label: 'Digital India', desc: 'Digital literacy, startup, e-governance', query: 'Digital', type: 'search', color: '#22d3ee' },
];

export default function CategoriesPage() {
  const navigate = useNavigate();

  function handleCategory(cat) {
    if (cat.type === 'occupation')    navigate(`/schemes?occupation=${cat.query}`);
    else if (cat.type === 'category') navigate(`/schemes?category=${cat.query}`);
    else if (cat.type === 'type')     navigate(`/schemes?schemeType=${cat.query}`);
    else                              navigate(`/schemes?q=${cat.query}`);
  }

  return (
    <div className="info-page">
      <div className="info-page-header">
        <h1 className="info-title">Browse by Category</h1>
        <p className="info-subtitle">Find government schemes tailored to your needs and background</p>
      </div>

      <div className="cat-grid">
        {CATEGORIES.map(cat => (
          <button key={cat.label} className="cat-card" onClick={() => handleCategory(cat)}>
            <div className="cat-icon" style={{ background: `${cat.color}22`, color: cat.color }}>{cat.icon}</div>
            <div className="cat-label">{cat.label}</div>
            <div className="cat-desc">{cat.desc}</div>
            <div className="cat-arrow" style={{ color: cat.color }}>→</div>
          </button>
        ))}
      </div>
    </div>
  );
}
