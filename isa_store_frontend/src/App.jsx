import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { AdminProvider, useAdmin } from './contexts/AdminContext.jsx'
import { CategoriesProvider } from './contexts/CategoriesContext.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Breadcrumb from './components/Breadcrumb'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import About from './components/About'
import Contact from './components/Contact'
import Shipping from './components/Shipping'
import Returns from './components/Returns'
import FAQ from './components/FAQ'
import Privacy from './components/Privacy'
import Terms from './components/Terms'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import './App.css'

// Lazy load admin routes — regular users don't need this code
const AdminLogin = lazy(() => import('./components/AdminLogin'))
const AdminDashboard = lazy(() => import('./components/AdminDashboard'))
const Orders = lazy(() => import('./components/Orders'))

function AppRoutes() {
  const { admin, login } = useAdmin()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="App">
      <Header />
      <Breadcrumb />
      <main className="main-content">
        {/* ProductList stays mounted always — hidden via CSS when not on home */}
        <div style={{ display: isHome ? '' : 'none' }}>
          <ProductList />
        </div>
        {!isHome && (
          <Suspense fallback={<div className="loading">...</div>}>
            <Routes>
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/orders"
                element={admin ? <Orders /> : <Navigate to="/" replace />}
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route
                path="/admin/login"
                element={admin ? <Navigate to="/admin" replace /> : <AdminLogin onLogin={login} />}
              />
              <Route
                path="/admin"
                element={admin ? <AdminDashboard /> : <Navigate to="/admin/login" replace />}
              />
            </Routes>
          </Suspense>
        )}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <AdminProvider>
          <CategoriesProvider>
            <Router>
              <AppRoutes />
            </Router>
          </CategoriesProvider>
        </AdminProvider>
      </ErrorBoundary>
    </LanguageProvider>
  )
}

export default App
