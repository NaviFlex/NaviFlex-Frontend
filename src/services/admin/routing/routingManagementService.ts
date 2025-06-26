import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { ApiResponse } from '@/types/shared/api_response';


export async function creeateRouteByDriverAndPresalesman(driver_id: number, presalesman_id: number,): Promise<ApiResponse<number>> {

    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/routes/create_route_by_driver_and_presalesman`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            driver_id,
            presalesman_id
                })
    });

    const json = await res.json();

    console.log('📝 Respuesta de creeateRouteByDriverAndPresalesman:', json);

    return json as ApiResponse<number>;
}


export async function verifyRoutesByPresalesmansIds(presalesmans_ids: number[]): Promise<ApiResponse<any>> {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/routes/verify_presalesmans_route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(presalesmans_ids)  // Enviar el array directamente
    });
  
    const json = await res.json();
  
    console.log('📝 Respuesta de verifyRoutesByPresalesmansIds:', json);
  
    return json as ApiResponse<any>;
  }
  



  