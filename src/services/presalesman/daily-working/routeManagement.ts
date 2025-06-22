import { ApiResponse } from '@/types/shared/api_response';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export async function obtainRouteFromDayByPresalesmanId(
    presalesman_id: number,
): Promise<ApiResponse<any>> {
    


    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/routes/obtain_daily_jordanian_route_presalesman`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ presalesman_id })
    });

    const json = await res.json();

    console.log('📝 Respuesta de obtainRouteFromDayByPresalesmanId:', json);

    return json as ApiResponse<any>;
}