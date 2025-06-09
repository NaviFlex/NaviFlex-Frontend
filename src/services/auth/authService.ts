import { LoginFormData } from '@/types/auth';
import { ApiResponse } from '@/types/shared/api_response';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export async function loginUser(data: LoginFormData): Promise<ApiResponse> {
  const form = new URLSearchParams();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) form.append(key, value);
  });


  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  const json = await res.json();


  return json as ApiResponse;
}
