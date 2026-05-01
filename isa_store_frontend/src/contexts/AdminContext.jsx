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

const SESSION_FLAG = 'isastore_admin'

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_FLAG)) return
    fetch(getApiUrl('/api/admin/me'), { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.admin) setAdmin(data.admin)
        else sessionStorage.removeItem(SESSION_FLAG)
      })
      .catch(() => {})
  }, [])

  const login = (data) => {
    sessionStorage.setItem(SESSION_FLAG, '1')
    setAdmin(data.admin)
  }

  const logout = async () => {
    try {
      await fetch(getApiUrl('/api/admin/logout'), {
        method: 'POST',
        credentials: 'include'
      })
    } catch {}
    sessionStorage.removeItem(SESSION_FLAG)
    setAdmin(null)
  }

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}
