import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { ApiResponse } from '@/types/shared/api_response';


export async function getChangesRouteByAdminIdAndCurrentDay(admin_id: number): Promise<ApiResponse<number>> {

    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/routes_changes/get_route_by_admin_id_current_day?admin_id=${admin_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const json = await res.json();

    console.log('📝 Respuesta de creeateRouteByDriverAndPresalesman:', json);

    return json as ApiResponse<number>;
}