import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Phone, ArrowRight, X, AlertCircle, LoaderCircle } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'

function ProductCard({ product, index }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div
      className="card-hover glass rounded-2xl overflow-hidden border border-golden-200/50 group"
      style={{ animation: `fadeUp .45s ease ${Math.min(index * 0.04, 0.3)}s both` }}
    >
      <div className="relative h-80 flex items-center justify-center overflow-hidden" style={{ background: product.bg, fontSize: '5rem' }}>
        {product.image && !imageFailed ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain px-4 py-0 group-hover:scale-[1.05] transition-transform duration-500"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="group-hover:scale-110 transition-transform duration-500">{product.emoji}</span>
        )}
        {product.tag && <span className="tag-badge absolute top-3 right-3">{product.tag}</span>}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3 gap-4">
          <div>
            <div className="font-cormorant text-golden-500 text-xs tracking-widest uppercase">{product.category}</div>
            <h3 className="font-playfair text-golden-900 text-xl font-semibold mt-0.5">{product.name}</h3>
          </div>
          <div className="text-right shrink-0">
            <div className="font-cinzel text-golden-700 font-bold text-xl">{product.price}</div>
            <div className="font-cormorant text-golden-500 text-xs">per unit</div>
          </div>
        </div>
        <p className="font-cormorant text-golden-700 text-base leading-relaxed mb-4">{product.description}</p>
        <div className="flex gap-3">
          <Link to="/contact" className="btn-shine flex-1 py-2.5 bg-gradient-to-r from-golden-400 to-golden-600 text-cream-100 font-cormorant text-base rounded-xl hover:shadow-lg transition-all text-center">
            Order Bulk
          </Link>
          <a href="tel:+918431119696" className="px-4 py-2.5 glass border border-golden-400/40 text-golden-700 rounded-xl hover:bg-golden-100/50 transition-all flex items-center gap-1 font-cormorant text-base">
            <Phone size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Products() {
  const [selectedCat, setSelectedCat] = useState('All')
  const [search, setSearch] = useState('')
  const { products, categories, loading, error } = useProducts()

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = selectedCat === 'All' || product.category === selectedCat
        const query = search.trim().toLowerCase()
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)

        return matchesCategory && matchesSearch
      }),
    [products, search, selectedCat],
  )

  return (
    <main className="pt-24 pb-20 min-h-screen" style={{ background: 'linear-gradient(180deg,#fdf8ee,#f4e0c0 40%,#fdf8ee)' }}>
      <section className="relative py-16 sm:py-20 overflow-hidden text-center" style={{ background: 'linear-gradient(135deg,#7d502a,#c9965a,#ddb87a)' }}>
        <div className="absolute font-cinzel text-golden-900/5 select-none pointer-events-none" style={{ fontSize: '20vw', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>ॐ</div>
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream-200/25 mb-5">
            <span className="font-cormorant text-cream-200 text-sm tracking-widest uppercase">Sacred Collection</span>
          </div>
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-cream-100 mb-4">Our Products</h1>
          <p className="font-cormorant text-cream-200 text-xl sm:text-2xl">Premium pooja essentials at wholesale prices.</p>
        </div>
      </section>

      <div className="sticky top-20 z-30 py-3 border-b border-golden-200/40 shadow-sm" style={{ background: 'rgba(253,248,238,.92)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-golden-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-8 py-2.5 glass rounded-full border border-golden-300/40 font-cormorant text-golden-800 text-base placeholder:text-golden-400 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-golden-400 hover:text-golden-600 bg-transparent border-none cursor-pointer">
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCat(category)}
                className={`px-4 py-1.5 rounded-full font-cormorant text-sm tracking-wide transition-all duration-300 border cursor-pointer ${selectedCat === category ? 'bg-golden-500 text-cream-100 border-golden-500 shadow-lg' : 'glass border-golden-300/40 text-golden-700 hover:bg-golden-100/50'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="mb-6 glass border border-amber-300/50 rounded-2xl px-4 py-3 text-amber-900 font-cormorant flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="font-cormorant text-golden-600 mb-6 text-base">
          Showing <strong className="text-golden-800">{filtered.length}</strong> products
          {selectedCat !== 'All' && <> in <strong className="text-golden-800">{selectedCat}</strong></>}
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4 text-golden-700">
            <LoaderCircle size={36} className="animate-spin" />
            <p className="font-cormorant text-xl">Loading product catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-playfair text-golden-800 text-2xl mb-2">No products found</h3>
            <button onClick={() => { setSearch(''); setSelectedCat('All') }} className="mt-4 px-8 py-3 bg-golden-500 text-cream-100 font-cormorant rounded-full cursor-pointer border-none text-base">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
          </div>
        )}
      </div>

      <section className="py-14 mt-8 text-center" style={{ background: 'linear-gradient(135deg,#c9965a,#ddb87a)' }}>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-cream-100 mb-4">Need Custom or Bulk Orders?</h2>
        <p className="font-cormorant text-cream-100 text-xl mb-8">Special rates for large volumes. Custom packaging available.</p>
        <Link to="/contact" className="btn-shine inline-flex items-center gap-3 px-10 py-4 bg-cream-100 text-golden-800 font-cinzel tracking-wider rounded-full shadow-xl hover:bg-white transition-all">
          Get Custom Quote <ArrowRight size={16} />
        </Link>
      </section>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}
