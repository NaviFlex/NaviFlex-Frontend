import Cookies from 'js-cookie';

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = Cookies.get('access_token');

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if ((response.status === 401 || response.status === 403) && typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (!currentPath.startsWith('/auth/login')) {
      Cookies.remove('access_token');
      window.location.href = '/auth/login';
    }
  }

  return response;
}
