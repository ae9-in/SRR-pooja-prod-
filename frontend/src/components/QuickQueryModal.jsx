import { useState } from 'react'
import { X, Send, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react'
import api from '../lib/api'

const emptyForm = {
  name: '',
  shopName: '',
  phone: '',
  email: '',
  city: '',
  productInterest: 'General Wholesale Inquiry',
  quantity: '',
  message: '',
}

const PRODUCTS_LIST = [
  'General Wholesale Inquiry',
  'Sandalwood Agarbatti',
  'Rose Agarbatti',
  'Lavender Agarbatti',
  '3-in-1 Assorted Agarbatti Pack',
  'Pure Camphor 100g box',
  'Pooja Oil 1L',
  'Cotton Wicks',
  'Sandalwood Dhoop Sticks',
  'Kumkum',
  'Turmeric',
]

export default function QuickQueryModal({ isOpen, onClose, initialProduct = '' }) {
  const [form, setForm] = useState({
    ...emptyForm,
    productInterest: initialProduct || 'General Wholesale Inquiry',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/contact', form)
      setSubmitted(true)
    } catch (err) {
      let emsg = err.response?.data?.error
      if (typeof emsg === 'object' && emsg !== null) {
        emsg = emsg.message || JSON.stringify(emsg)
      }
      setError(emsg || 'Failed to submit inquiry. Please try again or WhatsApp us directly.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setForm({ ...emptyForm })
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto glass rounded-3xl p-6 sm:p-8 border border-golden-300/50 shadow-2xl"
        style={{ background: 'linear-gradient(145deg, #fdf8ee, #f4e0c0)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-golden-200/50 text-golden-800 transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="divider mb-2">
            <span className="text-golden-600 text-lg">ॐ</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-golden-900">
            Send Quick Query
          </h2>
          <p className="font-cormorant text-golden-700 text-base mt-1">
            Get instant wholesale quotes and product samples from SRR Pooja Works.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle size={56} className="text-green-600 mx-auto mb-4" />
            <h3 className="font-cinzel text-golden-900 text-2xl font-bold mb-2">
              Query Sent Successfully!
            </h3>
            <p className="font-cormorant text-golden-700 text-lg mb-6">
              Our team will review your query and contact you within 2-4 business hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://wa.me/918431119696"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine px-6 py-2.5 bg-green-700 text-white font-cinzel text-sm rounded-full flex items-center gap-2 hover:bg-green-800 transition-colors"
              >
                <MessageCircle size={16} /> WhatsApp Directly
              </a>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-golden-500 text-cream-100 font-cinzel text-sm rounded-full hover:bg-golden-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl border border-red-300 bg-red-50 text-red-800 text-sm font-cormorant flex items-start gap-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-cormorant text-golden-800 text-sm mb-1 font-semibold">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/50 font-cormorant text-golden-900 text-base placeholder:text-golden-400 focus:outline-none focus:border-golden-500"
                />
              </div>
              <div>
                <label className="block font-cormorant text-golden-800 text-sm mb-1 font-semibold">
                  Shop / Business Name *
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={form.shopName}
                  onChange={handleChange}
                  placeholder="Your shop name"
                  required
                  className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/50 font-cormorant text-golden-900 text-base placeholder:text-golden-400 focus:outline-none focus:border-golden-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-cormorant text-golden-800 text-sm mb-1 font-semibold">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 84311 19696"
                  required
                  className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/50 font-cormorant text-golden-900 text-base placeholder:text-golden-400 focus:outline-none focus:border-golden-500"
                />
              </div>
              <div>
                <label className="block font-cormorant text-golden-800 text-sm mb-1 font-semibold">
                  City & State *
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru, KA"
                  required
                  className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/50 font-cormorant text-golden-900 text-base placeholder:text-golden-400 focus:outline-none focus:border-golden-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-cormorant text-golden-800 text-sm mb-1 font-semibold">
                Product Interest *
              </label>
              <select
                name="productInterest"
                value={form.productInterest}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/50 font-cormorant text-golden-900 text-base focus:outline-none focus:border-golden-500 bg-transparent"
              >
                {PRODUCTS_LIST.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-cormorant text-golden-800 text-sm mb-1 font-semibold">
                Estimated Order Quantity
              </label>
              <input
                type="text"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 50 packs, 100 boxes..."
                className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/50 font-cormorant text-golden-900 text-base placeholder:text-golden-400 focus:outline-none focus:border-golden-500"
              />
            </div>

            <div>
              <label className="block font-cormorant text-golden-800 text-sm mb-1 font-semibold">
                Message / Custom Query
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={3}
                placeholder="Specify any questions or custom requirements..."
                className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/50 font-cormorant text-golden-900 text-base placeholder:text-golden-400 focus:outline-none focus:border-golden-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-shine w-full py-3 bg-gradient-to-r from-golden-600 to-golden-800 text-cream-100 font-cinzel tracking-wider text-sm rounded-xl shadow-lg hover:shadow-golden-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-cream-100/30 border-t-cream-100 rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} /> Send Query Now
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
