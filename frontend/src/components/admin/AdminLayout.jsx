import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from 'axios'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/products', label: 'Products', icon: '📦' },
  { path: '/admin/queries', label: 'Queries', icon: '📋' },
]

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }

    axios.get('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setLoading(false))
      .catch(() => {
        localStorage.removeItem('adminToken')
        navigate('/admin')
      })
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin')
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Verifying access...</p>
      </div>
    )
  }

  return (
    <div className="admin-root">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-wrap">
            <img src="/srr-logo.png" alt="SRR" className="admin-logo-img" />
            {sidebarOpen && <span className="admin-logo-text">SRR Admin</span>}
          </div>
          <button
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="admin-nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <span className="admin-nav-icon">🚪</span>
            {sidebarOpen && <span className="admin-nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-topbar">
          <h2 className="admin-page-title">
            {navItems.find(i => i.path === location.pathname)?.label || 'Admin'}
          </h2>
          <div className="admin-topbar-right">
            <span className="admin-badge">Admin</span>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}
