import { useState, useEffect, useCallback } from 'react'

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

function FormProdotto({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 100px 120px 80px auto auto',
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
      <button style={stileBtn('#2ecc71')} disabled={loading}
        onClick={() => onSave(form)}>
        {loading ? '...' : '✓ Salva'}
      </button>
      <button style={stileBtn('#555')} onClick={onCancel}>✕</button>
    </div>
  )
}

function TabProdotti() {
  const [prodotti, setProdotti] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchProdotti = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`${API}/products`)
    setProdotti(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchProdotti() }, [fetchProdotti])

  async function aggiungi(form) {
    if (!form.nome || !form.prezzo) return
    setSaving(true)
    await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, prezzo: parseFloat(form.prezzo) }),
    })
    setShowAdd(false)
    setSaving(false)
    fetchProdotti()
  }

  async function modifica(id, form) {
    if (!form.nome || !form.prezzo) return
    setSaving(true)
    await fetch(`${API}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, prezzo: parseFloat(form.prezzo) }),
    })
    setEditingId(null)
    setSaving(false)
    fetchProdotti()
  }

  async function elimina(id, nome) {
    if (!window.confirm(`Eliminare "${nome}"?`)) return
    await fetch(`${API}/products/${id}`, { method: 'DELETE' })
    fetchProdotti()
  }

  const categorieOrdinate = [...new Set(prodotti.map(p => p.categoria))].sort()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ color: '#aab', fontSize: '0.9rem' }}>
          {prodotti.length} prodotti
        </span>
        <button style={stileBtn('#e94560')} onClick={() => { setShowAdd(true); setEditingId(null) }}>
          + Aggiungi prodotto
        </button>
      </div>

      {showAdd && (
        <FormProdotto
          initial={{ nome: '', prezzo: '', categoria: 'Bar', emoji: '' }}
          onSave={aggiungi}
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
            {prodotti.filter(p => p.categoria === cat).map(p => (
              editingId === p.id ? (
                <FormProdotto
                  key={p.id}
                  initial={{ nome: p.nome, prezzo: p.prezzo, categoria: p.categoria, emoji: p.emoji }}
                  onSave={form => modifica(p.id, form)}
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
                  <span style={{ fontSize: '1.3rem', minWidth: '2rem', textAlign: 'center' }}>{p.emoji}</span>
                  <span style={{ color: '#fff', flex: 1, fontWeight: '600' }}>{p.nome}</span>
                  <span style={{ color: '#2ecc71', fontWeight: '700', minWidth: '60px', textAlign: 'right' }}>
                    €{Number(p.prezzo).toFixed(2)}
                  </span>
                  <button style={stileBtn('#0f3460')} onClick={() => { setEditingId(p.id); setShowAdd(false) }}>
                    ✏️ Modifica
                  </button>
                  <button style={stileBtn('#c0392b')} onClick={() => elimina(p.id, p.nome)}>
                    🗑 Elimina
                  </button>
                </div>
              )
            ))}
          </div>
        ))
      )}
    </div>
  )
}

function TabStorico() {
  const [ordini, setOrdini] = useState([])
  const [loading, setLoading] = useState(false)
  const [filtro, setFiltro] = useState('tutti')

  const fetchOrdini = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`${API}/orders/today`)
    setOrdini(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrdini() }, [fetchOrdini])

  async function resetGiornaliero() {
    if (!window.confirm('Eliminare tutti gli ordini di oggi? Questa operazione è irreversibile.')) return
    await fetch(`${API}/orders/today`, { method: 'DELETE' })
    fetchOrdini()
  }

  const ordiniFiltrati = ordini.filter(o => {
    if (filtro === 'attesa') return o.statusCucina === 'pending' || o.statusBar === 'pending'
    if (filtro === 'completati') return o.statusCucina === 'done' && o.statusBar === 'done'
    return true
  })

  const coloreStato = (o) => {
    const tuttiDone = o.statusCucina === 'done' && o.statusBar === 'done'
    return tuttiDone ? '#2ecc71' : '#e94560'
  }

  const labelStato = (o) => {
    const hasCucina = o.itemsCucina.length > 0
    const hasBar = o.itemsBar.length > 0
    if (hasCucina && hasBar) {
      if (o.statusCucina === 'done' && o.statusBar === 'done') return 'Completato'
      return `Cucina: ${o.statusCucina === 'done' ? '✓' : '⏳'} | Bar: ${o.statusBar === 'done' ? '✓' : '⏳'}`
    }
    if (hasCucina) return o.statusCucina === 'done' ? 'Completato' : 'In attesa'
    if (hasBar) return o.statusBar === 'done' ? 'Completato' : 'In attesa'
    return '-'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[['tutti', 'Tutti'], ['attesa', 'In attesa'], ['completati', 'Completati']].map(([v, l]) => (
            <button key={v} onClick={() => setFiltro(v)} style={{
              ...stileBtn(filtro === v ? '#e94560' : '#16213e'),
              border: filtro === v ? 'none' : '1px solid #1a4a8a',
            }}>
              {l}
            </button>
          ))}
        </div>
        <button style={stileBtn('#c0392b')} onClick={resetGiornaliero}>
          🗑 Reset giornaliero
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#556', padding: '2rem' }}>Caricamento...</div>
      ) : ordiniFiltrati.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#556', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem' }}>📋</div>
          <p style={{ marginTop: '0.5rem' }}>Nessun ordine</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {ordiniFiltrati.map(o => (
            <div key={o.id} style={{
              background: '#16213e',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              border: '1px solid #1a4a8a22',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
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
                color: coloreStato(o),
                fontSize: '0.8rem',
                fontWeight: '600',
                minWidth: '100px',
                textAlign: 'right',
              }}>
                {labelStato(o)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TabIncasso() {
  const [ordini, setOrdini] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchOrdini = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`${API}/orders/today`)
    setOrdini(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrdini() }, [fetchOrdini])

  const totale = ordini.reduce((s, o) => s + o.total, 0)
  const totaleBar = ordini.reduce((s, o) =>
    s + o.itemsBar.reduce((ss, i) => ss + i.prezzo * i.quantita, 0), 0)
  const totaleCucina = ordini.reduce((s, o) =>
    s + o.itemsCucina.reduce((ss, i) => ss + i.prezzo * i.quantita, 0), 0)

  const card = (label, valore, colore, icona) => (
    <div style={{
      background: '#16213e',
      borderRadius: '14px',
      padding: '1.5rem',
      border: `2px solid ${colore}33`,
      flex: 1,
      minWidth: '180px',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icona}</div>
      <div style={{ color: '#aab', fontSize: '0.85rem', marginBottom: '0.3rem' }}>{label}</div>
      <div style={{ color: colore, fontSize: '1.8rem', fontWeight: '800' }}>
        {loading ? '...' : `€${valore.toFixed(2)}`}
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {card('Incasso totale', totale, '#e94560', '💰')}
        {card('Incasso Bar', totaleBar, '#3498db', '☕')}
        {card('Incasso Cucina', totaleCucina, '#e67e22', '🍳')}
      </div>

      <div style={{
        background: '#16213e',
        borderRadius: '14px',
        padding: '1.25rem',
        border: '1px solid #1a4a8a33',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
      }}>
        <div style={{ fontSize: '2.5rem' }}>📊</div>
        <div>
          <div style={{ color: '#aab', fontSize: '0.85rem' }}>Ordini oggi</div>
          <div style={{ color: '#fff', fontSize: '2rem', fontWeight: '800' }}>
            {loading ? '...' : ordini.length}
          </div>
        </div>
        {ordini.length > 0 && (
          <div style={{ marginLeft: '2rem' }}>
            <div style={{ color: '#aab', fontSize: '0.85rem' }}>Scontrino medio</div>
            <div style={{ color: '#2ecc71', fontSize: '1.4rem', fontWeight: '700' }}>
              €{(totale / ordini.length).toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('prodotti')

  const tabs = [
    { id: 'prodotti', label: '🛒 Prodotti' },
    { id: 'storico',  label: '📋 Storico ordini' },
    { id: 'incasso',  label: '💰 Incasso' },
  ]

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: '#0f0f23', padding: '1.5rem' }}>
      <h1 style={{ margin: '0 0 1.5rem', color: '#fff', fontSize: '1.4rem' }}>⚙️ Pannello Admin</h1>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #1a4a8a44', paddingBottom: '0.75rem' }}>
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

      {/* Tab content */}
      {activeTab === 'prodotti' && <TabProdotti />}
      {activeTab === 'storico'  && <TabStorico />}
      {activeTab === 'incasso'  && <TabIncasso />}
    </div>
  )
}
