import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const CATEGORIES = ['Incense', 'Essentials', 'Accessories', 'Lamps', 'Decoration']
const EMPTY_PRODUCT = {
  name: '', category: 'Incense', price: '', bulkPrice: '',
  description: '', emoji: '🪔', tag: '', bg: '#fef3c7',
  inStock: true, minimumOrder: 10,
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({ ...EMPTY_PRODUCT })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  const token = localStorage.getItem('adminToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/admin/products', { headers })
      setProducts(data.data || [])
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  // Filter products
  const filtered = products.filter((p) => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'All' || p.category === filterCat
    return matchSearch && matchCat
  })

  // Open modal for add
  const openAddModal = () => {
    setEditingProduct(null)
    setForm({ ...EMPTY_PRODUCT })
    setImageFile(null)
    setImagePreview('')
    setFormError('')
    setShowModal(true)
  }

  // Open modal for edit
  const openEditModal = (product) => {
    setEditingProduct(product)
    setForm({
      name: product.name || '',
      category: product.category || 'Incense',
      price: product.price || '',
      bulkPrice: product.bulkPrice || '',
      description: product.description || '',
      emoji: product.emoji || '🪔',
      tag: product.tag || '',
      bg: product.bg || '#fef3c7',
      inStock: product.inStock !== false,
      minimumOrder: product.minimumOrder || 10,
    })
    setImageFile(null)
    setImagePreview(product.image || '')
    setFormError('')
    setShowModal(true)
  }

  // Handle image selection
  const handleImageSelect = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setFormError('Please select an image file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setFormError('Image must be under 10 MB.')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setFormError('')
  }

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.classList.remove('drag-over')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.classList.remove('drag-over')
    const file = e.dataTransfer.files[0]
    handleImageSelect(file)
  }

  // Save product (create or update)
  const handleSave = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!form.name || !form.price || !form.bulkPrice || !form.description) {
      setFormError('Please fill in all required fields.')
      return
    }

    setSaving(true)

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, val)
      })
      if (imageFile) {
        formData.append('image', imageFile)
      }

      if (editingProduct) {
        await axios.put(`/api/admin/products/${editingProduct._id}`, formData, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' },
        })
      } else {
        await axios.post('/api/admin/products', formData, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' },
        })
      }

      setShowModal(false)
      fetchProducts()
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  // Delete product
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await axios.delete(`/api/admin/products/${deleteTarget._id}`, { headers })
      setDeleteTarget(null)
      fetchProducts()
    } catch (err) {
      console.error('Failed to delete product:', err)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-loading-inline">
        <div className="admin-spinner" />
        <p>Loading products...</p>
      </div>
    )
  }

  return (
    <div className="admin-products">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="admin-select"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button className="admin-primary-btn" onClick={openAddModal}>
          + Add Product
        </button>
      </div>

      {/* Products count */}
      <p className="admin-count-label">
        Showing {filtered.length} of {products.length} products
      </p>

      {/* Products Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Bulk Price</th>
              <th>Stock</th>
              <th>Min Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="admin-empty-cell">No products found</td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="admin-product-thumb">
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <span className="admin-product-emoji">{product.emoji || '📦'}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-product-name">
                      {product.name}
                      {product.tag && <span className="admin-tag">{product.tag}</span>}
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td className="admin-cell-sm">{product.bulkPrice}</td>
                  <td>
                    <span className={`admin-stock-badge ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                      {product.inStock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td>{product.minimumOrder}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-edit-btn" onClick={() => openEditModal(product)} title="Edit">
                        ✏️
                      </button>
                      <button className="admin-delete-btn" onClick={() => setDeleteTarget(product)} title="Delete">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-body">
              {/* Image Upload */}
              <div className="admin-form-group">
                <label>Product Image</label>
                <div
                  ref={dropZoneRef}
                  className="admin-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="admin-dropzone-preview">
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        className="admin-dropzone-remove"
                        onClick={(e) => {
                          e.stopPropagation()
                          setImageFile(null)
                          setImagePreview(editingProduct?.image || '')
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="admin-dropzone-empty">
                      <span className="admin-dropzone-icon">📷</span>
                      <p>Drag & drop an image here, or click to browse</p>
                      <span className="admin-dropzone-hint">Max 10 MB · JPG, PNG, WebP</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Name & Category */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Name <span className="req">*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Product name"
                    className="admin-input"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Category <span className="req">*</span></label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="admin-input"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Price & Bulk Price */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Price <span className="req">*</span></label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Rs. 59"
                    className="admin-input"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Bulk Price <span className="req">*</span></label>
                  <input
                    type="text"
                    value={form.bulkPrice}
                    onChange={(e) => setForm({ ...form, bulkPrice: e.target.value })}
                    placeholder="Rs. 95/pack (Min. 50 packs)"
                    className="admin-input"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="admin-form-group">
                <label>Description <span className="req">*</span></label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description..."
                  className="admin-input admin-textarea"
                  rows={3}
                  required
                />
              </div>

              {/* Emoji, Tag, BG */}
              <div className="admin-form-row three-col">
                <div className="admin-form-group">
                  <label>Emoji</label>
                  <input
                    type="text"
                    value={form.emoji}
                    onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Tag</label>
                  <input
                    type="text"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    placeholder="Bestseller"
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>BG Color</label>
                  <div className="admin-color-wrap">
                    <input
                      type="color"
                      value={form.bg}
                      onChange={(e) => setForm({ ...form, bg: e.target.value })}
                      className="admin-color-input"
                    />
                    <span className="admin-color-code">{form.bg}</span>
                  </div>
                </div>
              </div>

              {/* In Stock & Min Order */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>In Stock</label>
                  <label className="admin-toggle">
                    <input
                      type="checkbox"
                      checked={form.inStock}
                      onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                    />
                    <span className="admin-toggle-slider" />
                    <span className="admin-toggle-label">{form.inStock ? 'Yes' : 'No'}</span>
                  </label>
                </div>
                <div className="admin-form-group">
                  <label>Minimum Order</label>
                  <input
                    type="number"
                    value={form.minimumOrder}
                    onChange={(e) => setForm({ ...form, minimumOrder: Number(e.target.value) })}
                    className="admin-input"
                    min={1}
                  />
                </div>
              </div>

              {formError && (
                <div className="admin-error">{formError}</div>
              )}

              <div className="admin-modal-footer">
                <button type="button" className="admin-cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn" disabled={saving}>
                  {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal admin-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Delete Product</h3>
              <button className="admin-modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <p className="admin-confirm-text">
                Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
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
