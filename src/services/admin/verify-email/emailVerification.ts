import { ApiResponse } from "@/types/shared/api_response";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useRouter } from "next/navigation";


export async function verifyEmail(email: string): Promise<ApiResponse> {
    const params = new URLSearchParams({
      email,
      type_verification: 'EMAIL',
    });
  
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/verifications/email_verification/send?${params.toString()}`, {
      method: 'POST',
    });
  
    const json = await res.json();
  
    
  
    return json as ApiResponse;
  }
  

export async function verifyEmailCode(code: string, email:string): Promise<ApiResponse> {
    


    const params = new URLSearchParams({
        email,
        code: code,
    });


    
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/verifications/email_verification/verify?${params.toString()}`, {
        method: 'POST',
    });

  

    const json = await res.json();
    return json as ApiResponse;
}