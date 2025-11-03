import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { getApiUrl, getImageUrl } from '../config.js';
import CategoryManager from './CategoryManager.jsx';

function AdminDashboard({ admin, onLogout }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    images: [],
    stock: '',
    category: '',
    condition: 'new'
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(getApiUrl('/api/admin/products'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(getApiUrl('/api/admin/categories'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Upload all image files first
    const uploadedImages = [];
    
    for (const file of imageFiles) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        
        const uploadResponse = await fetch(getApiUrl('/api/admin/upload-image'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: formDataUpload
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          uploadedImages.push(uploadData.filename);
        } else {
          console.error('Image upload failed');
          return;
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        return;
      }
    }
    
    // Combine uploaded images with existing images and text input
    const allImages = [
      ...uploadedImages,
      ...(formData.images || []).filter(img => img),
      ...(formData.image ? [formData.image] : [])
    ].filter((img, index, self) => self.indexOf(img) === index); // Remove duplicates
    
    const url = editingProduct
      ? getApiUrl(`/api/admin/products/${editingProduct.id}`)
      : getApiUrl('/api/admin/products');

    try {
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ 
          product: {
            name: formData.name,
            description: formData.description,
            price: parseInt(formData.price) || formData.price,
            stock: formData.stock,
            category: formData.category || null,
            condition: formData.condition || 'new',
            images: allImages.length > 0 ? allImages : undefined,
            image: allImages.length > 0 ? allImages[0] : formData.image // First image for backward compatibility
          }
        })
      });

      if (response.ok) {
        await fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', image: '', images: [], stock: '', category: '', condition: 'new' });
        setImageFiles([]);
      }
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image || (product.images && product.images[0]) || '',
      images: product.images || [],
      stock: product.stock,
      category: product.category || '',
      condition: product.condition || 'new'
    });
    setImageFiles([]);
    setShowForm(true);
  };
  
  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(getApiUrl(`/api/admin/products/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (response.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    onLogout();
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    try {
      const response = await fetch(getApiUrl('/api/admin/change-password'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage('Contraseña cambiada exitosamente');
        setPasswordData({
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        });
        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordMessage('');
        }, 2000);
      } else {
        setPasswordMessage(data.error || data.errors?.join(', ') || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordMessage('Error al cambiar la contraseña');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <span>Welcome, {admin?.name}</span>
          <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="change-password-btn">
            Cambiar Contraseña
          </button>
        </div>
      </div>

      {showPasswordForm && (
        <div className="password-form">
          <h2>Cambiar Contraseña</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Contraseña Actual</label>
              <input
                type="password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                value={passwordData.new_password_confirmation}
                onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                required
                minLength={6}
              />
            </div>
            {passwordMessage && (
              <div className={passwordMessage.includes('exitosamente') ? 'success-message' : 'error-message'}>
                {passwordMessage}
              </div>
            )}
            <div className="form-actions">
              <button type="submit" className="save-button">Cambiar Contraseña</button>
              <button type="button" onClick={() => {
                setShowPasswordForm(false);
                setPasswordData({
                  current_password: '',
                  new_password: '',
                  new_password_confirmation: ''
                });
                setPasswordMessage('');
              }} className="cancel-button">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="dashboard-actions">
        <button onClick={() => { 
          setShowForm(!showForm); 
          setEditingProduct(null); 
          setFormData({ name: '', description: '', price: '', image: '', images: [], stock: '', category: '', condition: 'new' });
          setImageFiles([]);
        }} className="add-button">
          {showForm ? 'Cancelar' : 'Agregar Nuevo Producto'}
        </button>
        <button onClick={() => setShowCategoryManager(!showCategoryManager)} className="manage-categories-button">
          {showCategoryManager ? 'Hide Categories' : 'Manage Categories'}
        </button>
      </div>

      {showCategoryManager && (
        <CategoryManager 
          categories={categories} 
          onUpdate={() => {
            fetchCategories();
            fetchProducts(); // Refresh products in case category names changed
          }} 
        />
      )}

      {showForm && (
        <div className="product-form">
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price"
                min="0"
                step="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <textarea
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="category-select"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name_en}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="condition-select"
              >
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
            <div className="form-group">
              <label>Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
                className="file-input"
              />
              <input
                type="text"
                placeholder="O ingresa nombre del archivo de imagen"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              {formData.images && formData.images.length > 0 && (
                <div className="existing-images">
                  <p>Existing images:</p>
                  {formData.images.map((img, index) => (
                    <div key={index} className="image-item">
                      <span>{img}</span>
                      <button type="button" onClick={() => removeImage(index)}>Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-row">
              <input
                type="number"
                placeholder="Stock"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
              <button type="submit" className="save-button">Guardar Producto</button>
            </div>
          </form>
        </div>
      )}

      <div className="products-list">
        <h2>Products</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card-admin">
              <img src={getImageUrl(product.image)} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">₡{parseInt(product.price) || product.price}</p>
              <p className="stock">Stock: {product.stock}</p>
              <div className="product-actions">
                <button onClick={() => handleEdit(product)} className="edit-button">Editar</button>
                <button onClick={() => handleDelete(product.id)} className="delete-button">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
