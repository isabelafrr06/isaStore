import React, { useState, useEffect } from 'react';
import './DiscountManager.css';
import { getApiUrl } from '../config.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';

function DiscountManager({ onUpdate }) {
  const { t } = useLanguage();
  const [discountTiers, setDiscountTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTier, setEditingTier] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    min_quantity: '',
    discount_percent: '',
    active: true
  });

  useEffect(() => {
    fetchDiscountTiers();
  }, []);

  const fetchDiscountTiers = async () => {
    try {
      const response = await fetch(getApiUrl('/api/admin/discount-tiers'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDiscountTiers(data);
      }
    } catch (err) {
      console.error('Error fetching discount tiers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingTier
        ? getApiUrl(`/api/admin/discount-tiers/${editingTier.id}`)
        : getApiUrl('/api/admin/discount-tiers');

      const response = await fetch(url, {
        method: editingTier ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ discount_tier: formData })
      });

      if (response.ok) {
        setFormData({ min_quantity: '', discount_percent: '', active: true });
        setEditingTier(null);
        setShowAddForm(false);
        fetchDiscountTiers();
        if (onUpdate) onUpdate();
      } else {
        const error = await response.json();
        alert(error.errors?.join(', ') || 'Error saving discount tier');
      }
    } catch (err) {
      console.error('Error saving discount tier:', err);
      alert('Error saving discount tier');
    }
  };

  const handleEdit = (tier) => {
    setEditingTier(tier);
    setFormData({
      min_quantity: tier.min_quantity,
      discount_percent: tier.discount_percent,
      active: tier.active
    });
    setShowAddForm(true);
  };

  const handleDelete = async (tier) => {
    const confirmMessage = t('confirmDeleteDiscountTier')
      .replace('{quantity}', tier.min_quantity)
      .replace('{percent}', tier.discount_percent)
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/api/admin/discount-tiers/${tier.id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        fetchDiscountTiers();
        if (onUpdate) onUpdate();
      } else {
        const error = await response.json();
        alert(error.error || 'Error deleting discount tier');
      }
    } catch (err) {
      console.error('Error deleting discount tier:', err);
      alert('Error deleting discount tier');
    }
  };

  const toggleActive = async (tier) => {
    try {
      const response = await fetch(getApiUrl(`/api/admin/discount-tiers/${tier.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ discount_tier: { ...tier, active: !tier.active } })
      });

      if (response.ok) {
        fetchDiscountTiers();
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error('Error toggling discount tier:', err);
    }
  };

  const cancelEdit = () => {
    setEditingTier(null);
    setShowAddForm(false);
    setFormData({ min_quantity: '', discount_percent: '', active: true });
  };

  if (loading) {
    return <div className="loading">{t('loadingDiscounts')}</div>;
  }

  // Sort tiers by min_quantity descending
  const sortedTiers = [...discountTiers].sort((a, b) => b.min_quantity - a.min_quantity);

  return (
    <div className="discount-manager">
      <div className="discount-manager-header">
        <h3>{t('discountManager')}</h3>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="add-discount-btn">
            + {t('addDiscountTier')}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="discount-form">
          <h4>{editingTier ? t('editDiscountTier') : t('addDiscountTier')}</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('minQuantity')} *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="3"
                  value={formData.min_quantity}
                  onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('discountPercent')} (%) *</label>
                <input
                  type="number"
                  min="0.01"
                  max="100"
                  step="0.01"
                  placeholder="5.00"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                {t('active')}
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingTier ? t('update') : t('create')}
              </button>
              <button type="button" onClick={cancelEdit} className="cancel-btn">
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="discount-tiers-list">
        <table className="discount-tiers-table">
          <thead>
            <tr>
              <th>{t('minQuantity')}</th>
              <th>{t('discountPercent')}</th>
              <th>{t('status')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedTiers.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-tiers">{t('noDiscountTiers')}</td>
              </tr>
            ) : (
              sortedTiers.map(tier => (
                <tr key={tier.id} className={!tier.active ? 'inactive' : ''}>
                  <td className="min-quantity">{tier.min_quantity}+ {t('items')}</td>
                  <td className="discount-percent">{tier.discount_percent}%</td>
                  <td>
                    <button
                      onClick={() => toggleActive(tier)}
                      className={`status-btn ${tier.active ? 'active' : 'inactive'}`}
                    >
                      {tier.active ? t('active') : t('inactive')}
                    </button>
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => handleEdit(tier)}
                      className="edit-btn"
                    >
                      {t('edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(tier)}
                      className="delete-btn"
                    >
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DiscountManager;

