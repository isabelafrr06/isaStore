import React, { useState } from 'react';
import './CategoryManager.css';
import { getApiUrl } from '../config.js';

function CategoryManager({ categories, onUpdate }) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    name_es: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingCategory
        ? getApiUrl(`/api/admin/categories/${editingCategory.id}`)
        : getApiUrl('/api/admin/categories');

      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ category: formData })
      });

      if (response.ok) {
        setFormData({ name: '', name_en: '', name_es: '' });
        setEditingCategory(null);
        setShowAddForm(false);
        onUpdate(); // Refresh categories
      } else {
        const error = await response.json();
        alert(error.errors?.join(', ') || 'Error saving category');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Error saving category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      name_en: category.name_en,
      name_es: category.name_es
    });
    setShowAddForm(true);
  };

  const handleDelete = async (category) => {
    if (category.product_count > 0) {
      alert(`Cannot delete "${category.name_en}" because it has ${category.product_count} product(s). Please reassign or delete the products first.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${category.name_en}"?`)) {
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/api/admin/categories/${category.id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        onUpdate(); // Refresh categories
      } else {
        const error = await response.json();
        alert(error.error || 'Error deleting category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Error deleting category');
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setShowAddForm(false);
    setFormData({ name: '', name_en: '', name_es: '' });
  };

  return (
    <div className="category-manager">
      <div className="category-manager-header">
        <h3>Category Management</h3>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="add-category-btn">
            + Add Category
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="category-form">
          <h4>{editingCategory ? 'Edit Category' : 'Add New Category'}</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Category ID (e.g., Laptops)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={editingCategory !== null}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="English Name"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Spanish Name"
                value={formData.name_es}
                onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingCategory ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={cancelEdit} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="categories-list">
        <table className="categories-table">
          <thead>
            <tr>
              <th>Category ID</th>
              <th>English Name</th>
              <th>Spanish Name</th>
              <th>Products</th>
              <th>Actions</th>
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
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(category)} 
                    className="delete-btn"
                    disabled={category.product_count > 0}
                  >
                    Delete
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

