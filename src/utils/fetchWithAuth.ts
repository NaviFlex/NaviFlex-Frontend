// src/utils/fetchWithAuth.ts

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // 👈 importante para enviar cookies
    });
  
    if (response.status === 401 || response.status === 403) {
      // El token expiró o es inválido → redirigir al login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  
    return  response;
  }
  