// src/utils/auth.ts
import Cookies from 'js-cookie';
import { decodeJwt } from 'jose';

export function getDecodedAccessToken(): Record<string, any> | null {
  const token = Cookies.get('access_token');
  if (!token) return null;

  try {
    const payload = decodeJwt(token); // no valida firma, pero suficiente en cliente
    return payload;
  } catch (err) {
    console.error('Error decodificando el token:', err);
    return null;
  }
}
