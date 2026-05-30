const SEP = '────────────────────'

function Scontrino({ ordine, ref }) {
  if (!ordine) return null

  const dataOrdine = ordine.created_at
    ? new Date(ordine.created_at).toLocaleDateString('it-IT')
    : new Date().toLocaleDateString('it-IT')

  return (
    <div ref={ref} style={{
      width: '72mm',
      padding: '4mm',
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#000',
      background: '#fff',
      lineHeight: '1.5',
    }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px', marginBottom: '2px' }}>
        SwiftPOS
      </div>
      <div style={{ textAlign: 'center', marginBottom: '8px', color: '#000' }}>{SEP}</div>

      <div style={{ marginBottom: '2px' }}>Data: {dataOrdine}</div>
      <div style={{ marginBottom: '2px' }}>Ora: {ordine.ora}</div>
      <div style={{ marginBottom: '8px' }}>Ordine: #{ordine.id}</div>

      <div style={{ marginBottom: '8px', color: '#000' }}>{SEP}</div>

      <div style={{ marginBottom: '8px' }}>
        {ordine.items.map((item, i) => (
          <div key={i} style={{ marginBottom: '3px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.nome}</span>
              <span>€{(item.prezzo * item.quantita).toFixed(2)}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#555' }}>
              {item.quantita} x €{Number(item.prezzo).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '8px', color: '#000' }}>{SEP}</div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        fontSize: '16px',
        marginBottom: '12px',
        color: '#000',
      }}>
        <span>TOTALE</span>
        <span>€{Number(ordine.total).toFixed(2)}</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: '8px', color: '#000' }}>
        Grazie e a presto!
      </div>
    </div>
  )
}

export default Scontrino
