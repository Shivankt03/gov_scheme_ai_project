import './InfoPage.css';

const NEWS = [
  {
    date: '2026-04-20', tag: '🆕 New Scheme', tagColor: '#10b981',
    title: 'PM Vishwakarma Scheme Extended',
    desc: 'The government has extended PM Vishwakarma scheme benefits to include 5 new trades including electronic repair, tailoring, and glasswork.',
    source: 'Ministry of MSME',
  },
  {
    date: '2026-04-18', tag: '⏰ Deadline', tagColor: '#f97316',
    title: 'PMFBY Kharif 2025 — Last Date April 30',
    desc: 'Farmers are reminded that the last date to enroll in PM Fasal Bima Yojana for Kharif 2025 season is April 30. Apply at the nearest CSC or bank.',
    source: 'Ministry of Agriculture',
  },
  {
    date: '2026-04-15', tag: '📢 Update', tagColor: '#6c63ff',
    title: 'PM Jan Dhan — 53 Crore Accounts Opened',
    desc: 'India achieves milestone of 53 crore Jan Dhan accounts. Overdraft facility of Rs. 10,000 now available to all eligible account holders.',
    source: 'Ministry of Finance',
  },
  {
    date: '2026-04-12', tag: '💰 Funds Released', tagColor: '#fbbf24',
    title: 'MGNREGS Wages Increased by 7%',
    desc: 'The government has approved a 7% increase in MGNREGS wage rates for FY 2025-26, effective from April 1. New rates range from Rs. 234 to Rs. 357/day.',
    source: 'Ministry of Rural Development',
  },
  {
    date: '2026-04-10', tag: '🎓 Scholarship', tagColor: '#3b82f6',
    title: 'NMMSS Applications Open for 2025-26',
    desc: 'National Means cum Merit Scholarship applications for 2025-26 are now open on the National Scholarship Portal. Last date: May 31, 2026.',
    source: 'Ministry of Education',
  },
  {
    date: '2026-04-05', tag: '🏠 Housing', tagColor: '#8b5cf6',
    title: 'PMAY Gramin Phase III Launched',
    desc: 'Government launches Phase III of PMAY-G targeting 2 crore additional houses by 2026 with increased assistance of Rs. 1.5 lakh per unit in plain areas.',
    source: 'Ministry of Rural Development',
  },
];

export default function NewsPage() {
  return (
    <div className="info-page">
      <div className="info-page-header">
        <h1 className="info-title">📰 News & Updates</h1>
        <p className="info-subtitle">Latest scheme announcements, deadline reminders, and government welfare updates</p>
      </div>

      <div className="news-list">
        {NEWS.map((n, i) => (
          <div key={i} className="news-card">
            <div className="news-meta">
              <span className="news-tag" style={{ background: `${n.tagColor}22`, color: n.tagColor }}>{n.tag}</span>
              <span className="news-date">{new Date(n.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <h3 className="news-title">{n.title}</h3>
            <p className="news-desc">{n.desc}</p>
            <div className="news-source">📌 {n.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
