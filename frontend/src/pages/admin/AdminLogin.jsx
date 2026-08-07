import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await axios.post('/api/admin/login', { password })
      localStorage.setItem('adminToken', data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      {/* Background decorations */}
      <div className="admin-login-bg">
        <div className="admin-login-orb orb-1" />
        <div className="admin-login-orb orb-2" />
        <div className="admin-login-orb orb-3" />
      </div>

      <div className="admin-login-card">
        <div className="admin-login-header">
          <img src="/srr-logo.png" alt="SRR Pooja Works" className="admin-login-logo" />
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">SRR Pooja Works Management</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <label htmlFor="admin-password" className="admin-input-label">
              Password
            </label>
            <div className="admin-input-wrap">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="admin-input"
                autoFocus
                required
              />
              <button
                type="button"
                className="admin-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading || !password}
          >
            {loading ? (
              <span className="admin-btn-loading">
                <span className="admin-spinner-sm" /> Authenticating...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/" className="admin-back-link">← Back to Website</a>
        </div>
      </div>
    </div>
  )
}
