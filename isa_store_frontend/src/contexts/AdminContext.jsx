import React, { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext()

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    const adminData = localStorage.getItem('admin')
    if (adminToken && adminData) {
      try {
        setAdmin(JSON.parse(adminData))
      } catch {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('admin')
      }
    }
  }, [])

  const login = (data) => {
    setAdmin(data.admin)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
    setAdmin(null)
  }

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}
