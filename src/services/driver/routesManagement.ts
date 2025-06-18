import { ApiResponse } from '@/types/shared/api_response';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { Restrictions } from '@/types/shared/restrictions';

export async function obtainRouteFromDayByDriverId(
    driver_id: number,
    restrictions: Restrictions | null = null
): Promise<ApiResponse<any>> {
    


    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/routes/obtain_daily_jordanian_route`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ restrictions })
    });

    const json = await res.json();

    console.log('📝 Respuesta de obtainRouteFromDayByDriverId:', json);

    return json as ApiResponse<any>;
}

export async function reoptimize_route(
    route_id: number,
 restrictions: Restrictions | null = null
): Promise<ApiResponse<any>> {
    
    const params = new URLSearchParams({ route_id: route_id.toString() });
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/routes/reoptimize?${params.toString()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ route_id })
    });

    const json = await res.json();

    console.log('📝 Respuesta de reoptimize_route:', json)
    
    return json as ApiResponse<any>;
}