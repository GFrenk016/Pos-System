import { useState, useEffect } from 'react'
import OrdiniContext from './OrdiniContext'

const API = 'http://localhost:3001/api/orders'

export default function OrdiniProvider({ children }) {
  const [ordini, setOrdini] = useState([])

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(setOrdini)
      .catch(console.error)
  }, [])

  async function inviaOrdine(items) {
    const res = await fetch(API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ items }),
    })
    const nuovoOrdine = await res.json()
    setOrdini(prev => [nuovoOrdine, ...prev])
  }

  async function segnaProntoCucina(id) {
    await fetch(`${API}/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status_cucina: 'done' }),
    })
    setOrdini(prev => prev.map(o => o.id === id ? { ...o, statusCucina: 'done' } : o))
  }

  async function segnaProintoBar(id) {
    await fetch(`${API}/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status_bar: 'done' }),
    })
    setOrdini(prev => prev.map(o => o.id === id ? { ...o, statusBar: 'done' } : o))
  }

  return (
    <OrdiniContext.Provider value={{ ordini, inviaOrdine, segnaProntoCucina, segnaProintoBar }}>
      {children}
    </OrdiniContext.Provider>
  )
}
