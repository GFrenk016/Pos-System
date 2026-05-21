import { PRODOTTI } from '../data/prodotti'

const COLORI_CATEGORIA = {
    'Bar':    { bg: '#fff3e0', border: '#ff9800', testo: '#e65100' },
    'Cucina': { bg: '#e8f5e9', border: '#4caf50', testo: '#1b5e20' },
}

const COLORE_DEFAULT = { bg: '#f3e5f5', border: '#9c27b0', testo: '#4a148c' }

export default function ProductGrid({ onAdd }) {
    const categorie = [...new Set(PRODOTTI.map(p => p.categoria))]

    return (
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', background: '#f8f9fa' }}>
        {categorie.map(cat => {
            const colore = COLORI_CATEGORIA[cat] || COLORE_DEFAULT
            return (
            <div key={cat} style={{ marginBottom: '2rem' }}>
                <h3 style={{
                marginBottom: '0.75rem',
                color: '#fff',
                background: colore.border,
                display: 'inline-block',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '700',
                letterSpacing: '0.05em'
                }}>
                {cat.toUpperCase()}
                </h3>
                <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '0.75rem'
                }}>
                {PRODOTTI.filter(p => p.categoria === cat).map(prod => (
                    <button
                    key={prod.id}
                    onClick={() => onAdd(prod)}
                    style={{
                        padding: '1rem 0.5rem',
                        borderRadius: '12px',
                        border: `2px solid ${colore.border}`,
                        background: colore.bg,
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        color: colore.testo,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                        transition: 'transform 0.1s, box-shadow 0.1s'
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>
                        {prod.emoji}
                    </div>
                    <div>{prod.nome}</div>
                    <div style={{
                        marginTop: '0.4rem',
                        background: colore.border,
                        color: '#fff',
                        borderRadius: '20px',
                        padding: '0.1rem 0.6rem',
                        fontSize: '0.85rem',
                        display: 'inline-block'
                    }}>
                        €{prod.prezzo.toFixed(2)}
                    </div>
                    </button>
                ))}
                </div>
            </div>
            )
        })}
        </div>
    )
}