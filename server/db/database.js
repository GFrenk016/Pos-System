const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'pos.db'))

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    price       REAL    NOT NULL,
    category_id INTEGER NOT NULL,
    emoji       TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at    TEXT    NOT NULL,
    status_cucina TEXT    NOT NULL DEFAULT 'pending',
    status_bar    TEXT    NOT NULL DEFAULT 'pending'
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id   INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity   INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`)

const catCount = db.prepare('SELECT COUNT(*) as cnt FROM categories').get()
if (catCount.cnt === 0) {
  const insertCat  = db.prepare('INSERT INTO categories (name) VALUES (?)')
  const insertProd = db.prepare('INSERT INTO products (name, price, category_id, emoji) VALUES (?, ?, ?, ?)')

  const barId    = insertCat.run('Bar').lastInsertRowid
  const cucinaId = insertCat.run('Cucina').lastInsertRowid

  insertProd.run('Caffè',           1.20, barId,    '☕')
  insertProd.run('Cappuccino',       1.50, barId,    '🥛')
  insertProd.run('Cornetto',         1.20, barId,    '🥐')
  insertProd.run('Succo',            2.00, barId,    '🧃')
  insertProd.run('Acqua',            1.00, barId,    '💧')
  insertProd.run('Pasta al ragù',   7.50, cucinaId, '🍝')
  insertProd.run('Insalata',         5.00, cucinaId, '🥗')
  insertProd.run('Panino',           4.50, cucinaId, '🥪')
  insertProd.run('Pizza margherita', 6.00, cucinaId, '🍕')
}

module.exports = db
