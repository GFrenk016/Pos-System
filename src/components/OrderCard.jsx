import { CheckCircle, Clock } from 'lucide-react'

export default function OrderCard({ ordine, items, status, onPronto, colore }) {
    const isPronto = status === 'done'

    return (
        <div style={{
        background: isPronto ? '#1a2e1a' : '#16213e',
        border: `2px solid ${isPronto ? '#2ecc71' : colore}`,
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
            <span style={{
            color: '#aab',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
            }}>
            <Clock size={13} /> {ordine.ora}
            </span>
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