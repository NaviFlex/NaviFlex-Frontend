import { ApiResponse } from '@/types/shared/api_response';
import { AreaType } from '@/types/admin/areaType';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export async function get_all_areas_by_admin_id(admin_id: string): Promise<ApiResponse<AreaType[]>>{

    const params = new URLSearchParams({
        administrator_id: admin_id,
    });

    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/areas/get_all_areas?${params.toString()}`, {
        method: 'GET',
    });

    const json = await res.json();

    console.log('🗺️ Respuesta de get_all_areas:', json);

    return json as ApiResponse<AreaType[]>;
}


export async function get_areas_presalesman_id_isNone_by_admin_id(admin_id: string): Promise<ApiResponse<AreaType[]>>{

    const params = new URLSearchParams({
        administrator_id: admin_id,
    });

    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/areas/get_areas/presalesman_id_is_none?${params.toString()}`, {
        method: 'GET',
    });

    const json = await res.json();

    console.log('🗺️ Respuesta de get_areas_presalesman_id_isNone:', json);

    return json as ApiResponse<AreaType[]>;
}