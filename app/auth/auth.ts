'use server'

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { DeTokenizeUrl, authUrl, secretKey, validateUrl } from '../lib/store';
import { revalidatePath } from 'next/cache';
import { AccessGroup, AuthResponse, DecodedToken, LoginPayload, OTPPayload, Session, UserRole } from '../lib/types';

// Constants
const key = new TextEncoder().encode(secretKey);
const ROLES: UserRole[] = ['REGISTRATION_OFFICER', 'MANAGER', 'SNR_REGISTRATION_OFFICER', 'DIRECTOR', 'REGISTRAR', 'LICENSE_OFFICER', 'SNR_LICENSE_OFFICER', 'LICENSE_MANAGER', 'ADMIN'];

// Helper functions
async function fetchWithErrorHandling(url: string, options: RequestInit): Promise<any> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function encrypt(payload: any): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("3600 sec from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
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

export async function refreshToken(): Promise<boolean> {
  const session = await getSession();
  if (!session || !session.auth.refresh_token) return false;

  try {
    const refreshTokenEncoded = encodeURIComponent(session.auth.refresh_token);
    const response = await fetch(`${authUrl}/auth/refresh-token?token=${refreshTokenEncoded}`, {
      method: 'POST', // Changed to GET since we're passing the token as a URL parameter
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to refresh token');
    
    const newAuthResponse: AuthResponse = await response.json();
    await DeTokenize(newAuthResponse);
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
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
  });
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

export async function storeSession(authResponse: AuthResponse){
  try{
    const session: Session = {
      auth: authResponse,
      expires: new Date(Date.now() + 1800 * 1000).toString(),
    }
    const profile = await decryptAccessToken(authResponse)
    await storeAccessGroups(profile)
    const expires = new Date(Date.now() + session.auth.expires_in * 1000);
    const encryptedSession = await encrypt(session)
    cookies().set("session", encryptedSession, {expires, httpOnly: true});
    redirect('/trls/home');
  }catch (error){
    throw error
  }
}

export async function getTrlsPersonas(roles: string[]): Promise<UserRole[]> {
  return roles.filter(role => ROLES.includes(role as UserRole)) as UserRole[];
}

export async function storeAccessGroups(decodedToken: DecodedToken){
  try{
    const expires = new Date(Date.now() + 3600 * 1000);
    const personas =  await getTrlsPersonas(decodedToken.realm_access.roles);
    const access_group: AccessGroup = {
      persona: personas,
      current: personas[0],
      username: decodedToken.name
    }
    const encryptedAccessGroup = await encrypt(access_group);
    cookies().set('access', encryptedAccessGroup, {expires, httpOnly: true});
  } catch(error){
    throw error;
  }
}
export async function getAccessGroups(): Promise<AccessGroup | null>{
  const encryptedAccessGroup = cookies().get("access")?.value;
  if (!encryptedAccessGroup) return null;
  return decrypt(encryptedAccessGroup);
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
    const expires = new Date(Date.now() + 3600 * 1000);

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

export async function getSession(): Promise<Session | null> {
  const encryptedSession = cookies().get("session")?.value;
  
  if (!encryptedSession) return null;
  return decrypt(encryptedSession);
}


const TOKEN_REFRESH_THRESHOLD = 5 * 60; // 5 minutes in seconds

export async function updateSession(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  if (!sessionCookie) return;

  try {
    let parsed: Session = await decrypt(sessionCookie);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    // Decode the access token to get more accurate expiration information
    const decodedToken: DecodedToken = await decryptAccessToken(parsed.auth);

    // Check if token is close to expiration
    if (decodedToken.exp - currentTime < TOKEN_REFRESH_THRESHOLD) {
      // Token is close to expiring, attempt to refresh
      const refreshSuccessful = await refreshToken();
      if (refreshSuccessful) {
        // If refresh was successful, get the updated session
        const updatedSessionCookie = request.cookies.get("session")?.value;
        if (updatedSessionCookie) {
          parsed = await decrypt(updatedSessionCookie);
        }
      }
    }

    // Update the expiration time based on the token's exp claim
    const newExpirationTime = new Date(decodedToken.exp * 1000);
    parsed.expires = newExpirationTime.toString();

    const res = NextResponse.next();
    res.cookies.set({
      name: "session",
      value: await encrypt(parsed),
      httpOnly: true,
      expires: newExpirationTime,
    });
    return res;
  } catch (error) {
    console.error('Error updating session:', error);
    // If there's an error, clear the session cookie
    const res = NextResponse.next();
    res.cookies.delete("session");
    return res;
  }
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