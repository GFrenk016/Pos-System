import { useState } from 'react'
import ProductGrid from '../components/ProductGrid'
import Cart from '../components/Cart'
import { useOrdini } from '../context/OrdiniContext'
import { useProdotti } from '../hooks/useProdotti'

export default function CassaPage() {
    const [carrello, setCarrello] = useState([])
    const [ordineSent, setOrdineSent] = useState(false)
    const { inviaOrdine } = useOrdini()
    const { prodotti } = useProdotti()

    function handleAdd(prodotto) {
        setCarrello(prev => {
        const esistente = prev.find(i => i.id === prodotto.id)
        if (esistente) {
            return prev.map(i => i.id === prodotto.id
            ? { ...i, quantita: i.quantita + 1 }
            : i
        )
        }
        return [...prev, { ...prodotto, quantita: 1 }]
        })
    }

    function handleRemove(id) {
        setCarrello(prev => prev.filter(i => i.id !== id))
    }

    function handleInvia() {
        if (carrello.length === 0) return
        inviaOrdine(carrello)
        setOrdineSent(true)
        setTimeout(() => {
        setCarrello([])
        setOrdineSent(false)
        }, 1500)
    }

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 52px)', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}>
            <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#1a1a2e' }}>🧾 Cassa</h1>
            <span style={{
                color: '#fff',
                background: '#1a1a2e',
                padding: '0.3rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600'
            }}>
                {new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
            </span>
            </div>
            <ProductGrid prodotti={prodotti} onAdd={handleAdd} />
        </div>
        <Cart items={carrello} onRemove={handleRemove} onInvia={handleInvia} />
        {ordineSent && (
            <div style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#2ecc71',
            color: '#fff',
            padding: '0.8rem 2rem',
            borderRadius: '30px',
            fontWeight: '700',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
            ✓ Ordine inviato!
            </div>
        )}
        </div>
    )
}