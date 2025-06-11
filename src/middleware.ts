import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Rutas públicas que no requieren autenticación
const publicPaths = [
  '/auth/login',
  '/auth/register/email',
  '/auth/register/verify',
  '/auth/register/form',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('🛡️ Middleware ejecutado para la ruta:', pathname);

  const token = request.cookies.get('access_token')?.value;

  // ✅ Permitir rutas públicas sin token
  if (publicPaths.includes(pathname)) {
    // Si el usuario ya tiene token e intenta ir a login → redirigirlo a su dashboard
    if (pathname === '/auth/login' && token) {
      try {
        const { payload } = await jwtVerify(token, secret);
        const role = payload?.role;

        const dashboardPaths: Record<string, string> = {
          admin: '/admin/dashboard/drivers',
          driver: '/drivers/dashboard',
          presalesman: '/pre-salesmans/dashboard',
        };

        const redirectPath = dashboardPaths[role as keyof typeof dashboardPaths];
        if (redirectPath) {
          console.log(`🔄 Redirigiendo a dashboard: ${redirectPath}`);
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      } catch (err) {
        console.warn('⚠️ Token inválido o expirado. Se permite login.', err);
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  }

  // ⛔ Bloquea rutas privadas si no hay token
  if (!token) {
    console.warn('🚫 Token no encontrado. Redirigiendo a login.');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload?.role;

    const protectedRoutes = [
      { path: '/admin', role: 'admin' },
      { path: '/drivers', role: 'driver' },
      { path: '/pre-salesmans', role: 'presalesman' },
    ];

    for (const route of protectedRoutes) {
      if (pathname.startsWith(route.path) && role !== route.role) {
        console.warn(`🚫 Acceso denegado para rol "${role}" en ${route.path}`);
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }
  } catch (err) {
    console.error('❌ Token inválido o expirado:', err);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    '/admin/:path*',
    '/drivers/:path*',
    '/pre-salesmans/:path*',
    '/auth/login',
    '/auth/register/:path*',
  ],
};
