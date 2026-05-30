import { useState, useEffect, useCallback } from 'react'
import OrdiniContext from './OrdiniContext'
import { useSocket } from '../hooks/useSocket'

const API = 'http://localhost:3001/api/orders'

export default function OrdiniProvider({ children }) {
  const [ordini, setOrdini] = useState([])

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(setOrdini)
      .catch(console.error)
  }, [])

  const onNewOrder = useCallback(nuovoOrdine => {
    setOrdini(prev => {
      if (prev.some(o => o.id === nuovoOrdine.id)) return prev
      return [nuovoOrdine, ...prev]
    })
  }, [])

  const onOrderReady = useCallback(({ ordineId, tipo }) => {
    setOrdini(prev => prev.map(o => {
      if (o.id !== ordineId) return o
      return tipo === 'cucina'
        ? { ...o, statusCucina: 'done' }
        : { ...o, statusBar: 'done' }
    }))
  }, [])

  useSocket('new_order', onNewOrder)
  useSocket('order_ready', onOrderReady)

  async function inviaOrdine(items) {
    const res = await fetch(API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ items }),
    })
    return await res.json()
  }

  async function segnaProntoCucina(id) {
    await fetch(`${API}/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status_cucina: 'done' }),
    })
  }

  async function segnaProintoBar(id) {
    await fetch(`${API}/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status_bar: 'done' }),
    })
  }

  return (
    <OrdiniContext.Provider value={{ ordini, inviaOrdine, segnaProntoCucina, segnaProintoBar }}>
      {children}
    </OrdiniContext.Provider>
  )
}
