'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { interpretarRestriccionesForPresalesman } from '@/utils/interpretingRestrictionsForPresalesman'
import {  SendHorizonal  } from 'lucide-react';
import {
    connectSocket,
    registerPresalesman,
    sendRestrictionsToDriver
  } from '@/lib/socket'


type Order = {
  order_id: number
  client_name: string
  document_number_client: string
  order_code: string
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number

}

export default function ChatWindow({
  onClose,
  orders,
  routeId,
  driverId,
  presalesmanId,
  presaleman_name
}: {
  onClose: () => void
  orders: Order[]
  routeId: number
  driverId: number
  presaleman_name: string // <- added missing type for presaleman_name  
  presalesmanId: number // <- added missing type for presalesmanId
}) {
  const [customMessages, setCustomMessages] = useState<Message[]>([])

  const pedidosContexto = orders
    .map(({ client_name, order_code, order_id }) =>
      `${order_id}:${client_name}:${order_code}`
    )
    .join(', ')


    useEffect(() => {
        console.log("📡 Ejecutando useEffect del prevendedor") // <--- Agrega esto
        connectSocket()
        registerPresalesman(presalesmanId)
      }, [presalesmanId])
      
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit
  } = useChat({
    initialMessages: [
      {
        id: 'system-001',
        role: 'system',
        content: `
        Eres un asistente de rutas para un prevendedor de una empresa distribuidora.
        El prevendedor puede indicar cancelaciones, prioridades o ventanas horarias de entrega.
      
        Cada pedido tiene:
        - Order_id:NombreCliente:CodigoPedido
        - Ejemplo: 25:Fernanda Pardo Carres:ORD-XXXXXX
      
        Importante:
        - Si el cliente no está en los pedidos activos de hoy, solicita confirmación.
        - Interpreta las solicitudes como restricciones y responde en formato JSON.
        - También genera una versión visible para el chofer como se muestra más abajo.
        - Usa exclusivamente los order_id.
      
        Ejemplo de respuesta:
      
        {
          "message": " Se aplicaron los cambios correctamente.(O algo mas humano segun lo que creas conveniente)",
          "message_for_driver": "🟡 El prevendedor ${presaleman_name }indicó que el cliente Fernanda Pardo – Código: ORD-XXXXXX canceló su pedido.",
          "json": {
            "cancelations": [25],
            "force_customer": 30,
            "time_window_overrides": {
              "30": [32400, 36000]
            }
          }
        }
        En 'message', responde algo mas humanizado, como "Ya se le informo la chofer sobre tus cambios y se aplicaron" algo asi, lo
        mismo para message_for_driver.
        En cancelaciones, force_customer y la llave de time_windows_overrides, usa el id de la orden
        
        En caso se trate de algunas de esas restricciones, responde unicamente en el formato JSON indicado, 'message'
        es el que mostrare al prevendedor, y 'message_for_driver' es el que vera el chofer, manda mensajes humanizados para esos parametros. Si el mensaje del usuario no tiene nada que ver con alguna de
        estas restricciones, responde en mensaje normal, sin formato json, o en todo caso, si necesitas confirmar algo, preguntale en un mensaje normal.

        Pedidos activos hoy: ${pedidosContexto}
      `
      
      }
    ],
    onFinish: async (message) => {
        function extractJsonFromMessage(text: string): string | null {
          const match = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```([\s\S]*?)```/)
          return match ? match[1].trim() : text.trim()
        }
  
        try {
          const raw = extractJsonFromMessage(message.content)
          const parsed = JSON.parse(raw || '')
  
          if (parsed?.json) {
            const restricciones = await interpretarRestriccionesForPresalesman(
              JSON.stringify(parsed.json),
              orders,
              presaleman_name // <- nombre del prevendedor (puedes parametrizarlo después)
            )
             
            console.log(restricciones)

            if (parsed.message_for_driver && driverId) {
                sendRestrictionsToDriver(
                  driverId,
                  routeId,
                  parsed.message_for_driver,
                  restricciones
                )
              }
              
              addCustomMessage('assistant', parsed.message)

          } else {
            addCustomMessage('assistant', message.content)
          }
        } catch (err) {
        }
      }
    
  })

  const addCustomMessage = (role: 'assistant' | 'user', content: string) => {
    const newMsg: Message = {
      id: `${role}-${Date.now()}`,
      role,
      content,
      timestamp: Date.now()
    }
    setCustomMessages((prev) => [...prev, newMsg])
  }
  const chatbotMessageTimestamps = useRef<Record<string, number>>({})
  const combinedMessages = useMemo(() => {
    const enrichedChatMessages = messages.map((m) => {
      if (!chatbotMessageTimestamps.current[m.id]) {
        chatbotMessageTimestamps.current[m.id] = Date.now()
      }
      return {
        ...m,
        timestamp: chatbotMessageTimestamps.current[m.id],
      }
    })
  
    return [...enrichedChatMessages, ...customMessages].sort((a, b) => a.timestamp - b.timestamp)
  }, [messages, customMessages])
  

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, customMessages])

  return (
    <div className="fixed bottom-20 right-6 w-[360px] h-[500px] bg-white rounded-lg shadow-lg z-50 flex flex-col border">
      <div className="flex justify-between items-center p-3 border-b bg-[#5E52FF]">
        <h2 className="font-semibold w-full text-white text-center">NaviGPT</h2>
        <button onClick={onClose} className="text-white hover:text-gray-700">✕</button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2 bg-[#5E52FF]">
            {combinedMessages
                .filter((m) => m.role !== 'system')
                .map((m, i) => {
                if (
                    m.role === 'assistant' &&
                    isJson(m.content) &&
                    (() => {
                    try {
                        const parsed = JSON.parse(m.content)
                        return parsed?.json && parsed?.message
                    } catch {
                        return false
                    }
                    })()
                ) {
                    return null
                }

                return (
                    <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                    <span className={`text-[#5E52FF] max-w-[80%] mb-2 inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-white mb-2' : 'bg-white'}`}>
                        {m.content}
                    </span>
                    </div>
                )
                })}
            <div ref={bottomRef} />
            </div>


      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (input.trim()) {
            originalHandleSubmit(e)
          }
        }}
        className="p-3 border-t flex gap-2 bg-[#5E52FF] flex items-center"
      >
        <input
          value={input}
          onChange={handleInputChange}
          className="flex-1 border rounded px-3 py-2 text-sm outline-none bg-white"
          placeholder="Escribe una instrucción..."
        />

        <SendHorizonal type="submit" className="text-white font-semibold"
          
        />

      </form>
    </div>
  )
}

// Utilidad para detectar si un string es JSON válido
function isJson(text: string): boolean {
  try {
    const parsed = JSON.parse(text)
    return typeof parsed === 'object' && parsed !== null
  } catch {
    return false
  }
}
