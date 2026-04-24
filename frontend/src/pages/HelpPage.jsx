import './InfoPage.css';

const FAQS = [
  { q: 'How does the AI recommendation work?', a: 'Our AI engine compares your profile (age, income, state, occupation, category) with scheme eligibility criteria and generates a match score. Schemes with highest scores are shown first.' },
  { q: 'How do I apply for a scheme?', a: 'Click "View Details" on any scheme card. In the detail modal, click "Apply Now" to record your application and get redirected to the official government portal.' },
  { q: 'Is my data secure?', a: 'Yes. Your data is stored locally on our servers with JWT authentication. We do not share your personal information with any third party.' },
  { q: 'How do I change the language?', a: 'Use the language selector in the sidebar. We support 7 Indian languages. Scheme descriptions will be translated automatically by our AI.' },
  { q: 'What if a scheme I applied to is not visible?', a: 'Check the "My Applications" page in the sidebar. All your applications with status updates are tracked there.' },
  { q: 'Can I use Jan Suvidha on Telegram?', a: 'Yes! Search for our Telegram bot and type /start to get AI-powered scheme recommendations directly in your chat.' },
];

export default function HelpPage() {
  return (
    <div className="info-page">
      <div className="info-page-header">
        <h1 className="info-title">💬 Help & Support</h1>
        <p className="info-subtitle">Find answers to common questions and get in touch with our team</p>
      </div>

      {/* Contact cards */}
      <div className="help-contact-grid">
        {[
          { icon: '📧', title: 'Email Support', desc: 'support@jansuvidha.gov.in', sub: 'Response within 24 hours', color: '#6c63ff' },
          { icon: '📞', title: 'Helpline',      desc: '1800-XXX-XXXX',         sub: 'Mon–Sat, 9AM to 6PM', color: '#10b981' },
          { icon: '🤖', title: 'AI Chatbot',   desc: 'Available 24/7',         sub: 'Instant answers via chat', color: '#f97316' },
        ].map(c => (
          <div key={c.title} className="help-contact-card" style={{ '--cc': c.color }}>
            <div className="help-contact-icon">{c.icon}</div>
            <div className="help-contact-title">{c.title}</div>
            <div className="help-contact-desc">{c.desc}</div>
            <div className="help-contact-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="info-section">
        <h2 className="info-section-title">❓ Frequently Asked Questions</h2>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-q">{f.q}</summary>
              <div className="faq-a">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
