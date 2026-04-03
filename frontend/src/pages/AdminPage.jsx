import { useState, useEffect } from 'react';
import { schemeAPI, adminAPI } from '../services/api';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('schemes');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Data states
  const [schemes, setSchemes] = useState([]);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'scheme', 'user'
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const initialSchemeForm = { name: '', ministry: '', description: '', min_age: '', max_income: '', target_occupation: '', target_category: '', state: '', benefit: '', application_link: '' };
  const initialUserForm = { name: '', email: '', password: '', role: 'user' };
  
  const [schemeForm, setSchemeForm] = useState({ ...initialSchemeForm });
  const [userForm, setUserForm] = useState({ ...initialUserForm });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === 'schemes') {
        const res = await schemeAPI.list();
        setSchemes(res.data);
      } else if (activeTab === 'users') {
        const res = await adminAPI.getUsers();
        setUsers(res.data);
      } else if (activeTab === 'applications') {
        const res = await adminAPI.getApplications();
        setApplications(res.data);
      }
    } catch {
      // In case of error, just set to empty array
      if (activeTab === 'schemes') setSchemes([]);
      else if (activeTab === 'users') setUsers([]);
      else if (activeTab === 'applications') setApplications([]);
    }
    setLoading(false);
  }

  function showMessage(msg, isError = false) {
    setMessage(`${isError ? '❌' : '✅'} ${msg}`);
    setTimeout(() => setMessage(''), 4000);
  }

  // --- SCHEME MANAGEMENT ---

  function openSchemeModal(scheme = null) {
    setEditingItem(scheme);
    setModalType('scheme');
    if (scheme) {
      setSchemeForm({
        name: scheme.name || '', ministry: scheme.ministry || '', description: scheme.description || '',
        min_age: scheme.min_age || '', max_income: scheme.max_income || '', target_occupation: scheme.target_occupation || '',
        target_category: scheme.target_category || '', state: scheme.state || '', benefit: scheme.benefit || '', application_link: scheme.application_link || ''
      });
    } else {
      setSchemeForm({ ...initialSchemeForm });
    }
    setIsModalOpen(true);
  }

  async function handleDeleteScheme(id, name) {
    if (!window.confirm(`Delete scheme "${name}"?`)) return;
    try {
      await adminAPI.deleteScheme(id);
      showMessage('Scheme deleted successfully!');
      loadData();
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Failed to delete scheme', true);
    }
  }

  async function handleSchemeSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = { ...schemeForm };
    if (payload.min_age === '') payload.min_age = null; else payload.min_age = parseInt(payload.min_age, 10);
    if (payload.max_income === '') payload.max_income = null; else payload.max_income = parseInt(payload.max_income, 10);

    try {
      if (editingItem) await adminAPI.updateScheme(editingItem.id, payload);
      else await adminAPI.createScheme(payload);
      showMessage(editingItem ? 'Scheme updated!' : 'New scheme created!');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Failed to save scheme', true);
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- USER MANAGEMENT ---

  function openUserModal(user = null) {
    setEditingItem(user);
    setModalType('user');
    if (user) {
      setUserForm({ name: user.name || '', email: user.email || '', password: '', role: user.role || 'user' });
    } else {
      setUserForm({ ...initialUserForm });
    }
    setIsModalOpen(true);
  }

  async function handleDeleteUser(id, name) {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await adminAPI.deleteUser(id);
      showMessage('User deleted successfully!');
      loadData();
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Failed to delete user', true);
    }
  }

  async function handleUserSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = { ...userForm };
    if (editingItem && !payload.password) delete payload.password; // Don't send empty password if not changing
    
    try {
      if (editingItem) await adminAPI.updateUser(editingItem.id, payload);
      else await adminAPI.createUser(payload);
      showMessage(editingItem ? 'User updated!' : 'New user created!');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Failed to save user', true);
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- APPLICATION MANAGEMENT ---

  async function updateApplicationStatus(id, newStatus) {
    try {
      await adminAPI.updateApplicationStatus(id, newStatus);
      showMessage(`Application ${id} marked as ${newStatus}`);
      loadData();
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Failed to update application status', true);
    }
  }

  // --- RENDER HELPERS ---

  const renderTabs = () => (
    <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
      {['schemes', 'users', 'applications'].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={{
            background: 'none', border: 'none', padding: '1rem', cursor: 'pointer',
            fontSize: '1rem', fontWeight: '600', textTransform: 'capitalize',
            color: activeTab === tab ? 'var(--accent-light)' : 'var(--text-muted)',
            borderBottom: activeTab === tab ? '2px solid var(--accent-light)' : '2px solid transparent'
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: '1400px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <h1>⚙️ Admin Dashboard</h1>
          <p>Manage users, government schemes, and monitor applications</p>
        </div>
        {activeTab === 'schemes' && <button className="btn btn-primary" onClick={() => openSchemeModal()}>➕ Add New Scheme</button>}
        {activeTab === 'users' && <button className="btn btn-primary" onClick={() => openUserModal()}>➕ Add New User</button>}
      </div>

      {message && (
        <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        {renderTabs()}
        
        {loading ? (
          <div className="loading" style={{ padding: '3rem' }}><div className="spinner"></div> Loading {activeTab}...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
                {activeTab === 'schemes' && (
                  <>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Scheme Name</th>
                    <th style={{ padding: '1rem' }}>Ministry</th>
                    <th style={{ padding: '1rem' }}>Target Audience</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}
                {activeTab === 'users' && (
                  <>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Name</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Role</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </>
                )}
                {activeTab === 'applications' && (
                  <>
                    <th style={{ padding: '1rem' }}>App ID</th>
                    <th style={{ padding: '1rem' }}>User ID</th>
                    <th style={{ padding: '1rem' }}>Scheme</th>
                    <th style={{ padding: '1rem' }}>Tracking Info</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {/* SCHEMES ROWS */}
              {activeTab === 'schemes' && schemes.map(scheme => (
                <tr key={scheme.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>#{scheme.id}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{scheme.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-dim)' }}>{scheme.ministry || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {scheme.state && <span className="badge badge-info">{scheme.state}</span>}
                      {scheme.target_category && <span className="badge badge-warning">{scheme.target_category}</span>}
                      {scheme.target_occupation && <span className="badge badge-success">{scheme.target_occupation}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openSchemeModal(scheme)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteScheme(scheme.id, scheme.name)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {activeTab === 'schemes' && schemes.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center' }}>No schemes found.</td></tr>
              )}

              {/* USERS ROWS */}
              {activeTab === 'users' && users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>#{user.id}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{user.name}</td>
                  <td style={{ padding: '1rem' }}>{user.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>{user.role}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openUserModal(user)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id, user.name)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {activeTab === 'users' && users.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center' }}>No users found.</td></tr>
              )}

              {/* APPLICATIONS ROWS */}
              {activeTab === 'applications' && applications.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>#{app.id}</td>
                  <td style={{ padding: '1rem' }}>User #{app.user_id}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>Scheme #{app.scheme_id} {app.scheme ? `(${app.scheme.name})` : ''}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.85rem' }}>ID: {app.tracking_id || '-'}</span><br/>
                    <span style={{ fontSize: '0.85rem' }}>Link: {app.tracking_link ? <a href={app.tracking_link} target="_blank" rel="noreferrer">Open ↗</a> : '-'}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      className="form-control" 
                      style={{ padding: '0.25rem 0.5rem', width: 'auto', fontSize: '0.85rem' }}
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
              {activeTab === 'applications' && applications.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center' }}>No applications found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODALS */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            <div className="modal-header-accent"></div>
            <h2 style={{ marginBottom: '1.5rem' }}>
              {editingItem ? 'Edit' : 'Add New'} {modalType === 'scheme' ? 'Scheme' : 'User'}
            </h2>
            
            {/* SCHEME FORM */}
            {modalType === 'scheme' && (
              <form onSubmit={handleSchemeSubmit}>
                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Scheme Name *</label><input type="text" className="form-control" required value={schemeForm.name} onChange={e => setSchemeForm({...schemeForm, name: e.target.value})} /></div>
                  <div className="form-group"><label>Ministry</label><input type="text" className="form-control" value={schemeForm.ministry} onChange={e => setSchemeForm({...schemeForm, ministry: e.target.value})} /></div>
                  <div className="form-group"><label>Application Link</label><input type="url" className="form-control" value={schemeForm.application_link} onChange={e => setSchemeForm({...schemeForm, application_link: e.target.value})} /></div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Description *</label><textarea className="form-control" rows="3" required value={schemeForm.description} onChange={e => setSchemeForm({...schemeForm, description: e.target.value})}></textarea></div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Key Benefits</label><textarea className="form-control" rows="2" value={schemeForm.benefit} onChange={e => setSchemeForm({...schemeForm, benefit: e.target.value})}></textarea></div>
                  <div className="form-group"><label>State</label><input type="text" className="form-control" value={schemeForm.state} onChange={e => setSchemeForm({...schemeForm, state: e.target.value})} /></div>
                  <div className="form-group"><label>Target Category</label><input type="text" className="form-control" value={schemeForm.target_category} onChange={e => setSchemeForm({...schemeForm, target_category: e.target.value})} /></div>
                  <div className="form-group"><label>Target Occupation</label><input type="text" className="form-control" value={schemeForm.target_occupation} onChange={e => setSchemeForm({...schemeForm, target_occupation: e.target.value})} /></div>
                  <div className="form-group"><label>Min Age</label><input type="number" className="form-control" value={schemeForm.min_age} onChange={e => setSchemeForm({...schemeForm, min_age: e.target.value})} /></div>
                  <div className="form-group"><label>Max Income</label><input type="number" className="form-control" value={schemeForm.max_income} onChange={e => setSchemeForm({...schemeForm, max_income: e.target.value})} /></div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-accent" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : '💾 Save Scheme'}</button>
                </div>
              </form>
            )}

            {/* USER FORM */}
            {modalType === 'user' && (
              <form onSubmit={handleUserSubmit}>
                <div className="form-group"><label>Full Name *</label><input type="text" className="form-control" required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} /></div>
                <div className="form-group"><label>Email Address *</label><input type="email" className="form-control" required value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} /></div>
                <div className="form-group"><label>Password {editingItem ? '(Leave blank to keep current)' : '*'}</label><input type="password" className="form-control" required={!editingItem} value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} minLength="6" /></div>
                <div className="form-group"><label>User Role</label>
                  <select className="form-control" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-accent" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : '💾 Save User'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
