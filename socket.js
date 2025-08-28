import { Server } from "socket.io"

let io

function init(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.DOMAINCLIENT,
      credentials: true,
    },
  })

  return io
}

function getIO() {
  if (!io) throw new Error("Socket.io not found")
  return io
}

export { init, getIO }
