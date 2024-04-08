import { NextRequest } from "next/server";
import { getSession, updateSession } from "./app/auth/auth";

export async function  middleware(request:NextRequest) {
    //return await updateSession(request);
    const session = await getSession();
    
    if(!session?.user?.access && !request?.nextUrl?.pathname?.startsWith('/welcome')){
      return Response.redirect(new URL('/welcome', request.url))
    }else if(session?.user?.access && (request?.nextUrl?.pathname === '/')){
      return Response.redirect(new URL('/trls//home', request.url))
    }
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