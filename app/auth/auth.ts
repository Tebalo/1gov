'use server'

import { SignJWT, errors, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { DeTokenizeUrl, authUrl, emailauthUrl, iamURL, secretKey, validateUrl } from '../lib/store';
import { revalidatePath } from 'next/cache';
import { AccessGroup, AuthResponse, DecodedToken, LoginPayload, OTPPayload, Session, UserRole } from '../lib/types';

// Constants
const key = new TextEncoder().encode(secretKey);
const ROLES: UserRole[] = [
  'CUSTOMER',
  'REGISTRATION_OFFICER', 
  'MANAGER', 
  'SNR_REGISTRATION_OFFICER', 
  'DIRECTOR', 
  'REGISTRAR', 
  'LICENSE_OFFICER', 
  'SNR_LICENSE_OFFICER', 
  'LICENSE_MANAGER', 
  'INVESTIGATIONS_OFFICER', 
  'INVESTIGATIONS_MANAGER',
  'INVESTIGATIONS_DIRECTOR',
  'DISCIPLINARY_COMMITTEE', 
  'SENIOR_INVESTIGATIONS_OFFICER', 
  'ADMIN',
  'TEACHER_DEVELOPMENT_OFFICER',
  'TEACHER_DEVELOPMENT_MANAGER',
  'SENIOR_DEVELOPMENT_OFFICER',
  'APPEALS_OFFICER',
  'SENIOR_APPEALS_OFFICER',
  'APPEALS_MANAGER',
  'APPEALS_DIRECTOR'
];

// Helper functions
async function fetchWithErrorHandling(url: string, options: RequestInit, timeoutMs: number = 30000): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

const TOKEN_REFRESH_THRESHOLD = 5 * 60; // 5 minutes in seconds

async function fetchWithErrorHandlingAndTokenRefresh(url: string, options: RequestInit, timeoutMs: number = 30000): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Check and refresh token if needed
    const session = await getSession();
    if (session && session.auth) {
      const currentTime = Math.floor(Date.now() / 1000);
      const decodedToken = await decryptAccessToken(session.auth);
      
      if (decodedToken.exp - currentTime < TOKEN_REFRESH_THRESHOLD) {
        console.log("Token close to expiry, attempting refresh");
        const refreshSuccessful = await refreshToken();
        if (!refreshSuccessful) {
          throw new Error('Failed to refresh token');
        }
      }
    }

    // Get the latest session after potential refresh
    const updatedSession = await getSession();
    if (updatedSession && updatedSession.auth) {
      const headers = new Headers(options.headers || {});
      headers.set('Authorization', `Bearer ${updatedSession.auth.access_token}`);
      options = { ...options, headers };
    }

    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might have expired right after refresh, try refreshing one more time
        console.log("Received 401, attempting one more token refresh");
        const refreshSuccessful = await refreshToken();
        if (refreshSuccessful) {
          // Retry the request with the new token
          const finalSession = await getSession();
          if (finalSession && finalSession.auth) {
            const headers = new Headers(options.headers || {});
            headers.set('Authorization', `Bearer ${finalSession.auth.access_token}`);
            const retryResponse = await fetch(url, { ...options, headers, signal: controller.signal });
            if (retryResponse.ok) {
              return await retryResponse.json();
            }
          }
        }
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error) {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function encrypt(payload: any): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("3600 sec from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any | null> {

  try{
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  }catch (error){
    if(error instanceof errors.JWTExpired){
      return null;
    }
  }
}

export async function authenticate(_currentState: unknown, formData: FormData) {
  try {
    const authResponse = await login(formData);
    if (authResponse.access_token) {
      await DeTokenize(authResponse);
      return redirect('/trls/home');
    }
    return 'Authentication failed. Please try again.';
  } catch (error) {
    console.error('Authentication error:', error);
    return 'Authentication failed. Please try again.';
  }
}



export async function login(formData: FormData): Promise<AuthResponse> {
  const payload: LoginPayload = {
    username: formData.get('username') as string,
    password: formData.get('password') as string
  };

  return fetchWithErrorHandling(`${authUrl}`, {
    method: 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, 60000); // 60 seconds timeout because 1gov...
}

export async function login_email(formData: FormData): Promise<AuthResponse> {
  const payload: LoginPayload = {
    username: formData.get('username') as string,
    password: formData.get('password') as string
  };

  return fetchWithErrorHandling(`${emailauthUrl}`, {
    method: 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, 60000); // 60 seconds timeout because 1gov...
}

export async function validateOTP(username: string, otp: string): Promise<AuthResponse> {
  const payload: OTPPayload = { username, otp };

  return fetchWithErrorHandling(`${validateUrl}`, {
    method: 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function DeTokenize(authResponse: AuthResponse) {
  try {
    const decodedToken: DecodedToken = await fetchWithErrorHandling(`${DeTokenizeUrl}${authResponse.access_token}`, {
      method: 'POST',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
    });

    const expires = new Date(decodedToken.exp * 1000); // Convert expiration to milliseconds
    const session: Session = { 
      auth: authResponse
    };
    const encryptedSession = await encrypt(session);
    cookies().set("session", encryptedSession, { expires, httpOnly: true });
    
    redirect('/trls/home');
  } catch (error) {
    console.error('DeTokenize error:', error);
    throw error;
  }
}

export async function refreshTokenAction(refreshToken: string): Promise<boolean> {
  try {
    const refreshTokenEncoded = encodeURIComponent(refreshToken);
    const response = await fetch(`${iamURL}/auth/refresh-token?token=${refreshTokenEncoded}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to refresh token');
    
    const newAuthResponse: AuthResponse = await response.json();
    
    // Decrypt the token to get expiration
    const decodedToken = await decryptAccessToken(newAuthResponse);
    const expires = new Date(decodedToken.exp * 1000);

    const session: Session = { auth: newAuthResponse };
    const encryptedSession = await encrypt(session);
    
    cookies().set("session", encryptedSession, { 
      expires, 
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict'
    });

    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

export async function refreshToken(): Promise<boolean> {
  const session = await getSession();
  if (!session || !session.auth.refresh_token) return false;

  return refreshTokenAction(session.auth.refresh_token);
}

// const TOKEN_REFRESH_THRESHOLD = 29 * 60; // 5 minutes in seconds

export async function updateSession(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  if (!sessionCookie) return;

  try {
    const decryptPayload = await decrypt(sessionCookie);
    if(decryptPayload === null){
      cookies().delete("session");
      cookies().delete("access");
      return null;
    }
    let parsed = decryptPayload as Session; 
    const currentTime = Math.floor(Date.now() / 1000);

    const decodedToken: DecodedToken = await decryptAccessToken(parsed.auth);
    console.log("Difference: ",decodedToken.exp- currentTime, 'Threshold: ', TOKEN_REFRESH_THRESHOLD)
    if (decodedToken.exp - currentTime < TOKEN_REFRESH_THRESHOLD) {
      // Token is close to expiring, attempt to refresh
      const refreshSuccessful = await refreshToken();
      if (refreshSuccessful) {
        // If refresh was successful, we don't need to do anything else
        // The cookie has been updated in the refreshTokenAction
        return NextResponse.next();
      }
    }

    // If we didn't refresh, just return the next response
    return NextResponse.next();
  } catch (error) {
    console.error('Error updating session:', error);
    // If there's an error, clear the session cookie
    const res = NextResponse.next();
    res.cookies.delete("session");
    return res;
  }
}

export async function decryptAccessToken(authResponse: AuthResponse){
  try {
    const decodedToken: DecodedToken = await fetchWithErrorHandling(`${DeTokenizeUrl}${authResponse.access_token}`, {
      method: 'POST',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
    });
    return decodedToken;
  }catch(error){
    console.error('Decryption error', error);
    throw error;
  }
}

function findFirstValidPersona(personas: string[], userRoles: string[]): string {
  for (const persona of personas){
    if(userRoles.includes(persona)){
      return persona;
    }
  }
  // Return default or throw error if no valid persona found
  throw new Error('No valid persona found in user roles');
}

export async function storeAccessGroups(decodedToken: DecodedToken){
  try{
    const expires = new Date(Date.now() + 30 * 60 * 1000);
    const personas =  await getTrlsPersonas(decodedToken.realm_access.roles);

    const currentPersona = findFirstValidPersona(personas, ROLES);

    const access_group: AccessGroup = {
      persona: personas,
      current: currentPersona,
      username: decodedToken.name,
      userid: decodedToken.preferred_username,
      nationalId: decodedToken.national_id,
      passportId: decodedToken.passport_id,
      systemId: Number(decodedToken.client_id),
    }

    const encryptedAccessGroup = await encrypt(access_group);
    cookies().set('access', encryptedAccessGroup, {expires, httpOnly: true});
  } catch(error){
    throw error;
  }
}

export async function storeSession(authResponse: AuthResponse) {
  try{
    const expires = new Date(Date.now() + 30 * 60 * 1000);

    const session: Session = {
      auth: authResponse
    }
    
    const encryptedSession = await encrypt(session);
    await cookies().set("session", encryptedSession, { expires, httpOnly: true })
  } catch(error){
    throw error;
  }

}

export async function getTrlsPersonas(roles: string[]): Promise<UserRole[]> {
  return roles.filter(role => ROLES.includes(role as UserRole)) as UserRole[];
}


export async function getAccessGroups(): Promise<AccessGroup | null>{
  const encryptedAccessGroup = cookies().get("access")?.value;
  if (!encryptedAccessGroup) return null;
  const decryptedPayload = await decrypt(encryptedAccessGroup);
  if (decryptedPayload === null) {
    // cookies().delete("access");
    // cookies().delete("session");
    return null;
  }
  return decryptedPayload;
}

export async function getSession(): Promise<Session | null> {
  const encryptedSession = cookies().get("session")?.value;
  
  if (!encryptedSession) return null;
  const decryptedPayload = await decrypt(encryptedSession);
  if (decryptedPayload === null) {
    return null;
  }
  return decryptedPayload;
}

export async function updateAccessGroup(newCurrentPersona: string): Promise<void> {
  try {
    // Get the current AccessGroup
    const currentAccessGroup = await getAccessGroups();
    
    if (!currentAccessGroup) {
      throw new Error('No access group found');
    }

    // Check if the new persona is valid
    if (!currentAccessGroup.persona.includes(newCurrentPersona)) {
      throw new Error('Invalid persona');
    }

    // Create updated AccessGroup
    const updatedAccessGroup: AccessGroup = {
      ...currentAccessGroup,
      current: newCurrentPersona
    };

    // Encrypt and store the updated AccessGroup
    const encryptedAccessGroup = await encrypt(updatedAccessGroup);
    
    // Set expiration time (30 minutes from now)
    const expires = new Date(Date.now() + 30 * 60 * 1000);

    // Update the cookie
    cookies().set('access', encryptedAccessGroup, { expires, httpOnly: true });
    redirect('/trls/home')
  } catch (error) {
    console.error('Error updating access group:', error);
    throw error;
  }
}

export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
  cookies().set("access", "", { expires: new Date(0) });
  revalidatePath('/trls/home');
  redirect('/welcome');
}

// Main functions
export async function getRole(): Promise<string | null> {
  const access = await getAccessGroups();

  if (!access) {
    redirect('/welcome');
    return null
  }
  return access?.current ?? null;
}