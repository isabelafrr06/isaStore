import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl } from '../config.js'
import ReviewForm from './ReviewForm'
import './Reviews.css'

function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch(getApiUrl('/api/reviews'))
      if (response.ok) {
        const data = await response.json()
        setReviews(Array.isArray(data) ? data : [])
      } else {
        setReviews([])
      }
      setLoading(false)
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setReviews([])
      setLoading(false)
    }
  }

  const handleReviewSubmitted = () => {
    fetchReviews()
    setShowForm(false)
  }

  if (loading) {
    return <div className="loading">{t('loadingReviews') || 'Loading reviews...'}</div>
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div className="reviews">
      <div className="reviews-header">
        <h2 className="page-title">{t('reviews') || 'Reviews'}</h2>
        {averageRating > 0 && (
          <div className="average-rating">
            <span className="rating-value">{averageRating}</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= averageRating ? 'star filled' : 'star'}>
                  ★
                </span>
              ))}
            </div>
            <span className="review-count">({reviews.length} {t('reviews') || 'reviews'})</span>
          </div>
        )}
        <button onClick={() => setShowForm(!showForm)} className="add-review-btn">
          {showForm ? t('cancel') || 'Cancel' : t('writeReview') || 'Write a Review'}
        </button>
      </div>

      {showForm && (
        <ReviewForm
          onSubmitted={handleReviewSubmitted}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>{t('noReviewsYet') || 'No reviews yet. Be the first to review!'}</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  {review.profile_picture_url ? (
                    <img 
                      src={review.profile_picture_url} 
                      alt={review.user_name}
                      className="reviewer-avatar"
                    />
                  ) : (
                    <div className="reviewer-avatar-placeholder">
                      {review.user_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="reviewer-details">
                    <h4 className="reviewer-name">
                      {review.user_name}
                      {review.verified && (
                        <span className="verified-badge" title={t('verifiedReview') || 'Verified Review'}>
                          ✓
                        </span>
                      )}
                    </h4>
                    <p className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="review-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={star <= review.rating ? 'star filled' : 'star'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="review-comment">{review.comment}</p>
              )}
              {review.provider && (
                <div className="review-provider">
                  <span className={`provider-badge provider-${review.provider}`}>
                    {review.provider === 'google' ? 'G' : 'F'}
                  </span>
                  {review.provider === 'google' ? 'Google' : 'Facebook'}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Reviews

