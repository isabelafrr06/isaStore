import React, { useState, useEffect } from 'react'
import { getApiUrl, adminFetch } from '../config.js'
import { useLanguage } from '../contexts/useLanguage.js'
import './ServicePricingManager.css'

const EMPTY_FORM = { name_es: '', name_en: '', price: '', position: '', active: true }

function ServicePricingManager() {
  const { t } = useLanguage()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchRows() }, [])

  const fetchRows = async () => {
    try {
      const res = await adminFetch(getApiUrl('/api/admin/service-pricings'))
      if (res.ok) setRows(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ ...EMPTY_FORM, position: rows.length + 1 })
    setShowForm(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({ name_es: row.name_es, name_en: row.name_en, price: row.price, position: row.position, active: row.active })
    setShowForm(true)
  }

  const cancel = () => {
    setEditing(null)
    setShowForm(false)
    setForm(EMPTY_FORM)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editing
        ? getApiUrl(`/api/admin/service-pricings/${editing.id}`)
        : getApiUrl('/api/admin/service-pricings')
      const res = await adminFetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_pricing: form })
      })
      if (res.ok) {
        cancel()
        fetchRows()
      } else {
        const err = await res.json()
        alert(err.errors?.join(', ') || 'Error saving')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.name_en}"?`)) return
    try {
      const res = await adminFetch(getApiUrl(`/api/admin/service-pricings/${row.id}`), { method: 'DELETE' })
      if (res.ok) fetchRows()
    } catch (e) {
      console.error(e)
    }
  }

  const toggleActive = async (row) => {
    try {
      const res = await adminFetch(getApiUrl(`/api/admin/service-pricings/${row.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_pricing: { active: !row.active } })
      })
      if (res.ok) fetchRows()
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) return <div className="spm-loading">Loading…</div>

  return (
    <div className="spm">
      <div className="spm-header">
        <h3 className="spm-title">Service Pricing</h3>
        {!showForm && (
          <button className="spm-add-btn" onClick={openAdd}>+ Add service</button>
        )}
      </div>

      {showForm && (
        <form className="spm-form" onSubmit={handleSubmit}>
          <h4 className="spm-form-title">{editing ? 'Edit service' : 'Add service'}</h4>
          <div className="spm-form-grid">
            <div className="spm-field">
              <label>Name (ES) *</label>
              <input
                type="text"
                value={form.name_es}
                onChange={e => setForm({ ...form, name_es: e.target.value })}
                placeholder="Tienda en línea básica"
                required
              />
            </div>
            <div className="spm-field">
              <label>Name (EN) *</label>
              <input
                type="text"
                value={form.name_en}
                onChange={e => setForm({ ...form, name_en: e.target.value })}
                placeholder="Basic online store"
                required
              />
            </div>
            <div className="spm-field">
              <label>Price *</label>
              <input
                type="text"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                placeholder="₡300.000 – ₡600.000"
                required
              />
            </div>
            <div className="spm-field">
              <label>Position</label>
              <input
                type="number"
                min="1"
                value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })}
              />
            </div>
          </div>
          <label className="spm-checkbox">
            <input
              type="checkbox"
              checked={form.active}
              onChange={e => setForm({ ...form, active: e.target.checked })}
            />
            Active (visible on Services page)
          </label>
          <div className="spm-form-actions">
            <button type="submit" className="spm-save-btn" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
            <button type="button" className="spm-cancel-btn" onClick={cancel}>Cancel</button>
          </div>
        </form>
      )}

      <div className="spm-table-wrap">
        <table className="spm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Service (ES / EN)</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="5" className="spm-empty">No service pricings yet.</td></tr>
            ) : (
              rows.map(row => (
                <tr key={row.id} className={row.active ? '' : 'spm-row-inactive'}>
                  <td className="spm-pos">{row.position}</td>
                  <td className="spm-names">
                    <span className="spm-name-es">{row.name_es}</span>
                    <span className="spm-name-en">{row.name_en}</span>
                  </td>
                  <td className="spm-price">{row.price}</td>
                  <td>
                    <button
                      className={`spm-status-btn ${row.active ? 'active' : 'inactive'}`}
                      onClick={() => toggleActive(row)}
                    >
                      {row.active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="spm-actions">
                    <button className="spm-edit-btn" onClick={() => openEdit(row)}>Edit</button>
                    <button className="spm-delete-btn" onClick={() => handleDelete(row)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ServicePricingManager
