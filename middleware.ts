import { NextRequest, NextResponse } from "next/server";
import { getSession, getAccessGroups } from "./app/auth/auth";

export async function middleware(request: NextRequest) {
  // Get the current session and access groups
  
  const access = await getAccessGroups();
  const session = await getSession();

  // Define protected routes
  const protectedRoutes = ['/trls', '/trls/home', '/trls/work', '/trls/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  // Define public routes that should always be accessible
  const publicRoutes = ['/welcome', '/public','/admin/login', '/public/registrations', '/public/student-registrations', '/login', '/register', '/development','/development/accesscontrol','/development/components','/development/viewers','/development/search'];
  const adminRoutes = ['/admin','/admin/roles', '/admin/app/roles', '/admin/app/settings', '/admin/app/reports']
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route);
  const isAdminRoute = adminRoutes.some(route=>request.nextUrl.pathname === route);
  
  // !session || 
  if (!access) {
    if(isAdminRoute){
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
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
    '/((?!api|_next/static|_next/image|assets|public|subtle-prism1.png|alternating-arrowhead.png|subtle-prism.png|admin-bg.svg|admin-red-bg.png|pattern-randomized.png|repeating-triangles.png|repeating-triangles.svg|background2.jpg|background.jpg|trsl logo.png|favicon.ico|botepco.png|Code-of-Arms-colour.png|background.png|sw.js).*)',
  ],
};