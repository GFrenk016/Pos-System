import { useOrdini } from '../context/OrdiniContext'
import OrderCard from '../components/OrderCard'

export default function KDSPage() {
  const { ordini, segnaProntoCucina } = useOrdini()
  const ordiniConCucina = ordini.filter(o => o.itemsCucina.length > 0)
  const pending = ordiniConCucina.filter(o => o.statusCucina === 'pending')
  const completati = ordiniConCucina.filter(o => o.statusCucina === 'done')

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: '#0f0f23', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>🍳 Display Cucina</h1>
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

      {ordiniConCucina.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '5rem', color: '#556' }}>
          <div style={{ fontSize: '3rem' }}>🍽️</div>
          <p style={{ color: '#556', marginTop: '1rem' }}>Nessun ordine in arrivo</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {/* Prima i pending, poi i completati */}
        {[...pending, ...completati].map(ordine => (
          <OrderCard
            key={ordine.id}
            ordine={ordine}
            items={ordine.itemsCucina}
            status={ordine.statusCucina}
            onPronto={segnaProntoCucina}
            colore="#e67e22"
          />
        ))}
      </div>
    </div>
  )
}