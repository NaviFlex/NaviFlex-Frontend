export function replaceOrderCodeWithName(text: string, orders: {
    order_id: number;
    client_name: string;
    document_number_client: string;
    order_code: string;
  }[]
): string {
    let result = text;
  
    for (const order of orders) {
      const { order_code, client_name } = order;
      const regex = new RegExp(order_code, "gi");
      result = result.replace(regex, client_name);
    }
  
    return result;
  }
  