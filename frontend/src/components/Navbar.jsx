import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  const goAbout = (e) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 300)
    } else {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    }
    setOpen(false)
  }

  const navLinks = [
    { label: 'Home',     to: '/' },
    { label: 'About',    onClick: goAbout },
    { label: 'Products', to: '/products' },
    { label: 'Contact',  to: '/contact' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-lg py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/srr-logo.png" 
              alt="SRR Logo" 
              className="w-10 h-10 rounded-full object-cover shadow-lg border border-golden-500/30" 
            />
            <div>
              <div className="font-cinzel font-bold text-golden-700 text-base leading-tight tracking-wide">SRR</div>
              <div className="font-cormorant text-golden-500 text-xs tracking-widest uppercase">Pooja Works</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.onClick ? (
                <button key={link.label} onClick={link.onClick}
                  className="relative px-4 py-2 font-cormorant text-golden-800 text-lg font-medium tracking-wide group hover:text-golden-500 transition-colors bg-transparent border-none cursor-pointer">
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-golden-400 to-golden-600 group-hover:w-3/4 transition-all duration-300" />
                </button>
              ) : (
                <Link key={link.label} to={link.to}
                  className="relative px-4 py-2 font-cormorant text-golden-800 text-lg font-medium tracking-wide group hover:text-golden-500 transition-colors">
                  {link.label}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-golden-400 to-golden-600 transition-all duration-300 ${location.pathname === link.to ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`} />
                </Link>
              )
            )}
          </div>

          {/* CTA */}
          <Link to="/contact"
            className="hidden md:inline-block btn-shine px-6 py-2.5 bg-gradient-to-r from-golden-400 to-golden-600 text-cream-100 font-cinzel text-sm tracking-wider rounded-full shadow-lg hover:shadow-golden-400/40 transition-all duration-300">
            Order Bulk
          </Link>

          {/* Hamburger */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-full glass text-golden-700">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center gap-8"
          style={{ background: 'linear-gradient(160deg,#fdf8ee,#f4e0c0,#ddb87a)' }}>
          <div className="absolute text-[30vw] text-golden-900/5 font-cinzel select-none pointer-events-none">ॐ</div>
          {navLinks.map((link, i) =>
            link.onClick ? (
              <button key={link.label} onClick={link.onClick}
                className="font-playfair text-3xl text-golden-800 hover:text-golden-600 transition-colors bg-transparent border-none cursor-pointer">
                {link.label}
              </button>
            ) : (
              <Link key={link.label} to={link.to}
                className="font-playfair text-3xl text-golden-800 hover:text-golden-600 transition-colors">
                {link.label}
              </Link>
            )
          )}
          <Link to="/contact" onClick={() => setOpen(false)}
            className="btn-shine mt-4 px-10 py-3 bg-gradient-to-r from-golden-500 to-golden-700 text-cream-100 font-cinzel tracking-wider rounded-full shadow-xl text-lg">
            Order Bulk
          </Link>
        </div>
      )}
    </>
  )
}
