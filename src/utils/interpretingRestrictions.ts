
import { Restrictions } from "../types/shared/restrictions";
import { Order } from "../types/presalesman/orders/orderType";

export async function interpretarRestricciones(content: string, orders: Order[]): Promise<Restrictions | null> {
    const cancelations: number[] = [];
    const force_customer: number | null = null;
    const time_windows: [number, number][] = [];
  
    for (const order of orders) {
      const nombre = order.client_name.toLowerCase();
      const codigo = order.order_code.toLowerCase();
      const mensaje = content.toLowerCase();
  
      if (mensaje.includes(nombre) || mensaje.includes(codigo)) {
        if (mensaje.includes("cancela") || mensaje.includes("elimina")) {
          cancelations.push(order.order_id);
        }
      }
    }
  
    return {
      cancelations,
      criterio: "tiempo",
      driver_lat: -8.056098,
      driver_lng: -79.062921,
      force_customer,
      time_windows,
    };
  }