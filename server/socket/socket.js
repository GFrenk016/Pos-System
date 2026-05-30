function initSocket(io) {
  io.on('connection', socket => {
    socket.on('join_room', room => {
      socket.join(room)
    })

    socket.on('order_ready', ({ ordineId, tipo }) => {
      const campo = tipo === 'cucina' ? 'status_cucina' : 'status_bar'
      const db = require('../db/database')
      db.prepare(`UPDATE orders SET ${campo} = 'done' WHERE id = ?`).run(ordineId)
      io.emit('order_ready', { ordineId, tipo })
    })
  })
}

module.exports = initSocket
