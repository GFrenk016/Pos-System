import { useState, useEffect } from 'react'

export function useProdotti() {
  const [prodotti, setProdotti] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(r => r.json())
      .then(data => { setProdotti(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return { prodotti, loading }
}
