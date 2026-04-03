import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          🏛️ <span>GovScheme AI</span>
        </Link>

        <ul className="navbar-links">
          {user ? (
            <>
              <li><Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link></li>
              <li><Link to="/schemes" className={isActive('/schemes')}>Schemes</Link></li>
              <li><Link to="/profile" className={isActive('/profile')}>Profile</Link></li>
              <li><Link to="/applications" className={isActive('/applications')}>Applications</Link></li>
              {user.role === 'admin' && (
                <li><Link to="/admin" className={isActive('/admin')} style={{ color: 'var(--accent-light)' }}>Admin Panel</Link></li>
              )}
              <li>
                <button onClick={logout} className="btn btn-outline btn-sm" style={{ marginLeft: '0.5rem' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
              <li>
                <Link to="/register" className="btn btn-accent btn-sm">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
