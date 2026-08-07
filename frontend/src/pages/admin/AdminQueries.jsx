import { useState, useEffect } from 'react'
import axios from 'axios'

const STATUS_OPTIONS = ['new', 'contacted', 'converted', 'closed']
const STATUS_COLORS = {
  new: '#2ecc71',
  contacted: '#3498db',
  converted: '#27ae60',
  closed: '#95a5a6',
}

export default function AdminQueries() {
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const token = localStorage.getItem('adminToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchQueries = async () => {
    try {
      const { data } = await axios.get('/api/admin/contacts', { headers })
      setQueries(data.data || [])
    } catch (err) {
      console.error('Failed to fetch queries:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchQueries() }, [])

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await axios.patch(`/api/admin/contacts/${id}/status`, { status: newStatus }, { headers })
      setQueries(prev =>
        prev.map(q => q._id === id ? { ...q, status: newStatus } : q)
      )
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await axios.delete(`/api/admin/contacts/${deleteTarget._id}`, { headers })
      setQueries(prev => prev.filter(q => q._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      console.error('Failed to delete query:', err)
    } finally {
      setDeleting(false)
    }
  }

  const filtered = queries.filter((q) => {
    const matchSearch = !search ||
      q.name?.toLowerCase().includes(search.toLowerCase()) ||
      q.shopName?.toLowerCase().includes(search.toLowerCase()) ||
      q.phone?.includes(search) ||
      q.city?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || q.status === statusFilter
    return matchSearch && matchStatus
  })

  // Stats
  const statusCounts = {
    all: queries.length,
    new: queries.filter(q => q.status === 'new').length,
    contacted: queries.filter(q => q.status === 'contacted').length,
    converted: queries.filter(q => q.status === 'converted').length,
    closed: queries.filter(q => q.status === 'closed').length,
  }

  if (loading) {
    return (
      <div className="admin-loading-inline">
        <div className="admin-spinner" />
        <p>Loading inquiries...</p>
      </div>
    )
  }

  return (
    <div className="admin-queries">
      {/* Status filter tabs */}
      <div className="admin-status-tabs">
        <button
          className={`admin-status-tab ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All <span className="tab-count">{statusCounts.all}</span>
        </button>
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            className={`admin-status-tab ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
            style={statusFilter === s ? { borderColor: STATUS_COLORS[s] } : {}}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="tab-count" style={{ background: STATUS_COLORS[s] }}>
              {statusCounts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search by name, shop, phone, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input admin-search-full"
        />
      </div>

      <p className="admin-count-label">
        Showing {filtered.length} of {queries.length} inquiries
      </p>

      {/* Queries Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Shop Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>City</th>
              <th>Product Interest</th>
              <th>Quantity</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} className="admin-empty-cell">No inquiries found</td>
              </tr>
            ) : (
              filtered.map((q) => (
                <tr key={q._id}>
                  <td className="admin-cell-bold">{q.name}</td>
                  <td>{q.shopName}</td>
                  <td>
                    <a href={`tel:${q.phone}`} className="admin-phone-link">{q.phone}</a>
                  </td>
                  <td>
                    {q.email ? (
                      <a href={`mailto:${q.email}`} className="admin-email-link">{q.email}</a>
                    ) : (
                      <span className="admin-na">—</span>
                    )}
                  </td>
                  <td>{q.city}</td>
                  <td>{q.productInterest}</td>
                  <td>{q.quantity || <span className="admin-na">—</span>}</td>
                  <td className="admin-cell-sm">
                    {q.message || <span className="admin-na">—</span>}
                  </td>
                  <td>
                    <select
                      value={q.status}
                      onChange={(e) => handleStatusChange(q._id, e.target.value)}
                      className="admin-status-select"
                      style={{ borderColor: STATUS_COLORS[q.status] }}
                      disabled={updatingId === q._id}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="admin-cell-nowrap">
                    {new Date(q.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td>
                    <button
                      className="admin-delete-btn"
                      onClick={() => setDeleteTarget(q)}
                      title="Delete Inquiry"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal admin-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Delete Inquiry</h3>
              <button className="admin-modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <p className="admin-confirm-text">
                Are you sure you want to delete inquiry from <strong>{deleteTarget.name}</strong> ({deleteTarget.shopName})?
              </p>
              <div className="admin-modal-footer">
                <button className="admin-cancel-btn" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </button>
                <button className="admin-danger-btn" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
