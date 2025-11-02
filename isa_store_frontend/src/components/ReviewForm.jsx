import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { getApiUrl } from '../config.js'
import './ReviewForm.css'

function ReviewForm({ onSubmitted, onCancel }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [provider, setProvider] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()
  const googleButtonRef = useRef(null)

  // Google OAuth callback
  const handleGoogleSuccess = useCallback(async (response) => {
    try {
      // Decode the credential (ID token)
      const payload = JSON.parse(atob(response.credential.split('.')[1]))
      
      setUserInfo({
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      })
      setProvider('google')
      
      // Store token for review submission
      localStorage.setItem('googleIdToken', response.credential)
    } catch (err) {
      console.error('Error processing Google response:', err)
      setError(t('errorGoogleAuth') || 'Error authenticating with Google')
    }
  }, [t])

  // Facebook OAuth callback
  const handleFacebookSuccess = useCallback((response) => {
    const name = response.name || 'Facebook User'
    const email = response.email || ''
    const picture = response.picture?.data?.url || response.picture || ''
    
    setUserInfo({
      name,
      email,
      picture
    })
    setProvider('facebook')
    
    // Store token for review submission (accessToken is already stored in handleFacebookLogin)
    if (response.userID || response.user_id) {
      localStorage.setItem('facebookUserId', response.userID || response.user_id)
    }
  }, [])

  const handleFacebookLogin = () => {
    if (window.FB) {
      window.FB.login((response) => {
        if (response.authResponse) {
          // Store access token
          localStorage.setItem('facebookToken', response.authResponse.accessToken)
          localStorage.setItem('facebookUserId', response.authResponse.userID)
          
          window.FB.api('/me?fields=name,email,picture', (userData) => {
            handleFacebookSuccess({
              ...response.authResponse,
              name: userData.name,
              email: userData.email || '',
              picture: userData.picture
            })
          })
        } else {
          handleFacebookError()
        }
      }, { scope: 'email' })
    }
  }

  const handleGoogleError = () => {
    setError(t('errorGoogleAuth') || 'Error authenticating with Google')
  }

  const handleFacebookError = () => {
    setError(t('errorFacebookAuth') || 'Error authenticating with Facebook')
  }

  useEffect(() => {
    // Initialize Google Sign In button
    const initGoogle = () => {
      if (window.google && !provider) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          callback: handleGoogleSuccess
        })

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            width: 250
          })
        }
      }
    }

    // Initialize Facebook SDK
    const initFacebook = () => {
      if (window.FB && !provider) {
        window.FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        })

        // Get login status
        window.FB.getLoginStatus((response) => {
          if (response.status === 'connected') {
            // User is already logged in
            localStorage.setItem('facebookToken', response.authResponse.accessToken)
            localStorage.setItem('facebookUserId', response.authResponse.userID)
            
            window.FB.api('/me?fields=name,email,picture', (userData) => {
              handleFacebookSuccess({
                ...response.authResponse,
                name: userData.name,
                email: userData.email || '',
                picture: userData.picture
              })
            })
          }
        })
      }
    }

    // Wait for scripts to load
    if (window.google) {
      initGoogle()
    } else {
      window.addEventListener('load', () => {
        setTimeout(initGoogle, 100)
      })
    }

    if (window.FB) {
      initFacebook()
    } else {
      window.addEventListener('load', () => {
        setTimeout(initFacebook, 100)
      })
    }
  }, [provider, handleGoogleSuccess, handleFacebookSuccess])


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!provider || !userInfo) {
      setError(t('pleaseAuthenticate') || 'Please authenticate with Google or Facebook first')
      return
    }

    if (rating === 0) {
      setError(t('pleaseSelectRating') || 'Please select a rating')
      return
    }

    setLoading(true)

    try {
      const token = provider === 'google' 
        ? localStorage.getItem('googleIdToken')
        : localStorage.getItem('facebookToken') || localStorage.getItem('facebookAccessToken')

      const response = await fetch(getApiUrl('/api/reviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          provider,
          oauth_token: token
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Clear stored tokens
        localStorage.removeItem('googleToken')
        localStorage.removeItem('googleIdToken')
        localStorage.removeItem('facebookToken')
        localStorage.removeItem('facebookUserId')
        
        onSubmitted()
      } else {
        setError(data.error || data.errors?.join(', ') || t('errorSubmittingReview') || 'Error submitting review')
      }
    } catch (err) {
      console.error('Error submitting review:', err)
      setError(t('errorSubmittingReview') || 'Error submitting review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="review-form-container">
      <h3>{t('writeReview') || 'Write a Review'}</h3>
      
      {!provider ? (
        <div className="oauth-buttons">
          <p className="auth-instruction">
            {t('authenticateToReview') || 'Please authenticate with Google or Facebook to write a review'}
          </p>
          
          {/* Google Sign In */}
          <div ref={googleButtonRef} id="google-signin-button"></div>
          
          {/* Facebook Sign In */}
          <button 
            type="button"
            onClick={handleFacebookLogin}
            className="facebook-login-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>{t('yourName') || 'Your Name'}</label>
            <input 
              type="text" 
              value={userInfo.name} 
              disabled 
              className="disabled-input"
            />
          </div>
          
          <div className="form-group">
            <label>{t('rating') || 'Rating'} *</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setRating(star)}
                  onMouseLeave={() => setRating(rating)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comment">{t('yourReview') || 'Your Review'}</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="5"
              placeholder={t('reviewPlaceholder') || 'Share your experience...'}
              maxLength={500}
            />
            <span className="char-count">{comment.length}/500</span>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? t('submitting') || 'Submitting...' : t('submitReview') || 'Submit Review'}
            </button>
            <button type="button" onClick={onCancel} className="cancel-btn">
              {t('cancel') || 'Cancel'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ReviewForm

