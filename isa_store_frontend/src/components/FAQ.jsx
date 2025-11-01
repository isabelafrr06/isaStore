import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import './FAQ.css'

function FAQ() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    { question: t('faq1Question'), answer: t('faq1Answer') },
    { question: t('faq2Question'), answer: t('faq2Answer') },
    { question: t('faq3Question'), answer: t('faq3Answer') },
    { question: t('faq4Question'), answer: t('faq4Answer') },
    { question: t('faq5Question'), answer: t('faq5Answer') },
    { question: t('faq6Question'), answer: t('faq6Answer') }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="faq">
      <div className="faq-container">
        <h1 className="page-title">{t('faqTitle')}</h1>
        
        <div className="faq-content">
          <div className="faq-intro">
            <p>{t('faqDescription')}</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
                <button 
                  className="faq-question" 
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                </button>
                {openIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ

