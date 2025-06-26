'use client'

import { useState, useEffect, useRef,useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { interpretarRestricciones } from '@/utils/interpretingRestrictions'
import { reoptimize_route, createRouteChanges } from '@/services/driver/routesManagement'
import {  SendHorizonal  } from 'lucide-react';
import { listenForRestrictionsAsDriver } from '@/lib/socket'

import {
  connectSocket,
  registerDriver,
  sendMessageToPresalesman
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
  driverId,
  routeId,
  presalesmanId
}: {
  onClose: () => void
  orders: Order[]
  driverId: number
  routeId: number
  presalesmanId: number
}) {
  const [customMessages, setCustomMessages] = useState<Message[]>([])


  
  const pedidosContexto = orders
    .map(({ client_name, order_code, order_id }) =>
      `${order_id}:${client_name}:${order_code}`
    )
    .join(', ')

    useEffect(() => {
        console.log("📡 Ejecutando useEffect del chofer") // <--- Agrega esto
        connectSocket()
        registerDriver(driverId)
      }, [driverId])


      useEffect(() => {
        listenForRestrictionsAsDriver(async (data) => {
          console.log('📥 Recibido desde prevendedor:', data)
          
          // Mostrar mensaje informativo al chofer
          addCustomMessage('assistant', `${data.message}`)
      
          // Interpretar restricciones directamente
          const restricciones = await interpretarRestricciones(
            JSON.stringify(data.restricciones),
            orders
          )
      
          if (!restricciones) {
            addCustomMessage('assistant', '❌ No fue posible interpretar las restricciones.')
            return
          }
      
          // Armar el body para reoptimize_route
          const body = {
            ...restricciones,
            criterio: 'tiempo',
            driver_lat: -8.056098,
            driver_lng: -79.062921
          }
      
          const result = await reoptimize_route(routeId, body)
      
          if (result?.status_code === 200) {
            addCustomMessage('assistant', '✔️ Cambios aplicados automáticamente.')
            const nuevaRuta = result.data.nueva_ruta as number[]
            const nuevasCoordenadas = nuevaRuta.map((id) =>
              orders.find((o) => o.order_id === id)
            )
      
            window.dispatchEvent(
              new CustomEvent('reoptimizeMap', {
                detail: {
                  coords: nuevasCoordenadas,
                  estimadas: result.data.ordenes_con_llegada_estimada,
                  restricciones,
                  nueva_ruta: nuevaRuta
                }
              })
            )
          } else {
            addCustomMessage('assistant', '❌ No fue posible aplicar la reoptimización.')
          }
        })
      }, [ orders, routeId  ])
      
    
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
            Eres un asistente virtual de logística para una empresa distribuidora, espcificamente para un Chofer.
            Tu función es ayudar al chofer a gestionar rutas de entrega mediante instrucciones escritas en lenguaje natural.

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
                  "message_for_presalesman": "(Aca pon un mensaje de los tipos de incidencia o el tipo, en  caso solo sea uno, este mensaje lo vera el prevendedor, y ademas , espeficica el nombre y codigo del cliente)"
                  "type_incidents": "(Aca colocame el tipo de incidente, si fue CANCELACION, PRIORIDAD, VENTANA DE TIEMPO, segun lo que consideres)",
                  "client_name": (Aca coloca el nombre del cliente al que se le aplico el cambio, si son mas de uno, usa un  deliminador de "|"),
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

                sendMessageToPresalesman(
                  presalesmanId,
                  parsed.message_for_presalesman
                )

                const createChangesResponse = await createRouteChanges
                (
                  {
                    routes_id: routeId,
                    type: 1,
                    previous_stop_order: [],
                    new_stop_order: [],
                    restrictions: {
                      type_incidents: parsed.type_incidents,
                      client_name: parsed.client_name,
                      reportBy: "CHOFER"
                    }  // cancelations, time_windows, etc.
                  }
                )

                console.log('📝 Respuesta de createRouteChanges:', createChangesResponse)


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
      id: `${role}-${Date.now()}`,
      role,
      content,
      timestamp: Date.now()
    }
    setCustomMessages((prev) => [...prev, newMsg])
  }
  
    const chatbotMessageTimestamps = useRef<Record<string, number>>({})

    const combinedMessages = useMemo(() => {
      return [
        ...messages.map((m) => {
          if (!chatbotMessageTimestamps.current[m.id]) {
            chatbotMessageTimestamps.current[m.id] = Date.now()
          }
          return {
            ...m,
            timestamp: chatbotMessageTimestamps.current[m.id],
          }
        }),
        ...customMessages
      ].sort((a, b) => a.timestamp - b.timestamp)
    }, [messages, customMessages])

    useEffect(() => {
      console.log('📬 Mensajes combinados:', combinedMessages)
    }, [combinedMessages])

    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [combinedMessages])

  return (
    <div className="fixed bottom-20 right-6 w-[360px] h-[500px] bg-white rounded-lg shadow-lg z-50 flex flex-col border">
      <div className="flex justify-between items-center p-3 border-b bg-[#5E52FF]">
        <h2 className="font-semibold w-full text-white text-center">NaviGPT</h2>
        <button onClick={onClose} className="text-white hover:text-gray-700">✕</button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2 bg-[#5E52FF]">
        {combinedMessages
          .filter((m) => m.role !== 'system')
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((m, i) => {
            const isJsonValido = (() => {
              try {
                const parsed = JSON.parse(m.content);
                return parsed?.json && parsed?.message;
              } catch {
                return false;
              }
            })();

            if (m.role === 'assistant' && isJsonValido) {
              return null; // Ocultar mensajes JSON técnicos
            }

            return (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={`text-[#5E52FF] max-w-[80%] mb-2 inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-white mb-2' : 'bg-white'}`}>
                  {m.content}
                </span>
              </div>
            );
          })}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            originalHandleSubmit(e);
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

        <SendHorizonal type="submit" className="text-white font-semibold" />
      </form>
    </div>
  );

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
