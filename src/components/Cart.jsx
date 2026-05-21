import { Trash2, ShoppingBag, SendHorizonal } from 'lucide-react'

export default function Cart({ items, onRemove, onInvia }) {
    const totale = items.reduce((acc, i) => acc + i.prezzo * i.quantita, 0)

    return (
        <div style={{
        width: '300px',
        borderLeft: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        background: '#1a1a2e',
        color: '#fff'
        }}>
        {/* Header carrello */}
        <div style={{
            padding: '1rem 1.2rem',
            borderBottom: '1px solid #16213e',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        }}>
            <ShoppingBag size={20} color="#e94560" />
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Ordine corrente</h2>
        </div>

        {/* Lista prodotti */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {items.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: '#556' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛒</div>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Nessun prodotto</p>
            </div>
            )}
            {items.map(item => (
            <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.6rem',
                padding: '0.6rem 0.8rem',
                background: '#16213e',
                borderRadius: '10px',
                border: '1px solid #0f3460'
            }}>
                <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#fff' }}>
                    {item.emoji} {item.nome}
                </div>
                <div style={{ color: '#aab', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    x{item.quantita} — <span style={{ color: '#e94560' }}>€{(item.prezzo * item.quantita).toFixed(2)}</span>
                </div>
                </div>
                <button
                onClick={() => onRemove(item.id)}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#e94560',
                    padding: '0.3rem'
                }}
                >
                <Trash2 size={16} />
                </button>
            </div>
            ))}
        </div>

        {/* Totale + bottone */}
        <div style={{ padding: '1rem', borderTop: '1px solid #16213e' }}>
            <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#fff'
            }}>
            <span>Totale</span>
            <span style={{ color: '#e94560' }}>€{totale.toFixed(2)}</span>
            </div>
            <button
            onClick={onInvia}
            disabled={items.length === 0}
            style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '12px',
                border: 'none',
                background: items.length === 0 ? '#333' : '#e94560',
                color: items.length === 0 ? '#666' : '#fff',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: items.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background 0.2s'
            }}
            >
            <SendHorizonal size={18} />
            Invia Ordine
            </button>
        </div>
        </div>
    )
}