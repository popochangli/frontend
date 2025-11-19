import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/events', '/'];
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith('/events/')
  );

  // Auth routes (login, register)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  // Admin routes
  const isAdminRoute = pathname.startsWith('/admin');

  // If accessing auth routes while authenticated, let client-side handle redirect based on role
  // We can't check role in middleware, so we'll let the page component handle it
  // if (isAuthRoute && token) {
  //   return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  // }

  // If accessing protected routes without token, redirect to login
  // Note: We check token from cookie, but also check localStorage in client-side
  // Since we are using cross-domain auth, cookies might be blocked by some browsers
  // So we'll rely on client-side protection for now
  /*
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  */

  // For admin routes, we'll check role in the page component
  // Middleware can't access localStorage, so role check happens client-side

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

