const db = require('../db/database')

function initSocket(io) {
  io.on('connection', socket => {

    socket.on('join_room', room => {
      socket.join(room)
    })

    socket.on('order_ready', ({ ordineId, tipo }) => {
      const campiValidi = ['status_cucina', 'status_bar']
      const campo = tipo === 'cucina' ? 'status_cucina' : 'status_bar'
      if (!campiValidi.includes(campo)) return

      db.prepare(`UPDATE orders SET ${campo} = 'done' WHERE id = ?`).run(ordineId)
      io.emit('order_ready', { ordineId, tipo })
    })

  })
}

module.exports = initSocket