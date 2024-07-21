import { NextRequest, NextResponse } from "next/server";
import { getSession, getAccessGroups } from "./app/auth/auth";

export async function middleware(request: NextRequest) {
  // Get the current session and access groups
  const session = await getSession();
  const access = await getAccessGroups();

  // Define protected routes
  const protectedRoutes = ['/trls', '/trls/home', '/trls/work', '/trls/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  // Define public routes that should always be accessible
  const publicRoutes = ['/welcome', '/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route);

  if (!session || !access) {
    if (isProtectedRoute) {
      // Redirect to welcome page if there's no session and trying to access a protected route
      return NextResponse.redirect(new URL('/welcome', request.url));
    } else if (!isPublicRoute) {
      // For non-public routes without session, also redirect to welcome
      return NextResponse.redirect(new URL('/welcome', request.url));
    }
  } else {
    // User is authenticated
    if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/welcome') {
      // Redirect to home if there's a session and trying to access the root or welcome page
      return NextResponse.redirect(new URL('/trls/home', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|public|favicon.ico|Code-of-Arms-colour.png|sw.js).*)',
  ],
};