import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl, getImageUrl } from '../config.js'
import { formatPrice } from '../utils/formatPrice.js'
import './Orders.css'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    
    fetch(getApiUrl('/api/orders'), {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch orders')
        }
        return res.json()
      })
      .then(data => {
        // Ensure data is an array
        setOrders(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching orders:', err)
        setOrders([])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="loading">{t('loadingOrders')}</div>
  }

  return (
    <div className="orders">
      <h2 className="page-title">{t('myOrders')}</h2>
      
      {!Array.isArray(orders) || orders.length === 0 ? (
        <div className="no-orders">
          <p>{t('noOrdersYet')}</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>{t('order')} #{order.id}</h3>
                  <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className={`status status-${order.status}`}>{order.status}</span>
                  <p className="order-total">₡{formatPrice(parseInt(order.total) || order.total)}</p>
                </div>
              </div>
              
              <div className="order-items">
                {Array.isArray(order.items) && order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={getImageUrl(item.image)} alt={item.name} className="order-item-image" />
                    <div className="order-item-info">
                      <h4>{item.name}</h4>
                      <p>{t('quantity')}: {item.quantity}</p>
                    </div>
                    <span className="order-item-price">
                      ₡{formatPrice((parseInt(item.price) || item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders


