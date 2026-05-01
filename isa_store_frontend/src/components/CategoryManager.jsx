import React, { useState } from 'react';
import './CategoryManager.css';
import { getApiUrl } from '../config.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';

function CategoryManager({ categories, onUpdate }) {
  const { t } = useLanguage();
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    name_es: '',
    position: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingCategory
        ? getApiUrl(`/api/admin/categories/${editingCategory.id}`)
        : getApiUrl('/api/admin/categories');

      // Set position for new categories (use highest position + 1)
      const categoryData = { ...formData };
      if (!editingCategory) {
        const maxPosition = categories.length > 0 
          ? Math.max(...categories.map(cat => cat.position || 0))
          : -1;
        categoryData.position = maxPosition + 1;
      }

      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ category: categoryData })
      });

      if (response.ok) {
        setFormData({ name: '', name_en: '', name_es: '', position: 0 });
        setEditingCategory(null);
        setShowAddForm(false);
        onUpdate(); // Refresh categories
      } else {
        const errorData = await response.json().catch(() => ({ errors: ['Unknown error'] }));
        const errorMessage = errorData.errors ? 
          (Array.isArray(errorData.errors) ? errorData.errors.join(', ') : errorData.errors) :
          (errorData.error || 'Error saving category');
        alert(errorMessage);
        console.error('Category save error:', errorData);
      }
    } catch (err) {
      console.error('Error saving category:', err);
      alert(t('errorSavingCategory'));
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      name_en: category.name_en,
      name_es: category.name_es,
      position: category.position || 0
    });
    setShowAddForm(true);
  };

  const handleDelete = async (category) => {
    if (category.product_count > 0) {
      alert(t('cannotDeleteCategory', { name: category.name_en, count: category.product_count }));
      return;
    }

    if (!window.confirm(t('confirmDeleteCategory', { name: category.name_en }))) {
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/api/admin/categories/${category.id}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        onUpdate(); // Refresh categories
      } else {
        const error = await response.json();
        alert(error.error || t('errorDeletingCategory'));
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      alert(t('errorDeletingCategory'));
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setShowAddForm(false);
    setFormData({ name: '', name_en: '', name_es: '', position: 0 });
  };

  return (
    <div className="category-manager">
      <div className="category-manager-header">
        <h3>{t('categoryManagement')}</h3>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="add-category-btn">
            + {t('addCategory')}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="category-form">
          <h4>{editingCategory ? t('editCategory') : t('addNewCategory')}</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder={t('categoryIdPlaceholder')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={editingCategory !== null}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder={t('englishName')}
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder={t('spanishName')}
                value={formData.name_es}
                onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingCategory ? t('update') : t('create')}
              </button>
              <button type="button" onClick={cancelEdit} className="cancel-btn">
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="categories-list">
        <table className="categories-table">
          <thead>
            <tr>
              <th>{t('categoryId')}</th>
              <th>{t('englishName')}</th>
              <th>{t('spanishName')}</th>
              <th>{t('products')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td className="category-name">{category.name}</td>
                <td>{category.name_en}</td>
                <td>{category.name_es}</td>
                <td className="product-count">{category.product_count}</td>
                <td className="actions">
                  <button
                    onClick={() => handleEdit(category)}
                    className="edit-btn"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="delete-btn"
                    disabled={category.product_count > 0}
                  >
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoryManager;

