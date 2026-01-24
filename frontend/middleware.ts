import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip middleware for API routes and static assets
  if (
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('/_next/static') ||
    request.nextUrl.pathname.includes('/_next/image') ||
    request.nextUrl.pathname.endsWith('.ico') ||
    request.nextUrl.pathname.includes('/static')
  ) {
    return NextResponse.next();
  }

  // For now, disable all redirects and let client-side handle authentication
  // This will prevent the redirect loop while we implement client-side protection
  return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};