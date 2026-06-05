import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Phone, Instagram, Facebook, Youtube } from 'lucide-react'

const primaryPhone = '8431119696'
const footerProducts = [
  'Sandalwood Agarbatti',
  'Rose Agarbatti',
  'Lavender Agarbatti',
  '3-in-1 Assorted Agarbatti Pack',
  'Pure Camphor',
  'Pooja Oil',
  'Cotton Wicks',
  'Sandalwood Dhoop Sticks',
  'Kumkum',
  'Turmeric',
]

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const goAbout = (event) => {
    event.preventDefault()
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 300)
    } else {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative text-cream-200 overflow-hidden" style={{ background: 'linear-gradient(135deg,#3d2510 0%,#7d502a 50%,#9e6b35 100%)' }}>
      <div className="h-px bg-gradient-to-r from-transparent via-golden-400 to-transparent" />
      <div className="absolute inset-0 dot-pattern opacity-5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img 
                src="/srr-logo.png" 
                alt="SRR Logo" 
                className="w-12 h-12 rounded-full object-cover shadow-lg border border-golden-500/30" 
              />
              <div>
                <div className="font-cinzel font-bold text-golden-300 text-lg">SRR</div>
                <div className="font-cormorant text-golden-400 text-sm tracking-widest uppercase">Pooja Works</div>
              </div>
            </div>
            <p className="font-cormorant text-golden-200 text-base leading-relaxed mb-5">
              Wholesale pooja products for retailers and spiritual stores from Bengaluru.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, index) => (
                <a key={index} href="#" className="w-9 h-9 rounded-full border border-golden-600 flex items-center justify-center text-golden-400 hover:text-golden-300 hover:border-golden-400 hover:bg-golden-700/40 transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-cinzel text-golden-300 font-semibold tracking-wider mb-5 text-sm uppercase">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'About Us', onClick: goAbout },
                { label: 'Products', to: '/products' },
                { label: 'Contact', to: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  {item.onClick ? (
                    <button onClick={item.onClick} className="font-cormorant text-golden-200 hover:text-golden-300 text-base transition-colors flex items-center gap-2 group bg-transparent border-none cursor-pointer">
                      <span className="w-4 h-px bg-golden-600 group-hover:w-6 group-hover:bg-golden-400 transition-all duration-300" />
                      {item.label}
                    </button>
                  ) : (
                    <Link to={item.to} className="font-cormorant text-golden-200 hover:text-golden-300 text-base transition-colors flex items-center gap-2 group">
                      <span className="w-4 h-px bg-golden-600 group-hover:w-6 group-hover:bg-golden-400 transition-all duration-300" />
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-cinzel text-golden-300 font-semibold tracking-wider mb-5 text-sm uppercase">Our Products</h3>
            <ul className="space-y-3">
              {footerProducts.map((item) => (
                <li key={item}>
                  <Link to="/products" className="font-cormorant text-golden-200 hover:text-golden-300 text-base transition-colors flex items-center gap-2 group">
                    <span className="w-4 h-px bg-golden-600 group-hover:w-6 group-hover:bg-golden-400 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-cinzel text-golden-300 font-semibold tracking-wider mb-5 text-sm uppercase">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-golden-400 shrink-0" />
                <a href="tel:+918431119696" className="font-playfair text-golden-100 hover:text-golden-300 text-[1.05rem] tracking-normal transition-colors">{primaryPhone}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-golden-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-cormorant text-golden-400 text-sm">© {new Date().getFullYear()} SRR Pooja Works. All rights reserved.</p>
          <div className="flex items-center gap-2 text-golden-500 text-sm font-cormorant">
            <span>ॐ</span><span>Serving devotion with trusted products</span><span>ॐ</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
