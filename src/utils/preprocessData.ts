export function mapToOrderId(message: string, orders: {
    order_id: number;
    client_name: string;
    document_number_client: string;
    order_code: string;
  }[]): { transformedMessage: string; detectedOrderId?: number } {
    
    const normalizedMessage = message.toLowerCase().trim();
  
    for (const order of orders) {
      const name = order.client_name.toLowerCase();
      const dni = order.document_number_client;
      const code = order.order_code.toLowerCase();
  
      if (
        normalizedMessage.includes(name) ||
        normalizedMessage.includes(dni) ||
        normalizedMessage.includes(code)
      ) {
        const finalMessage = message
          .replace(new RegExp(dni, "g"), order.order_code)
          .replace(new RegExp(name, "gi"), order.order_code)
          .replace(new RegExp(code, "gi"), order.order_code);
  
        return {
          transformedMessage: finalMessage,
          detectedOrderId: order.order_id
        };
      }
    }
  
    // If no match found
    return { transformedMessage: message };
  }
  