import { ApiResponse } from "@/types/shared/api_response";
import { Driver,DriverCreate } from "@/types/admin/drivers/getDriversType";
import { fetchWithAuth } from "@/utils/fetchWithAuth";


export async function getDriversByAdminId(adminId: number): Promise<ApiResponse<Driver[]>> {

    const params = new URLSearchParams({
        administrator_id: adminId.toString(),
    });

    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/driver/get_drivers_by_administrator_id?${params.toString()}`, {
        method: 'GET',
    });




    const json = await res.json();

    console.log('🚚 Respuesta de getDriversByAdminId:', json);

    return json as ApiResponse<Driver[]>;
}



export async function registerDriver(payload: DriverCreate): Promise<ApiResponse<Driver>> {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/drivers/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const json = await res.json()

    console.log('📝 Respuesta de registerDriver:', json)

    return json as ApiResponse<Driver>
}


export async function getDriversAvailableByAdminId(adminId: number): Promise<ApiResponse<Driver[]>> {
    const params = new URLSearchParams({
        administrator_id: adminId.toString(),
    });

    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/driver/get_drivers_availables_by_administrator_id?${params.toString()}`, {
        method: 'GET',
    });

    const json = await res.json();

    console.log('🚚 Respuesta de getDriversAvailableByAdminId:', json);

    return json as ApiResponse<Driver[]>;
}