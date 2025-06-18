'use client'

import {  useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react'
import { interpretarRestricciones } from '@/utils/interpretingRestrictions';
import { reoptimize_route } from '@/services/driver/routesManagement';
type Order = {
    order_id: number;
    client_name: string;
    document_number_client: string;
    order_code: string;
  };
  
export default function ChatWindow({ onClose, orders }: { 
    onClose: () => void,
    orders: Order[],
    
    driverId: number
}) {

  const  [driverIdState, setDriverIdState] = useState<number>(driverId);


    
  const pedidosContexto = orders
  .map(({ client_name, order_code }) => `${client_name}:${order_code}`)
  .join(', ')


  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: 'system-001',
        role: 'system',
        content: `Eres un asistente virtual de logística para una empresa distribuidora.
                  Ayudas a choferes y prevendedores a gestionar rutas de entrega, considerando pedidos activos,
                  cancelaciones, prioridades y horarios.

                  Cada pedido tiene:
                  - Nombre del cliente (ej. "Fernanda Pardo Carres")
                  - Código de pedido (ej. "ORD-XXXXXX")

                  Instrucciones:
                  - Responde solo en español.
                  - Si mencionas un pedido, usa: **Nombre – Código: XXX**
                  - Evita mostrar el código si no es necesario.
                  - Nunca menciones DNI ni otros datos personales.
                  - Ignora temas que no sean de rutas, entregas o pedidos.
                  - No uses emojis en respuestas.
                  - No repitas información ya dada.
                  - No uses lenguaje técnico o jerga.
                  - No redundes ni repitas respuestas.
                  - Responde en medida de lo posible corto.

                  Pedidos activos hoy (solo contexto interno, no imprimir): ${pedidosContexto}`
      }
    ],
    onFinish: async (message) => {
      const restricciones = await interpretarRestricciones(message.content, orders);
    
      if (restricciones) {
        const { lat, lng } = JSON.parse(localStorage.getItem("user_location") || "{}");
    
        const body = {
          ...restricciones,
          driver_lat: lat,
          driver_lng: lng,
        };
    
        const result = await reoptimize_route( driverIdState, body);
    
       
          const nuevaRuta = result.data.nueva_ruta as number[];
          const nuevasCoordenadas = nuevaRuta.map((id) =>
            orders.find((o) => o.order_id === id)
          );
    
          // Emitir evento global para actualizar el mapa
          window.dispatchEvent(
            new CustomEvent("reoptimizeMap", {
              detail: {
                coords: nuevasCoordenadas,
                estimadas: result.data.ordenes_con_llegada_estimada,
              },
            })
          );
        
      }
    },
    
    onError: (error) => {
      console.error('❌ Error en el chatbot:', error.message);
    }
  });



  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="fixed bottom-20 right-6 w-[360px] h-[500px] bg-white rounded-lg shadow-lg z-50 flex flex-col border">
      <div className="flex justify-between items-center p-3 border-b">
        <h2 className="font-semibold text-[#5E52FF]">NaviGPT</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2">
        {messages
         .filter((m) => m.role !== 'system')
        .map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-[#E5E5FF]' : 'bg-[#F0F0F0]'}`}>
              {m.content}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          className="flex-1 border rounded px-3 py-2 text-sm outline-none"
          placeholder="Escribe una instrucción..."
      
        />
        <button type="submit" className="text-[#5E52FF] font-semibold" >
          Enviar
        </button>
      </form>
    </div>
  )
}
