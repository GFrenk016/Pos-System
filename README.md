# 🍽️ POS System — README

Sistema di gestione comande per bar/ristorante, stile McDonald's/KFC.
Ordini separati per cucina e bar, display in tempo reale, pannello admin.

---

## Stack tecnico

| Layer | Tecnologia |
|---|---|
| Frontend | React + Vite |
| Routing | React Router DOM |
| State (sprint 1-2) | React Context |
| Backend | Node.js + Express |
| Real-time | Socket.io |
| Database | SQLite (better-sqlite3) |
| Stampa | react-to-print |

---

## Struttura cartelle

```
pos-system/
  src/
    pages/
      CassaPage.jsx       — interfaccia cassa (tablet)
      KDSPage.jsx         — display cucina
      BarPage.jsx         — display bar
      AdminPage.jsx       — pannello gestione
    components/
      ProductGrid.jsx     — griglia prodotti touchscreen
      Cart.jsx            — carrello laterale
      OrderCard.jsx       — card ordine (condivisa tra cucina e bar)
    context/
      OrdiniContext.js    — context + hook useOrdini
      OrdiniProvider.jsx  — provider stato globale ordini
    data/
      prodotti.js         — dati mock prodotti (sostituiti dal DB allo sprint 2)
    hooks/
      useSocket.js        — hook WebSocket (sprint 3)
    App.jsx
    main.jsx
  server/
    index.js              — entry point Express + Socket.io
    routes/
      orders.js           — POST/GET ordini
      products.js         — CRUD prodotti e categorie
    socket/
      socket.js           — logica eventi WebSocket
    db/
      database.js         — init SQLite + funzioni query
      schema.sql          — struttura tabelle
```

---

## Sprint

### ✅ Sprint 1 — UI Cassa (completato)
**Durata stimata:** 1-2 settimane

- Setup progetto con Vite + React Router
- `CassaPage.jsx` con griglia prodotti e carrello laterale
- `ProductGrid.jsx` — griglia touchscreen divisa per categorie
- `Cart.jsx` — carrello con totale e bottone invio
- `OrderCard.jsx` — card ordine riutilizzabile
- `KDSPage.jsx` e `BarPage.jsx` funzionanti con React Context
- Navbar provvisoria per navigazione tra le pagine
- Separazione automatica ordini per destinazione (cucina / bar)
- Stato ordini: `pending` → `done`

---

### 🔲 Sprint 2 — Backend + Database
**Durata stimata:** 1-2 settimane

- Setup server Node.js + Express in `/server`
- Configurazione SQLite con `better-sqlite3`
- Creazione schema DB: `products`, `categories`, `orders`, `order_items`
- Route `POST /api/orders` — salva ordine + items nel DB
- Route `GET /api/orders` — restituisce storico ordini
- Route CRUD `/api/products` — gestione prodotti
- Sostituzione dati mock con chiamate API reali nella cassa
- Test con DB Browser for SQLite

---

### 🔲 Sprint 3 — WebSocket real-time
**Durata stimata:** 1-2 settimane

- Installazione `socket.io` (server) e `socket.io-client` (client)
- Sostituzione React Context con WebSocket
- Hook `useSocket.js` condiviso tra cassa, cucina e bar
- Evento `new_order` — ordine inviato → appare istantaneamente su cucina e bar
- Evento `order_ready` — cucina/bar segnano pronto → aggiornamento in tempo reale
- Test multi-dispositivo in rete locale

---

### 🔲 Sprint 4 — KDS raffinato
**Durata stimata:** 1 settimana

- Timer per ogni ordine (quanto tempo è in attesa)
- Ordini in ritardo evidenziati in rosso
- Suono notifica all'arrivo di un nuovo ordine
- Filtro per vedere solo pending o solo completati

---

### 🔲 Sprint 5 — Admin panel
**Durata stimata:** 1-2 settimane

- Aggiunta / modifica / eliminazione prodotti
- Gestione categorie
- Storico ordini del giorno con filtri
- Incasso totale giornaliero
- Reset giornaliero ordini

---

### 🔲 Sprint 6 — Stampa scontrino + deploy locale
**Durata stimata:** 1 settimana

- Integrazione `react-to-print` per stampante termica
- Layout scontrino: numero ordine, prodotti, totale, ora
- Test completo sul campo con tablet e monitor cucina/bar
- Configurazione avvio automatico server su mini PC locale

---

## Flusso ordine completo

```
Cassa seleziona prodotti
        ↓
POST /api/orders → SQLite salva ordine
        ↓
Socket.io emit("new_order")
        ↓
    ┌───────────────────┐
    ↓                   ↓
KDS Cucina          Display Bar
(solo itemsCucina)  (solo itemsBar)
    ↓                   ↓
Segna "Pronto"      Segna "Pronto"
    ↓                   ↓
UPDATE orders SET status="done"
```

---

## Avvio in sviluppo

```bash
# Frontend
cd pos-system
npm run dev
# → http://localhost:5173

# Backend (dal sprint 2)
cd server
node index.js
# → http://localhost:3001
```

---

## Note

- Il database `pos.db` viene creato automaticamente al primo avvio del server.
- Per ispezionare i dati: [DB Browser for SQLite](https://sqlitebrowser.org/) oppure estensione **SQLite Viewer** su VS Code.
- Fino allo Sprint 3, lo stato degli ordini è gestito da React Context e si resetta al refresh della pagina. Dal Sprint 3 in poi tutto passa per il backend.
