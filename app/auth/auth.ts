'use server'

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { DeTokenizeUrl, authUrl, secretKey, validateUrl } from '../lib/store';
import { revalidatePath } from 'next/cache';
import { AuthResponse, DecodedToken, LoginPayload, OTPPayload, Session, UserRole } from '../lib/types';

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

// Main functions
export async function getRole(): Promise<UserRole | ''> {
  const session = await getSession();
  if (!session?.user?.realm_access) {
    redirect('/welcome');
  }
  return ROLES.find(role => session.user.realm_access?.roles.includes(role)) || '';
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
    const response = await fetch(`${authUrl}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.auth.refresh_token }),
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
      auth: authResponse, 
      user: decodedToken, 
      expires 
    };
    const encryptedSession = await encrypt(session);
    cookies().set("session", encryptedSession, { expires, httpOnly: true });
    
    redirect('/trls/home');
  } catch (error) {
    console.error('DeTokenize error:', error);
    throw error;
  }
}

export async function logout() {
  revalidatePath('/trls/home');
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession(): Promise<Session | null> {
  const encryptedSession = cookies().get("session")?.value;
  if (!encryptedSession) return null;
  return decrypt(encryptedSession);
}


export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed: Session = await decrypt(session);
  parsed.expires = new Date(Date.now() + 3600 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}