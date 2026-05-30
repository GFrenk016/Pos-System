const express  = require('express')
const cors     = require('cors')
const http     = require('http')
const { Server } = require('socket.io')

require('./db/database')

const app    = express()
const server = http.createServer(app)
const io     = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
})

const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.set('io', io)

app.use('/api/orders',   require('./routes/orders'))
app.use('/api/products', require('./routes/products'))

require('./socket/socket')(io)

server.listen(PORT, () => {
  console.log(`SwiftPOS server → http://localhost:${PORT}`)
})
