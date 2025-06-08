import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const pathname = request.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // ✅ Verifica firma y exp automáticamente
    const { payload } = await jwtVerify(token, secret);
    const userRole = payload?.role;

    const protectedRoutes = [
      { path: '/admin', role: 'admin' },
      { path: '/drivers', role: 'driver' },
      { path: '/pre-salesmans', role: 'presalesman' },
    ];

    for (const route of protectedRoutes) {
      if (pathname.startsWith(route.path) && userRole !== route.role) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }
  } catch (err) {
    console.error('Token inválido o expirado:', err);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}
