'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { interpretarRestricciones } from '@/utils/interpretingRestrictions'
import { reoptimize_route } from '@/services/driver/routesManagement'
import {  SendHorizonal  } from 'lucide-react';


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
}

export default function ChatWindow({
  onClose,
  orders,
  driverId,
  routeId,
  originalOrders
}: {
  onClose: () => void
  orders: Order[]
  driverId: number
  routeId: number
  originalOrders: Order[]
}) {
  const [driverIdState] = useState<number>(driverId)
  const [customMessages, setCustomMessages] = useState<Message[]>([])

  const pedidosContexto = orders
    .map(({ client_name, order_code, order_id }) =>
      `${order_id}:${client_name}:${order_code}`
    )
    .join(', ')

    useEffect(() => {
      console.log('Pedidos en contexto:', pedidosContexto);
      console.log('Cantidad de pedidos:', orders.length);
    }, [pedidosContexto, orders.length]);
    
    
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
          Eres un asistente virtual de logística para una empresa distribuidora.
          Tu función es ayudar a choferes y prevendedores a gestionar rutas de entrega mediante instrucciones escritas en lenguaje natural.

          Cada pedido tiene:
          - Order_id:NombreCliente:CodigoPedido
          - Ejemplo: 25:Fernanda Pardo Carres:ORD-XXXXXX

          Importante:
          - Si el usuario menciona un cliente que no esta en los pedidos activos de hoy, dile o hazle la consulta. Las unicas solicitudes en 
            cuanto a modificar la ruta que el usuario puede pedir son: cancelaciones, prioridades o ventanas de tiempo, tu tienes que interpretar todas estas solicitudes, responde **solo en formato JSON válido**. Caso contrario, responde como un asistente.
          - Usa exclusivamente los **order_id** proporcionados en el contexto para referirte a los pedidos del dia en caso respondas con JSON.
          - Para ventanas de tiempo, responde usando pares de segundos: [inicio, fin] (por ejemplo: [28800, 64800]).
          - Si no se indica una ventana especial para un pedido, **no la incluyas** en el JSON.
          - No expliques ni comentes nada fuera del JSON.

          Cuando detectes que el usuario solicita una acción (como cancelar, priorizar, asignar ventana),
          responde en formato JSON así (en message pon un mensaje directo, bonito y corto para el usuario, algo como de cambios aplicados correctametne o algo mas armado):

              {
                "message": " XXX",
                "json": {
                  "cancelations": [25],
                  "force_customer": 30,
                  "time_window_overrides": {
                    "30": [32400, 36000]
                  }
                }
              }
          Caso contrario, responde como un asistente normal, sin texto complicado ni en formato json.      


          Pedidos activos hoy (solo contexto interno, no imprimir,cada pedido esta delimitado por una coma ","): ${pedidosContexto}
        `
      }
    ],
    onFinish: async (message) => {
      function extractJsonFromMessage(text: string): string | null {
        const match = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```([\s\S]*?)```/);
        return match ? match[1].trim() : text.trim();
      }
    
      try {
        const raw = extractJsonFromMessage(message.content);
        const parsed = JSON.parse(raw || '');
    
        if (parsed?.json) {
          const restricciones = await interpretarRestricciones(
            JSON.stringify(parsed.json),
            orders
          );
    
          if (restricciones) {
            const body = {
              ...restricciones,
              criterio: 'tiempo',
              driver_lat: -8.056098,
              driver_lng: -79.062921
            };
    
            const result = await reoptimize_route(routeId, body);
    
            if (result?.status_code === 200) {
              addCustomMessage('assistant', parsed.message || '✔️ Cambios aplicados correctamente.');
    
              const nuevaRuta = result.data.nueva_ruta as number[];
              const nuevasCoordenadas = nuevaRuta.map((id) =>
                orders.find((o) => o.order_id === id)
              );
    
              window.dispatchEvent(
                new CustomEvent('reoptimizeMap', {
                  detail: {
                    coords: nuevasCoordenadas,
                    estimadas: result.data.ordenes_con_llegada_estimada,
                    restricciones,
                    nueva_ruta: nuevaRuta
                  }
                })
              );
            } else {
              addCustomMessage('assistant', '❌ No fue posible aplicar la restricción.');
            }
          }
        } else {
          // No es JSON válido → mostrar mensaje normal del modelo
          addCustomMessage('assistant', message.content);
        }
      } catch (err) {
        //addCustomMessage('assistant', '❌ Error al procesar la instrucción.');
      }
    }
    
  })

  const addCustomMessage = (role: 'assistant' | 'user', content: string) => {
    const newMsg: Message = {
      id: `${role}-${Date.now()}`, // El timestamp servirá para ordenar
      role,
      content
    }
    setCustomMessages((prev) => [...prev, newMsg])
  }
  

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
      {[...messages, ...customMessages]
  .filter((m) => m.role !== 'system')
  .sort((a, b) => {
    const aTime = Number(a.id.split('-').pop());
    const bTime = Number(b.id.split('-').pop());
    return aTime - bTime;
  })
  .map((m, i) => {
    
    if (
      m.role === 'assistant' &&
      isJson(m.content) &&
      (() => {
        try {
          const parsed = JSON.parse(m.content);
          return parsed?.json && parsed?.message;
        } catch {
          return false;
        }
      })()
    ) {
      return null; // ocultar mensajes técnicos con JSON
    }

    return (
      <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
        <span className={`text-[#5E52FF] max-w-[80%] mb-2  inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-white mb-2' : 'bg-white'}`}>
          {m.content}
        </span>
      </div>
    );
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
