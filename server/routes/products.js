const express = require('express')
const router  = express.Router()
const db      = require('../db/database')

const PRODUCT_SELECT = `
  SELECT p.id, p.name AS nome, p.price AS prezzo, c.name AS categoria, p.emoji
  FROM products p
  JOIN categories c ON c.id = p.category_id
`

router.get('/', (req, res) => {
  const products = db.prepare(PRODUCT_SELECT + ' ORDER BY c.name, p.name').all()
  res.json(products)
})

router.post('/', (req, res) => {
  const { nome, prezzo, categoria, emoji } = req.body
  const cat = db.prepare('SELECT id FROM categories WHERE name = ?').get(categoria)
  if (!cat) return res.status(400).json({ error: 'Categoria non trovata' })

  const { lastInsertRowid } = db
    .prepare('INSERT INTO products (name, price, category_id, emoji) VALUES (?, ?, ?, ?)')
    .run(nome, prezzo, cat.id, emoji || '')

  const product = db.prepare(PRODUCT_SELECT + ' WHERE p.id = ?').get(lastInsertRowid)
  res.status(201).json(product)
})

router.put('/:id', (req, res) => {
  const { nome, prezzo, categoria, emoji } = req.body
  const cat = db.prepare('SELECT id FROM categories WHERE name = ?').get(categoria)
  if (!cat) return res.status(400).json({ error: 'Categoria non trovata' })

  db.prepare('UPDATE products SET name = ?, price = ?, category_id = ?, emoji = ? WHERE id = ?')
    .run(nome, prezzo, cat.id, emoji || '', req.params.id)

  const product = db.prepare(PRODUCT_SELECT + ' WHERE p.id = ?').get(req.params.id)
  if (!product) return res.status(404).json({ error: 'Prodotto non trovato' })
  res.json(product)
})

router.delete('/:id', (req, res) => {
  const { changes } = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id)
  if (changes === 0) return res.status(404).json({ error: 'Prodotto non trovato' })
  res.status(204).end()
})

module.exports = router
