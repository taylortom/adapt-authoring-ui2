import { io } from 'socket.io-client'

export const socket = io(import.meta.env.VITE_WS_URL || 'ws://localhost:3001', {
  autoConnect: false
})

export const connectWebSocket = () => {
  if (!socket.connected) {
    socket.connect()
  }
}

export const disconnectWebSocket = () => {
  if (socket.connected) {
    socket.disconnect()
  }
}
