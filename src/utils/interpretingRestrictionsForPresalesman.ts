type RestriccionesParseadas = {
    cancelations?: number[]
    force_customer?: number | null
    time_window_overrides?: Record<number, [number, number]>
  }
  
  export async function interpretarRestriccionesForPresalesman(
    rawContent: string,
    orders: any[],
    presalesmanName?: string // opcional, solo si es prevendedor
  ): Promise<any | null> {
    try {
      const data = JSON.parse(rawContent) as RestriccionesParseadas
  
      const cancelados = data.cancelations || []
      const overrides = data.time_window_overrides || {}
  
      const ordersOrdenados = [...orders].sort((a, b) => a.order_id - b.order_id)
  
      const time_windows = ordersOrdenados.map((p) =>
        overrides[p.order_id] || [28800, 64800]
      )
  
      // Si se trata de prevendedor, construir mensaje explicativo para el chofer
      let message_for_driver = ''
      if (presalesmanName) {
        const buscar = (id: number) =>
          orders.find((o) => o.order_id === id)
  
        const cancelMsgs = cancelados.map((id) => {
          const o = buscar(id)
          return o
            ? `🟡 El prevendedor ${presalesmanName} indicó que el cliente ${o.client_name} – Código: ${o.order_code} canceló su pedido.`
            : ''
        })
  
        const forceMsg = data.force_customer
          ? (() => {
              const o = buscar(data.force_customer!)
              return o
                ? `🟡 El prevendedor ${presalesmanName} indicó que ${o.client_name} – Código: ${o.order_code} debe ser atendido justo después del depósito.`
                : ''
            })()
          : ''
  
        const windowMsgs = Object.entries(overrides).map(([id, [start, end]]) => {
          const o = buscar(Number(id))
          return o
            ? `🟡 El prevendedor ${presalesmanName} asignó una ventana de tiempo de ${start}s a ${end}s al cliente ${o.client_name} – Código: ${o.order_code}.`
            : ''
        })
  
        message_for_driver = [...cancelMsgs, forceMsg, ...windowMsgs]
          .filter(Boolean)
          .join('\n')
      }
  
      return {
        cancelations: cancelados,
        force_customer: data.force_customer || null,
        time_windows,
        ...(message_for_driver ? { message_for_driver } : {})
      }
    } catch (error) {
      console.warn('❌ No se pudo interpretar restricciones:', error)
      return null
    }
  }
  