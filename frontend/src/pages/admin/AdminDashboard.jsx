import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalQueries: 0,
    newQueries: 0,
    contactedQueries: 0,
    convertedQueries: 0,
  })
  const [recentQueries, setRecentQueries] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('adminToken')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, contactsRes] = await Promise.all([
          axios.get('/api/admin/products', { headers }),
          axios.get('/api/admin/contacts', { headers }),
        ])

        const products = productsRes.data.data || []
        const contacts = contactsRes.data.data || []

        setStats({
          totalProducts: products.length,
          totalQueries: contacts.length,
          newQueries: contacts.filter(c => c.status === 'new').length,
          contactedQueries: contacts.filter(c => c.status === 'contacted').length,
          convertedQueries: contacts.filter(c => c.status === 'converted').length,
        })

        setRecentQueries(contacts.slice(0, 5))
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="admin-loading-inline">
        <div className="admin-spinner" />
        <p>Loading dashboard...</p>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: '#c9965a' },
    { label: 'Total Inquiries', value: stats.totalQueries, icon: '📋', color: '#7d502a' },
    { label: 'New Queries', value: stats.newQueries, icon: '🆕', color: '#2ecc71' },
    { label: 'Contacted', value: stats.contactedQueries, icon: '📞', color: '#3498db' },
    { label: 'Converted', value: stats.convertedQueries, icon: '✅', color: '#27ae60' },
  ]

  const statusColors = {
    new: '#2ecc71',
    contacted: '#3498db',
    converted: '#27ae60',
    closed: '#95a5a6',
  }

  return (
    <div className="admin-dashboard">
      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: card.color }}>
              {card.icon}
            </div>
            <div className="admin-stat-info">
              <h3 className="admin-stat-value">{card.value}</h3>
              <p className="admin-stat-label">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <h3 className="admin-section-title">Quick Actions</h3>
        <div className="admin-quick-actions">
          <Link to="/admin/products" className="admin-action-btn">
            <span>📦</span> Manage Products
          </Link>
          <Link to="/admin/queries" className="admin-action-btn">
            <span>📋</span> View All Queries
          </Link>
        </div>
      </div>

      {/* Recent Queries */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h3 className="admin-section-title">Recent Inquiries</h3>
          <Link to="/admin/queries" className="admin-view-all">View All →</Link>
        </div>

        {recentQueries.length === 0 ? (
          <div className="admin-empty-state">
            <p>No inquiries yet</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Shop</th>
                  <th>Phone</th>
                  <th>Product Interest</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentQueries.map((q) => (
                  <tr key={q._id}>
                    <td>{q.name}</td>
                    <td>{q.shopName}</td>
                    <td>{q.phone}</td>
                    <td>{q.productInterest}</td>
                    <td>
                      <span
                        className="admin-status-badge"
                        style={{ background: statusColors[q.status] || '#95a5a6' }}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td>{new Date(q.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
