import { useState, useCallback, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useProdotti } from '../hooks/useProdotti'
import { useSocket } from '../hooks/useSocket'
import Scontrino from '../components/Scontrino'

const API = 'http://localhost:3001/api'

const CATEGORIE = ['Bar', 'Cucina']

const stileInput = {
  background: '#0f3460',
  border: '1px solid #1a4a8a',
  borderRadius: '8px',
  color: '#fff',
  padding: '0.5rem 0.75rem',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const stileBtn = (bg = '#e94560', extra = {}) => ({
  background: bg,
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontWeight: '700',
  fontSize: '0.85rem',
  padding: '0.45rem 0.9rem',
  cursor: 'pointer',
  ...extra,
})

// ──────────────────────────────────────────────────────────────
// Form aggiunta / modifica prodotto
// ──────────────────────────────────────────────────────────────
function FormProdotto({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 100px 120px 70px 1fr auto auto',
      gap: '0.5rem',
      alignItems: 'center',
      padding: '0.75rem',
      background: '#0f3460',
      borderRadius: '10px',
      marginBottom: '0.5rem',
    }}>
      <input style={stileInput} placeholder="Nome" value={form.nome}
        onChange={e => set('nome', e.target.value)} />
      <input style={stileInput} placeholder="Prezzo" type="number" step="0.01" value={form.prezzo}
        onChange={e => set('prezzo', e.target.value)} />
      <select style={stileInput} value={form.categoria} onChange={e => set('categoria', e.target.value)}>
        {CATEGORIE.map(c => <option key={c}>{c}</option>)}
      </select>
      <input style={stileInput} placeholder="Emoji" value={form.emoji}
        onChange={e => set('emoji', e.target.value)} />
      <input style={stileInput} placeholder="URL immagine (opzionale)" value={form.image_url || ''}
        onChange={e => set('image_url', e.target.value)} />
      <button style={stileBtn('#2ecc71')} disabled={loading}
        onClick={() => onSave(form)}>
        {loading ? '...' : '✓ Salva'}
      </button>
      <button style={stileBtn('#555')} onClick={onCancel}>✕</button>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// TAB 1 — Prodotti
// ──────────────────────────────────────────────────────────────
function TabProdotti() {
  const { prodotti, loading, aggiungiProdotto, modificaProdotto, eliminaProdotto } = useProdotti()
  const [showAdd,   setShowAdd]   = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving,    setSaving]    = useState(false)

  async function handleAggiungi(form) {
    if (!form.nome || !form.prezzo) return
    setSaving(true)
    await aggiungiProdotto(form)
    setShowAdd(false)
    setSaving(false)
  }

  async function handleModifica(id, form) {
    if (!form.nome || !form.prezzo) return
    setSaving(true)
    await modificaProdotto(id, form)
    setEditingId(null)
    setSaving(false)
  }

  async function handleElimina(id, nome) {
    if (!window.confirm(`Eliminare "${nome}"?`)) return
    await eliminaProdotto(id)
  }

  const categorieOrdinate = [...new Set(prodotti.map(p => p.categoria))].sort()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ color: '#aab', fontSize: '0.9rem' }}>{prodotti.length} prodotti</span>
        <button style={stileBtn('#e94560')} onClick={() => { setShowAdd(true); setEditingId(null) }}>
          + Aggiungi prodotto
        </button>
      </div>

      {showAdd && (
        <FormProdotto
          initial={{ nome: '', prezzo: '', categoria: 'Bar', emoji: '', image_url: '' }}
          onSave={handleAggiungi}
          onCancel={() => setShowAdd(false)}
          loading={saving}
        />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', color: '#556', padding: '2rem' }}>Caricamento...</div>
      ) : (
        categorieOrdinate.map(cat => (
          <div key={cat} style={{ marginBottom: '1.5rem' }}>
            <div style={{
              color: cat === 'Bar' ? '#3498db' : '#e67e22',
              fontWeight: '700',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem',
              paddingLeft: '0.25rem',
            }}>
              {cat === 'Bar' ? '☕' : '🍳'} {cat}
            </div>

            {prodotti.filter(p => p.categoria === cat).map(p =>
              editingId === p.id ? (
                <FormProdotto
                  key={p.id}
                  initial={{ nome: p.nome, prezzo: p.prezzo, categoria: p.categoria, emoji: p.emoji || '', image_url: p.image_url || '' }}
                  onSave={form => handleModifica(p.id, form)}
                  onCancel={() => setEditingId(null)}
                  loading={saving}
                />
              ) : (
                <div key={p.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.9rem',
                  background: '#16213e',
                  borderRadius: '10px',
                  marginBottom: '0.4rem',
                  border: '1px solid #1a4a8a22',
                }}>
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.nome}
                      style={{ width: 48, height: 48, borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ) : (
                    <span style={{ fontSize: '1.6rem', minWidth: '48px', textAlign: 'center', lineHeight: '48px' }}>
                      {p.emoji || '🍽'}
                    </span>
                  )}
                  <span style={{ color: '#fff', flex: 1, fontWeight: '600' }}>{p.nome}</span>
                  <span style={{ color: '#2ecc71', fontWeight: '700', minWidth: '60px', textAlign: 'right' }}>
                    €{Number(p.prezzo).toFixed(2)}
                  </span>
                  <button style={stileBtn('#0f3460')} onClick={() => { setEditingId(p.id); setShowAdd(false) }}>
                    ✏️ Modifica
                  </button>
                  <button style={stileBtn('#c0392b')} onClick={() => handleElimina(p.id, p.nome)}>
                    🗑 Elimina
                  </button>
                </div>
              )
            )}
          </div>
        ))
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// Riga singolo ordine con stampa
// ──────────────────────────────────────────────────────────────
function RigaOrdine({ o }) {
  const scontrinoRef = useRef(null)
  const handlePrint = useReactToPrint({
    contentRef: scontrinoRef,
    documentTitle: `Ordine-${o.id}`,
  })

  const tuttiDone = o.statusCucina === 'done' && o.statusBar === 'done'
  const hasCucina = o.itemsCucina?.length > 0
  const hasBar    = o.itemsBar?.length > 0
  let labelStato
  if (hasCucina && hasBar) {
    labelStato = tuttiDone
      ? 'Completato'
      : `Cucina: ${o.statusCucina === 'done' ? '✓' : '⏳'} | Bar: ${o.statusBar === 'done' ? '✓' : '⏳'}`
  } else if (hasCucina) {
    labelStato = o.statusCucina === 'done' ? 'Completato' : 'In attesa'
  } else if (hasBar) {
    labelStato = o.statusBar === 'done' ? 'Completato' : 'In attesa'
  } else {
    labelStato = '-'
  }

  return (
    <div style={{
      background: '#16213e',
      borderRadius: '10px',
      padding: '0.75rem 1rem',
      border: '1px solid #1a4a8a22',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
      position: 'relative',
    }}>
      <span style={{
        background: '#e94560',
        color: '#fff',
        fontWeight: '700',
        padding: '0.15rem 0.7rem',
        borderRadius: '20px',
        fontSize: '0.9rem',
        minWidth: '45px',
        textAlign: 'center',
      }}>
        #{o.id}
      </span>
      <span style={{ color: '#aab', fontSize: '0.85rem', minWidth: '50px' }}>{o.ora}</span>
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
        {o.items.map((item, i) => (
          <span key={i} style={{
            background: '#0f3460',
            color: '#fff',
            fontSize: '0.8rem',
            padding: '0.1rem 0.5rem',
            borderRadius: '6px',
          }}>
            {item.emoji} {item.nome} x{item.quantita}
          </span>
        ))}
      </div>
      <span style={{ color: '#2ecc71', fontWeight: '700', minWidth: '55px', textAlign: 'right' }}>
        €{Number(o.total).toFixed(2)}
      </span>
      <span style={{
        color: tuttiDone ? '#2ecc71' : '#e94560',
        fontSize: '0.8rem',
        fontWeight: '600',
        minWidth: '130px',
        textAlign: 'right',
      }}>
        {labelStato}
      </span>
      <button onClick={handlePrint} style={stileBtn('#0f3460')}>Ristampa</button>
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <Scontrino ref={scontrinoRef} ordine={o} />
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// TAB 2 — Storico ordini
// ──────────────────────────────────────────────────────────────
function toDateStr(date) {
  return date.toISOString().slice(0, 10)
}

function getRangeForPeriodo(p) {
  const oggi = new Date()
  if (p === 'settimana') {
    const lun = new Date(oggi)
    lun.setDate(oggi.getDate() - oggi.getDay() + (oggi.getDay() === 0 ? -6 : 1))
    return { from: toDateStr(lun), to: toDateStr(oggi) }
  }
  if (p === 'mese') {
    return { from: toDateStr(new Date(oggi.getFullYear(), oggi.getMonth(), 1)), to: toDateStr(oggi) }
  }
  return { from: toDateStr(oggi), to: toDateStr(oggi) }
}

function TabStorico() {
  const [ordini,   setOrdini]   = useState([])
  const [loading,  setLoading]  = useState(false)
  const [periodo,  setPeriodo]  = useState('oggi')
  const [dateFrom, setDateFrom] = useState(toDateStr(new Date()))
  const [dateTo,   setDateTo]   = useState(toDateStr(new Date()))

  const fetchOrdini = useCallback(async (p, from, to) => {
    setLoading(true)
    try {
      const url = p === 'oggi'
        ? `${API}/orders/today`
        : `${API}/orders/range?from=${from}&to=${to}`
      const res = await fetch(url)
      setOrdini(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  // Carica "oggi" al mount
  useState(() => { fetchOrdini('oggi') })

  function handlePeriodo(p) {
    setPeriodo(p)
    if (p !== 'personalizzato') {
      const { from, to } = getRangeForPeriodo(p)
      fetchOrdini(p, from, to)
    }
  }

  // Aggiornamento real-time: nuovo ordine aggiunto solo se filtro è "oggi"
  useSocket('storico_updated', useCallback((ordine) => {
    if (periodo === 'oggi') {
      setOrdini(prev => [ordine, ...prev.filter(o => o.id !== ordine.id)])
    }
  }, [periodo]))

  async function resetGiornaliero() {
    if (!window.confirm('Eliminare tutti gli ordini di oggi? Questa operazione è irreversibile.')) return
    await fetch(`${API}/orders/today`, { method: 'DELETE' })
    fetchOrdini('oggi')
  }

  const totale    = ordini.reduce((s, o) => s + o.total, 0)
  const numOrdini = ordini.length

  const periodi = [
    { id: 'oggi',           label: 'Oggi' },
    { id: 'settimana',      label: 'Settimana' },
    { id: 'mese',           label: 'Mese' },
    { id: 'personalizzato', label: 'Personalizzato' },
  ]

  return (
    <div>
      {/* Filtri periodo */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {periodi.map(({ id, label }) => (
          <button key={id} onClick={() => handlePeriodo(id)} style={{
            ...stileBtn(periodo === id ? '#e94560' : '#16213e'),
            border: periodo === id ? 'none' : '1px solid #1a4a8a',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Date picker per "personalizzato" */}
      {periodo === 'personalizzato' && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input type="date" style={{ ...stileInput, width: 'auto' }}
            value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span style={{ color: '#aab' }}>→</span>
          <input type="date" style={{ ...stileInput, width: 'auto' }}
            value={dateTo} onChange={e => setDateTo(e.target.value)} />
          <button style={stileBtn('#e94560')}
            onClick={() => fetchOrdini('personalizzato', dateFrom, dateTo)}>
            Cerca
          </button>
        </div>
      )}

      {/* Riepilogo periodo */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '0.75rem 1rem',
        background: '#16213e',
        borderRadius: '10px',
        border: '1px solid #1a4a8a33',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#aab', fontSize: '0.78rem' }}>Ordini</div>
            <div style={{ color: '#fff', fontWeight: '800', fontSize: '1.3rem' }}>{numOrdini}</div>
          </div>
          <div>
            <div style={{ color: '#aab', fontSize: '0.78rem' }}>Incasso</div>
            <div style={{ color: '#2ecc71', fontWeight: '800', fontSize: '1.3rem' }}>€{totale.toFixed(2)}</div>
          </div>
          {numOrdini > 0 && (
            <div>
              <div style={{ color: '#aab', fontSize: '0.78rem' }}>Scontrino medio</div>
              <div style={{ color: '#e94560', fontWeight: '700', fontSize: '1.1rem' }}>
                €{(totale / numOrdini).toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {periodo === 'oggi' && (
          <button style={stileBtn('#c0392b')} onClick={resetGiornaliero}>
            🗑 Reset giornaliero
          </button>
        )}
      </div>

      {/* Lista ordini */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#556', padding: '2rem' }}>Caricamento...</div>
      ) : ordini.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#556', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem' }}>📋</div>
          <p style={{ marginTop: '0.5rem' }}>Nessun ordine nel periodo selezionato</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {ordini.map(o => <RigaOrdine key={o.id} o={o} />)}
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// Root AdminPage — 2 tab: Prodotti + Storico
// ──────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('prodotti')

  const tabs = [
    { id: 'prodotti', label: '🛒 Prodotti' },
    { id: 'storico',  label: '📋 Storico ordini' },
  ]

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: '#0f0f23', padding: '1.5rem' }}>
      <h1 style={{ margin: '0 0 1.5rem', color: '#fff', fontSize: '1.4rem' }}>⚙️ Pannello Admin</h1>

      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #1a4a8a44',
        paddingBottom: '0.75rem',
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: activeTab === t.id ? '#e94560' : '#16213e',
              border: activeTab === t.id ? 'none' : '1px solid #1a4a8a',
              borderRadius: '10px',
              color: activeTab === t.id ? '#fff' : '#aab',
              fontWeight: '700',
              fontSize: '0.9rem',
              padding: '0.55rem 1.2rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'prodotti' && <TabProdotti />}
      {activeTab === 'storico'  && <TabStorico />}
    </div>
  )
}
