const express = require('express')
const router  = express.Router()
const db      = require('../db/database')

const ITEMS_SELECT = `
  SELECT p.id, p.name AS nome, p.price AS prezzo, c.name AS categoria, p.emoji,
         oi.quantity AS quantita
  FROM order_items oi
  JOIN products    p ON p.id = oi.product_id
  JOIN categories  c ON c.id = p.category_id
  WHERE oi.order_id = ?
`

function formatOrder(order) {
  const items = db.prepare(ITEMS_SELECT).all(order.id)
  return {
    id:           order.id,
    ora:          new Date(order.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
    created_at:   order.created_at,
    items,
    itemsCucina:  items.filter(i => i.categoria === 'Cucina'),
    itemsBar:     items.filter(i => i.categoria === 'Bar'),
    statusCucina: order.status_cucina,
    statusBar:    order.status_bar,
    total:        items.reduce((sum, i) => sum + i.prezzo * i.quantita, 0),
  }
}

// GET /api/orders/today — ordini di oggi con items e totale
router.get('/today', (req, res) => {
  const orders = db.prepare(
    "SELECT * FROM orders WHERE date(created_at) = date('now', 'localtime') ORDER BY created_at DESC"
  ).all()
  res.json(orders.map(formatOrder))
})

// DELETE /api/orders/today — elimina tutti gli ordini di oggi
router.delete('/today', (req, res) => {
  const count = db.transaction(() => {
    const ids = db.prepare(
      "SELECT id FROM orders WHERE date(created_at) = date('now', 'localtime')"
    ).all()
    for (const { id } of ids) {
      db.prepare('DELETE FROM order_items WHERE order_id = ?').run(id)
    }
    db.prepare("DELETE FROM orders WHERE date(created_at) = date('now', 'localtime')").run()
    return ids.length
  })()
  res.json({ deleted: count })
})

router.get('/', (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
  res.json(orders.map(formatOrder))
})

router.post('/', (req, res) => {
  const { items } = req.body
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'items vuoti' })

  const insertOrder = db.prepare('INSERT INTO orders (created_at) VALUES (?)')
  const insertItem  = db.prepare('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)')

  const orderId = db.transaction(() => {
    const { lastInsertRowid } = insertOrder.run(new Date().toISOString())
    for (const item of items) insertItem.run(lastInsertRowid, item.id, item.quantita)
    return lastInsertRowid
  })()

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId)
  const formatted = formatOrder(order)
  req.app.get('io').emit('new_order', formatted)
  res.status(201).json(formatted)
})

router.patch('/:id', (req, res) => {
  const { status_cucina, status_bar } = req.body

  if (status_cucina !== undefined)
    db.prepare('UPDATE orders SET status_cucina = ? WHERE id = ?').run(status_cucina, req.params.id)

  if (status_bar !== undefined)
    db.prepare('UPDATE orders SET status_bar = ? WHERE id = ?').run(status_bar, req.params.id)

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id)
  if (!order) return res.status(404).json({ error: 'Ordine non trovato' })

  res.json({ id: order.id, statusCucina: order.status_cucina, statusBar: order.status_bar })
})

module.exports = router
