import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import Header from './components/Header'
import Breadcrumb from './components/Breadcrumb'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Orders from './components/Orders'
import About from './components/About'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');
    if (adminToken && adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  const handleAdminLogin = (data) => {
    setAdmin(data.admin);
  };

  const handleAdminLogout = () => {
    setAdmin(null);
  };

  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Header admin={admin} onAdminLogout={handleAdminLogout} />
          <Breadcrumb admin={admin} onAdminLogout={handleAdminLogout} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route 
                path="/orders" 
                element={admin ? <Orders /> : <Navigate to="/" replace />} 
              />
              <Route path="/about" element={<About />} />
              <Route 
                path="/admin/login" 
                element={admin ? <Navigate to="/admin" replace /> : <AdminLogin onLogin={handleAdminLogin} />} 
              />
              <Route 
                path="/admin" 
                element={admin ? <AdminDashboard admin={admin} onLogout={handleAdminLogout} /> : <Navigate to="/admin/login" replace />} 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
