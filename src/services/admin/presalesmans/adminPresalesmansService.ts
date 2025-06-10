
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { ApiResponse } from '@/types/shared/api_response';
import { Presalesman } from '@/types/admin/presalesmans/getPresalesmansType';


export async function getPresalesmansByAdminId(adminId: number): Promise<ApiResponse<Presalesman[]>> {
    const params = new URLSearchParams({
        administrator_id: adminId.toString(),
    });

    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/presalesman/get_presalesmans_by_administrator_id?${params.toString()}`, {
        method: 'GET',
    });

    const json = await res.json();

    console.log('🚚 Respuesta de getPresalesmansByAdminId:', json);

    return json as ApiResponse<Presalesman[]>;
}