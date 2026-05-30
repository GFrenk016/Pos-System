import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import ProductGrid from '../components/ProductGrid'
import Cart from '../components/Cart'
import Scontrino from '../components/Scontrino'
import { useOrdini } from '../context/OrdiniContext'
import { useProdotti } from '../hooks/useProdotti'

export default function CassaPage() {
  const [carrello, setCarrello] = useState([])
  const [ordineCompletato, setOrdineCompletato] = useState(null)
  const { inviaOrdine } = useOrdini()
  const { prodotti } = useProdotti()
  const scontrinoRef = useRef(null)

  const handlePrint = useReactToPrint({
    contentRef: scontrinoRef,
    documentTitle: ordineCompletato ? `Ordine-${ordineCompletato.id}` : 'Scontrino',
  })

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

  async function handleInvia() {
    if (carrello.length === 0) return
    const ordine = await inviaOrdine(carrello)
    setOrdineCompletato(ordine)
  }

  function handleChiudi() {
    setCarrello([])
    setOrdineCompletato(null)
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

      {ordineCompletato && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '2rem',
            width: '340px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '2.5rem' }}>✓</div>
              <h2 style={{ margin: '0.25rem 0 0', color: '#1a1a2e', fontSize: '1.2rem' }}>
                Ordine #{ordineCompletato.id} inviato!
              </h2>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
              {ordineCompletato.items.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.25rem 0',
                  fontSize: '0.9rem',
                  color: '#333',
                }}>
                  <span>{item.nome} x{item.quantita}</span>
                  <span>€{(item.prezzo * item.quantita).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: '800',
              fontSize: '1.1rem',
              padding: '0.5rem 0',
              borderTop: '2px solid #1a1a2e',
              marginBottom: '1.5rem',
              color: '#1a1a2e',
            }}>
              <span>TOTALE</span>
              <span>€{Number(ordineCompletato.total).toFixed(2)}</span>
            </div>

            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
              <Scontrino ref={scontrinoRef} ordine={ordineCompletato} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handlePrint}
                style={{
                  flex: 1,
                  background: '#1a1a2e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Stampa Scontrino
              </button>
              <button
                onClick={handleChiudi}
                style={{
                  flex: 1,
                  background: '#e94560',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
