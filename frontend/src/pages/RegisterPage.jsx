import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/index.js';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    if (password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.detail || t('auth.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <h1>{t('auth.joinTitle')}</h1>
        <p className="subtitle">{t('auth.registerSubtitle')}</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t('auth.fullNameLabel')}</label>
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder={t('auth.fullNamePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('auth.emailLabel')}</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth.passwordLabel')}</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Create a password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.confirmPasswordLabel')}</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-control"
              placeholder={t('auth.confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-accent btn-block btn-lg" disabled={loading}>
            {loading ? <><span className="spinner"></span> {t('auth.creating')}</> : t('auth.createAccount')}
          </button>
        </form>

        <p className="divider">{t('auth.alreadyHaveAccount')}</p>
        <Link to="/login" className="btn btn-outline btn-block">{t('auth.signInLink')}</Link>
      </div>
    </div>
  );
}
