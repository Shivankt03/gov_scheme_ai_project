import { useState } from 'react';
import './InfoPage.css';

export default function FeedbackPage() {
  const [form, setForm] = useState({ type: 'suggestion', rating: 0, title: '', message: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [hover, setHover] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.message) return;
    // In a real app, POST to backend; here we just show success
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="info-page">
        <div className="feedback-success">
          <div className="feedback-success-icon">🎉</div>
          <h2>Thank you for your feedback!</h2>
          <p>Your response has been recorded. We'll review it and get back to you if needed.</p>
          <button className="info-btn" onClick={() => setSubmitted(false)}>Submit Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="info-page">
      <div className="info-page-header">
        <h1 className="info-title">📝 Feedback</h1>
        <p className="info-subtitle">Help us improve Jan Suvidha — your feedback matters</p>
      </div>

      <div className="feedback-form-wrap">
        <form className="feedback-form" onSubmit={handleSubmit}>

          {/* Type */}
          <div className="fb-field">
            <label className="fb-label">Feedback Type</label>
            <div className="fb-type-row">
              {['suggestion', 'bug', 'compliment', 'other'].map(t => (
                <button
                  key={t}
                  type="button"
                  className={`fb-type-btn${form.type === t ? ' active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                >
                  {{ suggestion: '💡 Suggestion', bug: '🐛 Bug Report', compliment: '⭐ Compliment', other: '💬 Other' }[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Star rating */}
          <div className="fb-field">
            <label className="fb-label">Overall Rating</label>
            <div className="fb-stars">
              {[1,2,3,4,5].map(n => (
                <button
                  key={n} type="button"
                  className={`fb-star${n <= (hover || form.rating) ? ' active' : ''}`}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setForm(f => ({ ...f, rating: n }))}
                >★</button>
              ))}
              {form.rating > 0 && <span className="fb-rating-label">{['','Poor','Fair','Good','Very Good','Excellent'][form.rating]}</span>}
            </div>
          </div>

          {/* Title */}
          <div className="fb-field">
            <label className="fb-label">Subject *</label>
            <input
              className="fb-input"
              placeholder="Brief summary of your feedback"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          {/* Message */}
          <div className="fb-field">
            <label className="fb-label">Message *</label>
            <textarea
              className="fb-input fb-textarea"
              placeholder="Describe your feedback in detail..."
              rows={5}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              required
            />
          </div>

          {/* Email */}
          <div className="fb-field">
            <label className="fb-label">Email (optional — for follow-up)</label>
            <input
              className="fb-input"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>

          <button type="submit" className="fb-submit">📤 Submit Feedback</button>
        </form>
      </div>
    </div>
  );
}
