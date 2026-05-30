import { useState, useEffect } from 'react'
import { CheckCircle, Clock } from 'lucide-react'

function parseMinutesAgo(ora) {
  if (!ora) return 0
  const [h, m] = ora.split(':').map(Number)
  const now = new Date()
  const orderTime = new Date()
  orderTime.setHours(h, m, 0, 0)
  return Math.max(0, Math.floor((now - orderTime) / 60000))
}

export default function OrderCard({ ordine, items, status, onPronto, colore }) {
  const isPronto = status === 'done'
  const [minuti, setMinuti] = useState(() => parseMinutesAgo(ordine.ora))
  const isAlert = !isPronto && minuti > 10

  useEffect(() => {
    const interval = setInterval(() => {
      setMinuti(parseMinutesAgo(ordine.ora))
    }, 30000)
    return () => clearInterval(interval)
  }, [ordine.ora])

  return (
    <div style={{
      background: isPronto ? '#1a2e1a' : '#16213e',
      border: `2px solid ${isPronto ? '#2ecc71' : isAlert ? '#e74c3c' : colore}`,
      borderRadius: '14px',
      padding: '1rem',
      opacity: isPronto ? 0.6 : 1,
      transition: 'all 0.3s'
    }}>
      {/* Header card */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem'
      }}>
        <span style={{
          background: colore,
          color: '#fff',
          fontWeight: '700',
          fontSize: '1rem',
          padding: '0.2rem 0.8rem',
          borderRadius: '20px'
        }}>
          #{ordine.id}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            color: '#aab',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Clock size={13} /> {ordine.ora}
          </span>
          {!isPronto && (
            <span style={{
              color: isAlert ? '#e74c3c' : '#7a8a9a',
              fontSize: '0.75rem',
              fontWeight: isAlert ? '700' : '400',
              background: isAlert ? 'rgba(231,76,60,0.15)' : '#0f3460',
              padding: '0.1rem 0.5rem',
              borderRadius: '10px'
            }}>
              {minuti} min
            </span>
          )}
        </div>
      </div>

      {/* Lista prodotti */}
      <div style={{ marginBottom: '0.75rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.35rem 0',
            borderBottom: '1px solid #0f3460',
            color: '#fff',
            fontSize: '0.9rem'
          }}>
            <span>{item.emoji} {item.nome}</span>
            <span style={{
              background: '#0f3460',
              borderRadius: '20px',
              padding: '0 0.6rem',
              fontWeight: '700',
              color: colore
            }}>
              x{item.quantita}
            </span>
          </div>
        ))}
      </div>

      {/* Bottone pronto */}
      <button
        onClick={() => onPronto(ordine.id)}
        disabled={isPronto}
        style={{
          width: '100%',
          padding: '0.6rem',
          borderRadius: '10px',
          border: 'none',
          background: isPronto ? '#2ecc71' : colore,
          color: '#fff',
          fontWeight: '700',
          fontSize: '0.9rem',
          cursor: isPronto ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem'
        }}
      >
        <CheckCircle size={16} />
        {isPronto ? 'Completato' : 'Segna Pronto'}
      </button>
    </div>
  )
}
