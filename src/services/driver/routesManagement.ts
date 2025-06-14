import { ApiResponse } from '@/types/shared/api_response';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export async function obtainRouteFromDayByDriverId(
    driver_id: number
): Promise<ApiResponse<any>> {
    


    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/routes/obtain_daily_jordanian_route`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ driver_id })
    });

    const json = await res.json();

    console.log('📝 Respuesta de obtainRouteFromDayByDriverId:', json);

    return json as ApiResponse<any>;
}