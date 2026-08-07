import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, Award, Truck, ShieldCheck, Users, ArrowRight, AlertCircle, Send, CheckCircle, MessageCircle } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import api from '../lib/api'
import QuickQueryModal from '../components/QuickQueryModal'

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.12 })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

function HeroSection() {
  const [charIdx, setCharIdx] = useState(0)
  const title = 'SRR Pooja Works'

  useEffect(() => {
    if (charIdx >= title.length) return
    const timer = setTimeout(() => setCharIdx((index) => index + 1), 80)
    return () => clearTimeout(timer)
  }, [charIdx, title.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(160deg,#fbf3e1 0%,#f0d6aa 24%,#d4a05f 56%,#b7793e 80%,#8e5a2c 100%)' }}>
      {[700, 500, 320].map((size, index) => (
        <div key={size} className="absolute rounded-full border border-golden-400/10" style={{ width: size, height: size, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: `${index % 2 === 0 ? 'spin-slow' : 'spin-rev'} ${50 - index * 8}s linear infinite` }} />
      ))}

      <div className="absolute font-cinzel text-golden-900/[0.06] select-none pointer-events-none" style={{ fontSize: '40vw', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>ॐ</div>
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-amber-100/25 blur-3xl float" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-golden-700/20 blur-3xl float" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,248,232,0.38),transparent_38%),linear-gradient(to_bottom,rgba(255,250,240,0.08),rgba(61,37,16,0.08))]" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-golden-700/20 bg-cream-100/20" style={{ animation: 'fadeIn .6s ease .2s both' }}>
          <span className="text-golden-700">ॐ</span>
          <span className="font-cormorant text-golden-800 text-sm tracking-widest uppercase">Wholesale Pooja Suppliers</span>
          <span className="text-golden-700">ॐ</span>
        </div>

        <h1 className="font-cinzel font-bold mb-6 text-golden-900" style={{ fontSize: 'clamp(2.2rem,7vw,5.5rem)', lineHeight: 1.1, textShadow: '0 1px 0 rgba(255,245,224,0.72), 0 4px 10px rgba(82,46,16,0.28), 0 18px 28px rgba(56,29,10,0.22)' }}>
          {title.split('').map((char, index) => (
            <span key={index} className={index < charIdx ? 'hero-title-char' : ''} style={{ display: 'inline-block', opacity: index < charIdx ? 1 : 0, marginRight: char === ' ' ? '0.3em' : 0, transition: 'opacity .15s' }}>
              {char}
            </span>
          ))}
        </h1>

        <p className="font-cormorant text-golden-900/85 max-w-2xl mx-auto mb-12" style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', animation: 'fadeUp .8s ease 1.7s both' }}>
          Premium wholesale pooja products for retailers. Trusted by shops across South India.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animation: 'fadeUp .8s ease 2s both' }}>
          <Link to="/products" className="btn-shine w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-golden-500 to-golden-700 text-cream-100 font-cinzel tracking-widest text-sm rounded-full shadow-2xl shadow-golden-600/40 flex items-center justify-center gap-2 group">
            View All Products <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/contact" className="glass w-full sm:w-auto px-8 py-4 border border-golden-700/25 text-golden-900 font-cinzel tracking-widest text-sm rounded-full hover:bg-golden-50/30 transition-all text-center">
            Become a Retailer
          </Link>
        </div>

      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 float">
        <span className="font-cormorant text-golden-800 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-golden-700 to-transparent" />
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(28px) } to { opacity: 1; transform: none } }
        .hero-title-char {
          background: linear-gradient(180deg, #fde8bd 0%, #e7b466 16%, #b56b2c 34%, #7a4318 58%, #4f260d 80%, #2d1307 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke: 1px rgba(84, 43, 14, 0.26);
          filter: drop-shadow(0 1px 0 rgba(255, 245, 226, 0.55)) drop-shadow(0 8px 16px rgba(58, 29, 10, 0.28));
        }
      `}</style>
    </section>
  )
}

function CarouselSection() {
  const { products, error } = useProducts()
  const [cur, setCur] = useState(0)
  const [failedImages, setFailedImages] = useState({})
  const [ref, vis] = useReveal()
  const total = products.length

  useEffect(() => {
    if (!total) return undefined
    const timer = setInterval(() => setCur((value) => (value + 1) % total), 3200)
    return () => clearInterval(timer)
  }, [total])

  useEffect(() => {
    if (cur >= total && total > 0) {
      setCur(0)
    }
  }, [cur, total])

  const markImageFailed = (productId) => {
    setFailedImages((current) => ({ ...current, [productId]: true }))
  }

  const visibleProducts = total ? [0, 1, 2].map((offset) => products[(cur + offset) % total]) : []

  return (
    <section ref={ref} className="py-20 sm:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#fdf8ee,#f4e0c0)' }}>
      <div className="absolute inset-0 dot-pattern pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal" style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(30px)', transition: 'all .8s' }}>
          <div className="divider mb-4"><span className="text-golden-500 text-xl">ॐ</span></div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-golden-700 mb-4">Our Sacred Collection</h2>
          <p className="font-cormorant text-golden-600 text-xl max-w-xl mx-auto">Curated pooja essentials for every ritual and occasion.</p>
        </div>

        {error && (
          <div className="mb-6 glass border border-amber-300/50 rounded-2xl px-4 py-3 text-amber-900 font-cormorant flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {visibleProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {visibleProducts.map((product, index) => (
                <div key={`${product.id}-${cur}`} className="card-hover glass rounded-2xl overflow-hidden border border-golden-200/50" style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(40px)', transition: `all .6s ease ${index * 0.1}s` }}>
                  <div className="h-64 flex items-center justify-center relative overflow-hidden" style={{ background: product.bg, fontSize: '4.5rem' }}>
                    {product.image && !failedImages[product.id] ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain px-3 py-0 transition-transform duration-500"
                        onError={() => markImageFailed(product.id)}
                      />
                    ) : (
                      product.emoji
                    )}
                    {product.tag && <span className="tag-badge absolute top-3 right-3">{product.tag}</span>}
                  </div>
                  <div className="p-5">
                    <div className="font-cormorant text-golden-500 text-xs tracking-widest uppercase mb-1">{product.category}</div>
                    <h3 className="font-playfair text-golden-900 text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="font-cormorant text-golden-700 text-base leading-relaxed line-clamp-2 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-cinzel text-golden-700 font-bold text-lg">{product.price}</span>
                      <Link to="/products" className="btn-shine px-4 py-1.5 bg-gradient-to-r from-golden-400 to-golden-600 text-cream-100 font-cormorant text-sm rounded-full">
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 mb-10">
              <button onClick={() => setCur((value) => (value - 1 + total) % total)} className="w-10 h-10 rounded-full glass border border-golden-400/40 flex items-center justify-center text-golden-700 hover:bg-golden-100 transition-all">
                <ChevronLeft size={18} />
              </button>
              {products.map((product, index) => (
                <button key={product.id || index} onClick={() => setCur(index)} className="rounded-full border-none transition-all duration-300" style={{ width: index === cur ? 28 : 8, height: 8, background: index === cur ? '#c9965a' : 'rgba(201,150,90,.35)' }} />
              ))}
              <button onClick={() => setCur((value) => (value + 1) % total)} className="w-10 h-10 rounded-full glass border border-golden-400/40 flex items-center justify-center text-golden-700 hover:bg-golden-100 transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="glass rounded-3xl border border-golden-200/50 p-8 text-center font-cormorant text-golden-700 text-xl">
            Product catalog is loading or unavailable.
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/products" className="btn-shine inline-flex items-center gap-3 px-10 py-4 border-2 border-golden-500 text-golden-700 font-cinzel tracking-widest text-sm rounded-full hover:bg-golden-500 hover:text-cream-100 transition-all duration-300">
            View All {total || 0} Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  const [ref, vis] = useReveal()

  return (
    <section id="about" ref={ref} className="py-20 sm:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#3d2510 0%,#7d502a 45%,#9e6b35 100%)' }}>
      <div className="absolute inset-0 dot-pattern opacity-5 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-golden-400/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.2fr] gap-10 lg:gap-16 items-center">
          <div style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateX(-40px)', transition: 'all .85s ease' }}>
            <div className="glass-dark rounded-[2rem] p-8 sm:p-10 border border-golden-500/20 relative overflow-hidden">
              <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-golden-300/10 blur-3xl" />
              <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-golden-700/20 blur-3xl" />

              <div className="relative">
                <div className="inline-flex items-center gap-3 rounded-full border border-golden-400/30 px-4 py-2 mb-6">
                  <span className="text-golden-300 text-xl">ॐ</span>
                  <span className="font-cormorant text-golden-300 tracking-[0.2em] text-sm uppercase">Simple, trusted, retail-ready</span>
                </div>

                <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-cream-100 leading-tight mb-5">
                  Everyday pooja products, presented with clarity and care.
                </h2>

                <p className="font-cormorant text-golden-200 text-xl leading-8 mb-8 max-w-[28rem]">
                  SRR Pooja Works keeps the range focused, the packaging clean and the buying process easy for stores that want dependable supply.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['10+', 'Core products'],
                    ['1', 'Direct contact point'],
                    ['Bengaluru', 'Operating base'],
                    ['Daily', 'Retail-ready supply'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-golden-500/15 bg-black/10 px-4 py-4">
                      <div className="font-cinzel text-golden-300 text-2xl font-bold mb-1">{value}</div>
                      <div className="font-cormorant text-golden-200 text-base">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateX(40px)', transition: 'all .85s .12s ease' }}>
            <div className="divider mb-6"><span className="text-golden-400 text-xl">ॐ</span></div>
            <h3 className="font-cinzel font-bold mb-6 text-cream-100" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
              A small brand with a clear promise.
            </h3>

            <div className="space-y-5 mb-8">
              <p className="font-cormorant text-golden-200 text-xl leading-8">
                We focus on a practical range of pooja products that stores actually move, from agarbatti and dhoop to camphor, oil, wicks, kumkum and turmeric.
              </p>
              <p className="font-cormorant text-golden-200 text-xl leading-8">
                Instead of trying to offer everything, we keep the collection familiar, straightforward and easy to reorder. That makes the experience smoother for both retailers and customers.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                'A focused catalog that is easy to understand',
                'Quick ordering through call or WhatsApp',
                'Products that are simple to place and sell in-store',
              ].map((item) => (
                <div key={item} className="glass-dark rounded-2xl px-5 py-4 border border-golden-600/20 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-golden-300/15 flex items-center justify-center text-golden-300 text-lg shrink-0">✦</div>
                  <p className="font-cormorant text-golden-100 text-lg leading-7">{item}</p>
                </div>
              ))}
            </div>

            <Link to="/contact" className="btn-shine inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-golden-300 to-golden-400 text-golden-900 font-cinzel tracking-wider text-sm rounded-full shadow-xl">
              Talk to Us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyUsSection() {
  const [ref, vis] = useReveal()
  const features = [
    { Icon: Award, title: 'Premium Quality', desc: 'Every product is sourced from verified manufacturers and checked before dispatch.' },
    { Icon: Truck, title: 'Pan-India Delivery', desc: 'Reliable delivery options for retailers with clear order coordination.' },
    { Icon: ShieldCheck, title: 'Best Wholesale Rates', desc: 'Direct sourcing keeps pricing competitive and retailer margins healthy.' },
    { Icon: Users, title: 'Dedicated Support', desc: 'Retailers get responsive support for bulk ordering, quotes and follow-up.' },
  ]

  return (
    <section ref={ref} className="py-20 sm:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#f4e0c0,#fdf8ee)' }}>
      <div className="absolute inset-0 dot-pattern pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14" style={{ opacity: vis ? 1 : 0, transition: 'all .8s' }}>
          <div className="divider mb-4"><span className="text-golden-500 text-xl">ॐ</span></div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-golden-700 mb-4">Why Retailers Choose Us</h2>
          <p className="font-cormorant text-golden-600 text-xl max-w-xl mx-auto">Retail partners rely on SRR Pooja Works for dependable wholesale supply.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ Icon, title, desc }, index) => (
            <div key={title} className="card-hover glass rounded-2xl p-6 border border-golden-200/60 text-center group" style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(40px)', transition: `all .7s ease ${index * 0.1}s` }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-golden-100 to-golden-200 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <Icon size={26} className="text-golden-700" />
              </div>
              <h3 className="font-playfair text-golden-900 text-xl font-semibold mb-3">{title}</h3>
              <p className="font-cormorant text-golden-700 text-base leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const [ref, vis] = useReveal()
  const reviews = [
    { name: 'Ramesh Iyer', shop: 'Iyer Pooja Stores, Coimbatore', text: 'Been ordering from SRR for 8 years. Quality never drops, prices stay fair and delivery is dependable.' },
    { name: 'Lakshmi Devi', shop: 'Devi Enterprises, Bangalore', text: 'The agarbatti and camphor quality is exceptional. My customers keep asking for the same stock.' },
    { name: 'Suresh Kumar', shop: 'Kumar Bazaar, Chennai', text: 'Fantastic wholesale rates and responsive support. Ordering stays simple and fast.' },
  ]

  return (
    <section ref={ref} className="py-20 sm:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#fdf8ee,#f4e0c0,#ddb87a)' }}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14" style={{ opacity: vis ? 1 : 0, transition: 'all .8s' }}>
          <div className="divider mb-4"><span className="text-golden-500 text-xl">ॐ</span></div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-golden-700">What Our Partners Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((review, index) => (
            <div key={review.name} className="card-hover glass rounded-2xl p-6 sm:p-8 border border-golden-300/40" style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(35px)', transition: `all .7s ease ${index * 0.12}s` }}>
              <div className="flex gap-1 mb-4">{[...Array(5)].map((_, starIndex) => <Star key={starIndex} size={16} className="text-golden-500 fill-golden-500" />)}</div>
              <p className="font-cormorant text-golden-800 text-lg leading-relaxed mb-6 italic">"{review.text}"</p>
              <div className="border-t border-golden-300/40 pt-4">
                <div className="font-playfair text-golden-900 font-semibold">{review.name}</div>
                <div className="font-cormorant text-golden-600 text-sm">{review.shop}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const [ref, vis] = useReveal()
  const [showQueryForm, setShowQueryForm] = useState(false)
  const [queryModalOpen, setQueryModalOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    shopName: '',
    phone: '',
    city: '',
    productInterest: 'General Wholesale Inquiry',
    quantity: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

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
      setError(emsg || 'Failed to send query. Please try again or WhatsApp us.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section ref={ref} className="py-20 relative overflow-hidden text-center" style={{ background: 'linear-gradient(135deg,#9e6b35,#c9965a,#ddb87a)' }}>
        <div className="absolute font-cinzel text-golden-900/5 pointer-events-none select-none" style={{ fontSize: '28vw', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>ॐ</div>
        <div className="relative max-w-4xl mx-auto px-4" style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(30px)', transition: 'all .8s' }}>
          <div className="divider mb-6"><span className="text-cream-200/60">ॐ</span></div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-cream-100 mb-5">Ready to Stock Your Store?</h2>
          <p className="font-cormorant text-cream-200 text-xl sm:text-2xl mb-10 max-w-2xl mx-auto">Join retailers who trust SRR Pooja Works for wholesale supply.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowQueryForm(!showQueryForm)}
              className="btn-shine w-full sm:w-auto px-10 py-4 bg-golden-900 text-cream-100 font-cinzel tracking-wider rounded-full shadow-2xl hover:bg-golden-800 transition-all text-center flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <Send size={18} /> {showQueryForm ? 'Hide Query Form' : 'Send Quick Query'}
            </button>
            <Link to="/contact" className="btn-shine w-full sm:w-auto px-10 py-4 bg-cream-100 text-golden-800 font-cinzel tracking-wider rounded-full shadow-2xl hover:bg-white transition-all text-center">
              Contact Us Now
            </Link>
            <Link to="/products" className="w-full sm:w-auto px-10 py-4 border-2 border-cream-200/60 text-cream-100 font-cinzel tracking-wider rounded-full hover:bg-cream-100/10 transition-all text-center">
              Browse Products
            </Link>
          </div>

          {/* Inline Quick Query Form */}
          {showQueryForm && (
            <div className="mt-10 max-w-2xl mx-auto text-left glass rounded-3xl p-6 sm:p-8 border border-cream-200/40 shadow-2xl" style={{ background: 'rgba(253, 248, 238, 0.96)' }}>
              <div className="text-center mb-6">
                <h3 className="font-cinzel text-2xl font-bold text-golden-900">Send Quick Wholesale Query</h3>
                <p className="font-cormorant text-golden-700 text-base">We will contact you with wholesale pricing and catalog details.</p>
              </div>

              {submitted ? (
                <div className="text-center py-6">
                  <CheckCircle size={52} className="text-green-600 mx-auto mb-3" />
                  <h4 className="font-cinzel text-golden-900 text-xl font-bold mb-2">Query Received!</h4>
                  <p className="font-cormorant text-golden-700 text-lg mb-4">Our team will get in touch with you shortly.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', shopName: '', phone: '', city: '', productInterest: 'General Wholesale Inquiry', quantity: '', message: '' }) }}
                    className="btn-shine px-6 py-2 bg-golden-600 text-cream-100 font-cinzel text-sm rounded-full cursor-pointer border-none"
                  >
                    Send Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl border border-red-300 bg-red-50 text-red-800 text-sm font-cormorant flex items-center gap-2">
                      <AlertCircle size={16} /> <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-cormorant text-golden-800 text-sm font-semibold mb-1">Your Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handle} placeholder="Full name" required className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/60 font-cormorant text-golden-900 text-base placeholder:text-golden-400 focus:outline-none focus:border-golden-600" />
                    </div>
                    <div>
                      <label className="block font-cormorant text-golden-800 text-sm font-semibold mb-1">Shop / Business Name *</label>
                      <input type="text" name="shopName" value={form.shopName} onChange={handle} placeholder="Shop name" required className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/60 font-cormorant text-golden-900 text-base placeholder:text-golden-400 focus:outline-none focus:border-golden-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-cormorant text-golden-800 text-sm font-semibold mb-1">Phone / WhatsApp *</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handle} placeholder="+91 84311 19696" required className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/60 font-cormorant text-golden-900 text-base placeholder:text-golden-400 focus:outline-none focus:border-golden-600" />
                    </div>
                    <div>
                      <label className="block font-cormorant text-golden-800 text-sm font-semibold mb-1">City & State *</label>
                      <input type="text" name="city" value={form.city} onChange={handle} placeholder="e.g. Bengaluru, KA" required className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/60 font-cormorant text-golden-900 text-base placeholder:text-golden-400 focus:outline-none focus:border-golden-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-cormorant text-golden-800 text-sm font-semibold mb-1">Product Interest *</label>
                      <select name="productInterest" value={form.productInterest} onChange={handle} required className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/60 font-cormorant text-golden-900 text-base focus:outline-none focus:border-golden-600 bg-transparent">
                        {['General Wholesale Inquiry', 'Sandalwood Agarbatti', 'Rose Agarbatti', 'Lavender Agarbatti', '3-in-1 Assorted Agarbatti Pack', 'Pure Camphor 100g box', 'Pooja Oil 1L', 'Cotton Wicks', 'Sandalwood Dhoop Sticks', 'Kumkum', 'Turmeric'].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-cormorant text-golden-800 text-sm font-semibold mb-1">Approx Quantity</label>
                      <input type="text" name="quantity" value={form.quantity} onChange={handle} placeholder="e.g. 50 packs" className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/60 font-cormorant text-golden-900 text-base placeholder:text-golden-400 focus:outline-none focus:border-golden-600" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cormorant text-golden-800 text-sm font-semibold mb-1">Message / Note</label>
                    <textarea name="message" value={form.message} onChange={handle} rows={3} placeholder="Any specific requirements..." className="w-full px-3.5 py-2.5 glass rounded-xl border border-golden-300/60 font-cormorant text-golden-900 text-base placeholder:text-golden-400 focus:outline-none focus:border-golden-600 resize-none" />
                  </div>

                  <button type="submit" disabled={loading} className="btn-shine w-full py-3.5 bg-gradient-to-r from-golden-700 to-golden-900 text-cream-100 font-cinzel tracking-widest text-sm rounded-xl shadow-lg hover:shadow-golden-700/40 transition-all flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-60">
                    {loading ? <div className="w-5 h-5 border-2 border-cream-100/30 border-t-cream-100 rounded-full animate-spin" /> : <><Send size={16} /> Submit Query Now</>}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
      <QuickQueryModal isOpen={queryModalOpen} onClose={() => setQueryModalOpen(false)} />
    </>
  )
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CarouselSection />
      <AboutSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}

