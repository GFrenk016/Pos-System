const express  = require('express')
const cors     = require('cors')

require('./db/database')

const app  = express()
const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/orders',   require('./routes/orders'))
app.use('/api/products', require('./routes/products'))

app.listen(PORT, () => {
  console.log(`SwiftPOS server → http://localhost:${PORT}`)
})
