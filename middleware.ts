import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "./app/auth/auth";

export async function middleware(request: NextRequest) {
  // First, try to update the session
  const updatedResponse = await updateSession(request);
  
  // Get the current session
  const session = await getSession();
  // Define protected routes
  const protectedRoutes = ['/trls', '/trls/home', '/trls/dashboard']; // Add more as needed
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (!session && isProtectedRoute) {
    // Redirect to welcome page if there's no session and trying to access a protected route
    return NextResponse.redirect(new URL('/welcome', request.url));
  } else if (session && request.nextUrl.pathname === '/') {
    // Redirect to home if there's a session and trying to access the root
    return NextResponse.redirect(new URL('/trls/home', request.url));
  } else if (session && request.nextUrl.pathname === '/welcome') {
    // Redirect to home if there's a session and trying to access the welcome page
    return NextResponse.redirect(new URL('/trls/home', request.url));
  }

  // If there's an updated response from updateSession, return it
  // This ensures any cookie updates are applied
  return updatedResponse || NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|assets|public|favicon.ico|Code-of-Arms-colour.png|sw.js).*)',
  ],
}



// export async function  middleware(request:NextRequest) {
//     //return await updateSession(request);
//     const session = await getSession();

//     if(!session && !request?.nextUrl?.pathname?.startsWith('/welcome')){
//       return Response.redirect(new URL('/welcome', request.url))
//     }else if(session?.user?.realm_access && (request?.nextUrl?.pathname === '/')){
//       return Response.redirect(new URL('/trls//home', request.url))
//     }
// }
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!api|_next/static|_next/image|assets|public|favicon.ico|Code-of-Arms-colour.png|sw.js).*)',
//   ],
// }