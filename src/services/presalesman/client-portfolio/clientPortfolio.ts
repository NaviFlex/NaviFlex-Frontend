
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { ApiResponse } from '@/types/shared/api_response';
import { ClientByAreaType } from '@/types/admin/clients/clientType';
import {OrderType} from '@/types/presalesman/orders/orderType'
export async function getClientPortfolio(presalesman_id : number): Promise<ApiResponse<ClientByAreaType>> {

    const params = new URLSearchParams({
        presalesman_id: presalesman_id.toString(),
    }); 


    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/client/list_by_area_presalesman?${params.toString()}`, {
        method: 'GET'
    });

    const json = await res.json();

    console.log('📝 Respuesta de getClientPortfolio:', json);

    return json as ApiResponse<ClientByAreaType>;
}


export async function createOrderFromNextDay(client_id: number, presalesman_id: number): Promise<ApiResponse<OrderType>> { 

    const payload ={
        client_id : client_id,
        presalesman_id: presalesman_id,
    }

    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/register`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const json = await res.json();

    console.log('📝 Respuesta de createOrderFromNextDay:', json);

    return json as ApiResponse<OrderType>;
}
