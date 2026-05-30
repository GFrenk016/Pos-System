import { useCallback } from 'react'
import { useOrdini } from '../context/OrdiniContext'
import OrderCard from '../components/OrderCard'
import socket, { useSocket } from '../hooks/useSocket'
import { playBeep } from '../utils/sound'

export default function BarPage() {
  const { ordini, segnaProintoBar } = useOrdini()
  const ordiniConBar = ordini.filter(o => o.itemsBar.length > 0)
  const pending = ordiniConBar.filter(o => o.statusBar === 'pending')
  const completati = ordiniConBar.filter(o => o.statusBar === 'done')

  useSocket('new_order', useCallback((ordine) => {
    if (ordine.itemsBar && ordine.itemsBar.length > 0) {
      playBeep()
    }
  }, []))

  async function handlePronto(id) {
    await segnaProintoBar(id)
    socket.emit('order_ready', { ordineId: id, tipo: 'bar' })
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: '#0f0f23', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>☕ Display Bar</h1>
        <span style={{
          background: pending.length > 0 ? '#e94560' : '#2ecc71',
          color: '#fff',
          padding: '0.3rem 1rem',
          borderRadius: '20px',
          fontWeight: '700',
          fontSize: '0.85rem'
        }}>
          {pending.length} in attesa
        </span>
      </div>

      {ordiniConBar.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '5rem', color: '#556' }}>
          <div style={{ fontSize: '3rem' }}>☕</div>
          <p style={{ color: '#556', marginTop: '1rem' }}>Nessun ordine in arrivo</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {[...pending, ...completati].map(ordine => (
          <OrderCard
            key={ordine.id}
            ordine={ordine}
            items={ordine.itemsBar}
            status={ordine.statusBar}
            onPronto={handlePronto}
            colore="#3498db"
          />
        ))}
      </div>
    </div>
  )
}
