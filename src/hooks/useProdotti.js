import { useState, useEffect, useCallback } from 'react'

const API = 'http://localhost:3001/api/products'

export function useProdotti() {
  const [prodotti, setProdotti] = useState([])
  const [loading,  setLoading]  = useState(true)

  const fetchProdotti = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(API)
      setProdotti(await res.json())
    } catch (_) {
      // network error — keep previous state
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProdotti() }, [fetchProdotti])

  async function aggiungiProdotto(form) {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, prezzo: parseFloat(form.prezzo) }),
    })
    await fetchProdotti()
  }

  async function modificaProdotto(id, form) {
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, prezzo: parseFloat(form.prezzo) }),
    })
    await fetchProdotti()
  }

  async function eliminaProdotto(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    await fetchProdotti()
  }

  return { prodotti, loading, fetchProdotti, aggiungiProdotto, modificaProdotto, eliminaProdotto }
}
