import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar  from './components/Navbar'
import Footer  from './components/Footer'
import Home    from './pages/Home'
import Products from './pages/Products'
import Contact  from './pages/Contact'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminQueries from './pages/admin/AdminQueries'
import AdminLayout from './components/admin/AdminLayout'

function AppContent() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
        <Route path="/admin/queries" element={<AdminLayout><AdminQueries /></AdminLayout>} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact"  element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

