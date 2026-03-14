import { useState } from 'react'
import { Phone, MessageCircle, Send, CheckCircle, Package, AlertCircle } from 'lucide-react'
import api from '../lib/api'

const emptyForm = { name: '', shopName: '', phone: '', email: '', city: '', productInterest: '', quantity: '', message: '' }
const primaryPhone = '8431119696'
const primaryPhoneHref = 'tel:+918431119696'
const whatsappHref = 'https://wa.me/918431119696'

export default function Contact() {
  const [form, setForm] = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/contact', form)
      setSubmitted(true)
    } catch (requestError) {
      let emsg = requestError.response?.data?.error
      if (typeof emsg === 'object' && emsg !== null) {
        emsg = emsg.message || JSON.stringify(emsg)
      }
      setError(emsg || 'Failed to submit inquiry. Check backend server and try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactCards = [
    { Icon: Phone, title: 'Call Us', lines: [primaryPhone], hint: 'Reach us directly for product enquiries', href: primaryPhoneHref, btn: 'Call Now' },
    { Icon: MessageCircle, title: 'WhatsApp Us', lines: [primaryPhone], hint: 'Send your product list for a quick response', href: whatsappHref, btn: 'WhatsApp' },
  ]

  const steps = [
    { Icon: Send, num: '01', title: 'Submit Inquiry', desc: 'Fill the form or send your product list on WhatsApp.' },
    { Icon: MessageCircle, num: '02', title: 'Get Quote', desc: 'We share product details and pricing with you.' },
    { Icon: CheckCircle, num: '03', title: 'Confirm Order', desc: 'Approve the order and confirm quantity requirements.' },
    { Icon: Package, num: '04', title: 'Dispatch', desc: 'Your order is prepared and dispatched after confirmation.' },
  ]

  return (
    <main className="pt-20 min-h-screen" style={{ background: 'linear-gradient(180deg,#fdf8ee,#f4e0c0 40%,#fdf8ee)' }}>
      <section className="relative py-16 sm:py-24 overflow-hidden text-center" style={{ background: 'linear-gradient(135deg,#3d2510,#7d502a,#c9965a)' }}>
        <div className="absolute font-cinzel text-golden-400/5 select-none pointer-events-none" style={{ fontSize: '25vw', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>Om</div>
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full border border-golden-400/30 mb-5">
            <Package size={14} className="text-golden-300" />
            <span className="font-cormorant text-golden-300 text-sm tracking-widest uppercase">Wholesale Inquiries</span>
          </div>
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-cream-100 mb-4">Contact Us</h1>
          <p className="font-cormorant text-cream-200 text-xl sm:text-2xl max-w-xl mx-auto">Reach out for product enquiries, wholesale pricing and retailer partnerships.</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {contactCards.map(({ Icon, title, lines, hint, href, btn }) => (
            <div key={title} className="card-hover glass rounded-2xl p-6 border border-golden-200/50 text-center group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-golden-200 to-golden-300 flex items-center justify-center mx-auto mb-4 shadow-[0_10px_24px_rgba(128,79,35,0.14)] group-hover:scale-110 transition-transform duration-300">
                <Icon size={22} strokeWidth={1.9} className="text-golden-700" />
              </div>
              <h3 className="font-cinzel text-golden-800 text-sm font-semibold tracking-wide mb-3">{title}</h3>
              <div className="min-h-[88px] flex flex-col items-center justify-center">
                {lines.map((line) => (
                  <p key={line} className="font-playfair text-golden-800 text-[1.05rem] leading-7 tracking-normal max-w-[30ch] mx-auto">
                    {line}
                  </p>
                ))}
              </div>
              <p className="font-cormorant text-golden-600 text-base leading-6 mt-3 mb-4 max-w-[28ch] mx-auto">{hint}</p>
              <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="btn-shine inline-block px-5 py-2 bg-golden-500 text-cream-100 font-cormorant text-sm rounded-full hover:bg-golden-400 transition-colors">
                {btn}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 sm:py-20" style={{ background: 'linear-gradient(135deg,#9e6b35,#c9965a)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="divider mb-4"><span className="text-cream-200/60">Om</span></div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-cream-100 mb-3">How to Place an Order</h2>
          <p className="font-cormorant text-cream-200 text-xl mb-12">Simple 4-step process to order from SRR Pooja Works</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ Icon, num, title, desc }) => (
              <div key={num} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cream-100/18 to-cream-100/8 border border-cream-200/30 shadow-[0_12px_30px_rgba(89,50,18,0.12)] flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} strokeWidth={1.8} className="text-cream-100" />
                </div>
                <div className="font-cinzel text-golden-300 text-xs font-bold tracking-widest mb-2">STEP {num}</div>
                <h3 className="font-playfair text-cream-100 text-lg font-semibold mb-2">{title}</h3>
                <p className="font-cormorant text-cream-200 text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="divider mb-4"><span className="text-golden-500 text-xl">Om</span></div>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-golden-700 mb-3">Send Inquiry</h2>
            <p className="font-cormorant text-golden-600 text-xl">Fill the form and we will get back to you with product details.</p>
          </div>

          {submitted ? (
            <div className="glass rounded-3xl p-12 border border-golden-300/50 text-center">
              <CheckCircle size={60} className="text-green-600 mx-auto mb-5" />
              <h3 className="font-cinzel text-golden-800 text-2xl font-bold mb-3">Inquiry Received</h3>
              <p className="font-cormorant text-golden-600 text-xl mb-5">Our team will contact you shortly.</p>
              <p className="font-cormorant text-golden-500 text-base mb-8">
                WhatsApp: <a href={whatsappHref} className="text-golden-700 font-bold underline">{primaryPhone}</a>
              </p>
              <button onClick={() => { setSubmitted(false); setForm(emptyForm) }} className="btn-shine px-8 py-3 bg-golden-500 text-cream-100 font-cormorant rounded-full cursor-pointer border-none text-base hover:bg-golden-400 transition-colors">
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="glass rounded-3xl p-8 sm:p-10 border border-golden-300/50">
              {error && (
                <div className="mb-5 rounded-2xl border border-red-300/60 bg-red-50/70 px-4 py-3 text-red-800 font-cormorant flex items-start gap-3">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {[
                  { name: 'name', label: 'Your Name *', type: 'text', ph: 'Full name', req: true },
                  { name: 'shopName', label: 'Shop / Business Name *', type: 'text', ph: 'Your shop name', req: true },
                  { name: 'phone', label: 'Phone / WhatsApp *', type: 'tel', ph: '+91 84311 19696', req: true },
                  { name: 'email', label: 'Email Address', type: 'email', ph: 'your@email.com', req: false },
                  { name: 'city', label: 'City & State *', type: 'text', ph: 'Bengaluru, Karnataka', req: true },
                ].map(({ name, label, type, ph, req }) => (
                  <div key={name}>
                    <label className="block font-cormorant text-golden-700 text-sm mb-1.5 tracking-wide">{label}</label>
                    <input type={type} name={name} value={form[name]} onChange={handle} placeholder={ph} required={req} className="w-full px-4 py-3 glass rounded-xl border border-golden-300/40 font-cormorant text-golden-800 text-base placeholder:text-golden-400 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="block font-cormorant text-golden-700 text-sm mb-1.5 tracking-wide">Products Interested In *</label>
                  <select name="productInterest" value={form.productInterest} onChange={handle} required className="w-full px-4 py-3 glass rounded-xl border border-golden-300/40 font-cormorant text-golden-800 text-base transition-all bg-transparent">
                    <option value="">Select product</option>
                    {['Sandalwood Agarbatti', 'Rose Agarbatti', 'Lavender Agarbatti', '3-in-1 Assorted Agarbatti Pack', 'Pure Camphor', 'Pooja Oil', 'Cotton Wicks', 'Sandalwood Dhoop Sticks', 'Kumkum', 'Turmeric'].map((option) => <option key={option}>{option}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-5">
                <label className="block font-cormorant text-golden-700 text-sm mb-1.5 tracking-wide">Approximate Order Quantity</label>
                <input name="quantity" value={form.quantity} onChange={handle} placeholder="e.g. 20 boxes, 50 packs..." className="w-full px-4 py-3 glass rounded-xl border border-golden-300/40 font-cormorant text-golden-800 text-base placeholder:text-golden-400 transition-all" />
              </div>
              <div className="mb-8">
                <label className="block font-cormorant text-golden-700 text-sm mb-1.5 tracking-wide">Additional Message</label>
                <textarea name="message" value={form.message} onChange={handle} rows={4} placeholder="Any specific requirements or questions..." className="w-full px-4 py-3 glass rounded-xl border border-golden-300/40 font-cormorant text-golden-800 text-base placeholder:text-golden-400 transition-all resize-none" />
              </div>
              <button type="submit" disabled={loading} className="btn-shine w-full py-4 bg-gradient-to-r from-golden-500 to-golden-700 text-cream-100 font-cinzel tracking-widest text-sm rounded-xl shadow-lg hover:shadow-golden-500/40 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border-none disabled:opacity-60">
                {loading ? <div className="w-5 h-5 border-2 border-cream-100/30 border-t-cream-100 rounded-full animate-spin" /> : <><Send size={16} /> Send Inquiry</>}
              </button>
              <p className="font-cormorant text-golden-500 text-lg text-center mt-4">
                Or WhatsApp: <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-golden-700 font-bold underline text-lg">{primaryPhone}</a>
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
