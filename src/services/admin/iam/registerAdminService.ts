
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { AdminRegisterRequest } from '@/types/admin/register/adminRequest';
import { ApiResponse } from "@/types/shared/api_response";



export async function registerAdminService(adminDataRegister: AdminRegisterRequest): Promise<ApiResponse> {
   

    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/administrators/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminDataRegister),
    });

 
    
    const json = await res.json();
    
    return json as ApiResponse;
}