import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { ApiResponse } from '@/types/shared/api_response';
import { ClientType, CreateClientType, ClientByAdministratorType } from '@/types/admin/clients/clientType';



export async function createClient(payload: CreateClientType): Promise<ApiResponse<ClientType>> {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/client/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const json = await res.json();

    console.log('📝 Respuesta de createClient:', json);

    return json as ApiResponse<ClientType>;
}


export async function getClientsByAdminId(admin_id: number): Promise<ApiResponse<ClientByAdministratorType>> {
    const params = new URLSearchParams({
        administrator_id: admin_id.toString(),
    });

    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/client/list_by_administrator?${params.toString()}`, {
        method: 'GET'
    });

    const json = await res.json();

    console.log('📝 Respuesta de getClientsByAdminId:', json);

    return json as ApiResponse<ClientByAdministratorType>;
}