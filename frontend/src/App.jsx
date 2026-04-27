import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfileWizardPage from './pages/ProfileWizardPage';
import SchemesPage from './pages/SchemesPage';
import ApplicationsPage from './pages/ApplicationsPage';
import AdminPage from './pages/AdminPage';
import CategoriesPage from './pages/CategoriesPage';
import SavedSchemesPage from './pages/SavedSchemesPage';
import ActivityHistoryPage from './pages/ActivityHistoryPage';
import DocsPage from './pages/DocsPage';
import NewsPage from './pages/NewsPage';
import HelpPage from './pages/HelpPage';
import FeedbackPage from './pages/FeedbackPage';
import RecommendationsPage from './pages/RecommendationsPage';

import './index.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"></div> Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"></div> Loading...</div>;
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"></div> Loading...</div>;
  return user ? <Navigate to="/dashboard" /> : children;
}

// Sidebar layout wrapper for authenticated pages
function SidebarLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1117' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}

// Wrap a page with ProtectedRoute + SidebarLayout
function P({ children }) {
  return (
    <ProtectedRoute>
      <SidebarLayout>{children}</SidebarLayout>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!user && !isAuthPage && <Navbar />}
      {user && <Chatbot />}

      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* ── Authenticated – Discover ── */}
        <Route path="/dashboard" element={<P><DashboardPage /></P>} />
        <Route path="/recommendations" element={<P><RecommendationsPage /></P>} />
        <Route path="/categories" element={<P><CategoriesPage /></P>} />
        <Route path="/schemes" element={<P><SchemesPage /></P>} />

        {/* ── Authenticated – My Space ── */}
        <Route path="/profile" element={<P><ProfileWizardPage /></P>} />
        <Route path="/saved" element={<P><SavedSchemesPage /></P>} />
        <Route path="/applications" element={<P><ApplicationsPage /></P>} />
        <Route path="/activity" element={<P><ActivityHistoryPage /></P>} />

        {/* ── Authenticated – Resources ── */}
        <Route path="/docs" element={<P><DocsPage /></P>} />
        <Route path="/news" element={<P><NewsPage /></P>} />
        <Route path="/help" element={<P><HelpPage /></P>} />
        <Route path="/feedback" element={<P><FeedbackPage /></P>} />

        {/* ── Admin ── */}
        <Route path="/admin" element={
          <AdminRoute><SidebarLayout><AdminPage /></SidebarLayout></AdminRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
