import { useState, useEffect } from 'react'

const CACHE_KEY = 'usd_crc_rate'
const CACHE_TTL = 24 * 60 * 60 * 1000

function getCached() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY))
    if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.rate
  } catch {}
  return null
}

export function useExchangeRate() {
  const [rate, setRate] = useState(getCached)

  useEffect(() => {
    if (getCached()) return

    fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json')
      .then(r => r.json())
      .then(data => {
        const rate = data.usd.crc
        setRate(rate)
        localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, ts: Date.now() }))
      })
      .catch(() => {})
  }, [])

  return rate
}
