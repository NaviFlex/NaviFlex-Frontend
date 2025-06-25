// lib/socket.ts
import { io, Socket } from 'socket.io-client'

let socket: Socket

// URL del backend con WebSocket habilitado (ajústala si estás en prod)
const SOCKET_URL = 'http://localhost:8000'

// === INICIALIZACIÓN ===
export const connectSocket = () => {

    try {
      if (!socket) {
        socket = io(SOCKET_URL, {
          path: '/ws/socket.io',
          transports: ['websocket'],
        })

        console.log("🔗 Conectando al WebSocket en:", SOCKET_URL)
  
        socket.on('connect', () => {
          console.log('🔌 Conectado a WebSocket con ID:', socket.id)
        })
  
        socket.on('disconnect', () => {
          console.log('❌ Desconectado del WebSocket')
        })
      }
    } catch (error) {
      console.error("❌ Error al conectar socket:", error)
    }
}

// === REGISTRO DE ROLES ===
export const registerDriver = (driverId: number) => {
  if (!socket) return
  socket.emit('register_driver', { driver_id: driverId })
}

export const registerPresalesman = (presalesmanId: number) => {
  if (!socket) return
  socket.emit('register_presalesman', { presalesman_id: presalesmanId })
}

// === ENVÍO DE RESTRICCIONES ===
export const sendRestrictionsToDriver = (
  driverId: number,
  routeId: number,
  message: string,
  restricciones: any
) => {
  if (!socket) return
  socket.emit('enviar_restricciones_chofer', {
    driver_id: driverId,
    route_id: routeId,
    message,
    restricciones
  })
}

export const sendMessageToPresalesman = (
  presalesmanId: number,
  message:string
) =>{
  if (!socket) return
  socket.emit('enviar_notificacion_presalesman', {
    presalesman_id: presalesmanId,
    message
  })
}

// === ESCUCHAR MENSAJES PARA EL CHOFER ===
export const listenForRestrictionsAsDriver = (
  callback: (data: { message: string; restricciones: any }) => void
) => {
  if (!socket) return
  socket.on('notificacion_restricciones', callback)
}

// === ESCUCHAR MENSAJES PARA EL PREVENDEDOR (se deja preparado) ===
export const listenForRestrictionsAsPresalesman = (
  callback: (data: { message: string }) => void
) => {
  if (!socket) return
  socket.on('notificar_cambios_aplicados', callback)
}

// === DESCONECTAR (opcional) ===
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = undefined as any
  }
}
