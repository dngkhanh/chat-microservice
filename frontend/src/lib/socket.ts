import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initializeSocket = (token: string) => {
  if (socket) {
    socket.disconnect()
  }

  socket = io(import.meta.env.VITE_CHAT_SERVICE_URL || 'http://localhost:3002', {
    auth: {
      token,
    },
    transports: ['websocket'],
  })

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id)
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })

  return socket
}

export const getSocket = (): Socket | null => {
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
