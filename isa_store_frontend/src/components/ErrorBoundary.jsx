import React from 'react'
import { useLanguage } from '../contexts/useLanguage.js'

class ErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'white',
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h2>{this.props.title}</h2>
          <p style={{ marginTop: '1rem', opacity: 0.8 }}>{this.props.message}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {this.props.reload}
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default function ErrorBoundary({ children }) {
  return (
    <ErrorBoundaryWrapper>
      {children}
    </ErrorBoundaryWrapper>
  )
}

function ErrorBoundaryWrapper({ children }) {
  let title = 'Algo salió mal'
  let message = 'Ocurrió un error inesperado. Por favor recarga la página.'
  let reload = 'Recargar Página'

  try {
    const { t } = useLanguage()
    title = t('errorBoundaryTitle') || title
    message = t('errorBoundaryMessage') || message
    reload = t('errorBoundaryReload') || reload
  } catch {
    // LanguageContext not available, use defaults
  }

  return (
    <ErrorBoundaryInner title={title} message={message} reload={reload}>
      {children}
    </ErrorBoundaryInner>
  )
}
