import { useState } from 'react'
import OrdiniContext from './OrdiniContext'

export default function OrdiniProvider({ children }) {
    const [ordini, setOrdini] = useState([])
    const [prossimoId, setProssimoId] = useState(1)

    function inviaOrdine(items) {
        const nuovoOrdine = {
        id: prossimoId,
        ora: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
        items,
        itemsCucina: items.filter(i => i.categoria === 'Cucina'),
        itemsBar:    items.filter(i => i.categoria === 'Bar'),
        statusCucina: 'pending',
        statusBar:    'pending',
        }
        setOrdini(prev => [nuovoOrdine, ...prev])
        setProssimoId(prev => prev + 1)
    }

    function segnaProntoCucina(id) {
        setOrdini(prev => prev.map(o =>
        o.id === id ? { ...o, statusCucina: 'done' } : o
        ))
    }

    function segnaProintoBar(id) {
        setOrdini(prev => prev.map(o =>
        o.id === id ? { ...o, statusBar: 'done' } : o
        ))
    }

    return (
        <OrdiniContext.Provider value={{ ordini, inviaOrdine, segnaProntoCucina, segnaProintoBar }}>
        {children}
        </OrdiniContext.Provider>
    )
}