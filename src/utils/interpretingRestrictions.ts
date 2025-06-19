type RestriccionesParseadas = {
  cancelations: number[];
  force_customer: number | null;
  time_window_overrides?: Record<number, [number, number]>; // { 43: [43200, 46800], ... }
};

export async function interpretarRestricciones(rawContent: string, orders: any[]): Promise<any | null> {
  try {
    const data = JSON.parse(rawContent) as RestriccionesParseadas;

    const cancelados = data.cancelations || [];
    const overrides = data.time_window_overrides || {};

    // ✅ Ordenar orders por order_id ascendente
    const ordersOrdenados = [...orders].sort((a, b) => a.order_id - b.order_id);

    // ✅ Construcción de time_windows con el MISMO orden y tamaño
    const time_windows = ordersOrdenados.map(p =>
      overrides[p.order_id] || [28800, 64800]
    );

    return {
      cancelations: cancelados,
      force_customer: data.force_customer || null,
      time_windows,
    };
  } catch (error) {
    console.warn('❌ No se pudo interpretar restricciones:', error);
    return null;
  }
}
