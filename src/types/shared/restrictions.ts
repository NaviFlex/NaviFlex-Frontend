export interface Restrictions {
    cancelations: number[],
    criterio: 'tiempo' | 'distancia',
    driver_lat: number,
    driver_lng: number,
    force_customer: number | null,
    time_windows: [number, number][],
  };