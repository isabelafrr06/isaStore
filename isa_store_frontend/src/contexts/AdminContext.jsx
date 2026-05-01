import React, { createContext, useContext, useState, useEffect } from 'react'
import { getApiUrl } from '../config.js'

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
    fetch(getApiUrl('/api/admin/me'), { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.admin) setAdmin(data.admin) })
      .catch(() => {})
  }, [])

  const login = (data) => {
    setAdmin(data.admin)
  }

  const logout = async () => {
    try {
      await fetch(getApiUrl('/api/admin/logout'), {
        method: 'POST',
        credentials: 'include'
      })
    } catch {}
    setAdmin(null)
  }

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}
