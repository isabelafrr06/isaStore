import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ admin, onLogout }) {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/products', {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let imagePath = formData.image;
    
    // Upload image if a new file is selected
    if (imageFile) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);
        
        const uploadResponse = await fetch('http://localhost:3001/api/admin/upload-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: formDataUpload
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imagePath = uploadData.filename;
        } else {
          console.error('Image upload failed');
          return;
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        return;
      }
    }
    
    const url = editingProduct
      ? `http://localhost:3001/api/admin/products/${editingProduct.id}`
      : 'http://localhost:3001/api/admin/products';

    try {
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ 
          product: {
            ...formData,
            image: imagePath
          }
        })
      });

      if (response.ok) {
        await fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', image: '', stock: '' });
        setImageFile(null);
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
      image: product.image,
      stock: product.stock
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/admin/products/${id}`, {
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

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <span>Welcome, {admin?.name}</span>
        </div>
      </div>

      <div className="dashboard-actions">
        <button onClick={() => { setShowForm(!showForm); setEditingProduct(null); }} className="add-button">
          {showForm ? 'Cancelar' : 'Agregar Nuevo Producto'}
        </button>
      </div>

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
                step="0.01"
                placeholder="Price"
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
            <div className="form-row">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="file-input"
              />
              <input
                type="text"
                placeholder="O ingresa nombre del archivo de imagen"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
            <div className="form-row">
              <input
                type="number"
                placeholder="Stock"
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
              <img src={`http://localhost:3001/images/${product.image}`} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">₡{product.price}</p>
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
