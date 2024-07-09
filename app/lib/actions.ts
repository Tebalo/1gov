"use server"

import { cookies } from 'next/headers';
import { revalidateTag } from "next/cache";
import { apiUrl, devUrl, licUrl } from "./store";
import { Session } from './types';
import { getSession, refreshToken } from '../auth/auth';
import { redirect } from 'next/navigation';




// Helper function for API calls
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let session = await getSession();
  const time = await session?.expires || ''
  //console.log('Expires', time)
  console.log('URL', url)
  console.log('SESSION', session?.auth)

  if (!session || new Date(time) <= new Date()) {
    const refreshed = await refreshToken();
    if (!refreshed) {
      throw new Error('Session expired and refresh failed');
    }
    session = await getSession();
  }

  const headers = new Headers(options.headers);
  
  if (session?.auth?.access_token) {
    headers.set('Authorization', `Bearer ${session.auth.access_token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

export async function logout() {
  await cookies().set("session", "", { expires: new Date(0) });
  return redirect('/welcome');
  // Redirect logic should be handled on the client side
}

export async function authenticate(_currentState: unknown, formData: FormData) {
  // Implementation depends on your authentication mechanism
  // This should be handled by your auth provider (e.g., NextAuth.js)
}

export async function revalidate(params: string) {
  revalidateTag(params);
}

export async function getAll() {
  const res = await fetchWithAuth(`${apiUrl}/teacher_registrations/`);
  if (!res.ok) return [];
  return res.json();
}

export async function getRegApplications(status: string, count: string) {
  try {
    const res = await fetchWithAuth(`${apiUrl}/GetRegistrationsByCount?reg_status=${status}&count=${count}`);
    return res.ok && res.headers.get('content-type')?.startsWith('application/json') ? res.json() : [];
  } catch (error) {
    console.error('Error fetching registration applications:', error);
    return [];
  }
}

export async function getLicenseApplications(status: string, count: string) {
  try {
    const res = await fetchWithAuth(`${licUrl}/getLicensesByCount?reg_status=${status}&count=${count}`);
    return res.ok && res.headers.get('content-type')?.startsWith('application/json') ? res.json() : [];
  } catch (error) {
    console.error('Error fetching license applications:', error);
    return [];
  }
}

export async function getEndorsementRecords(status: string, count: string) {
  try {
    const res = await fetchWithAuth(`${apiUrl}/GetRegistrationsByCount?endorsement_status=${status}&count=${count}`);
    return res.ok && res.headers.get('content-type')?.startsWith('application/json') ? res.json() : [];
  } catch (error) {
    console.error('Error fetching endorsement records:', error);
    return [];
  }
}

export async function getLicenseEndorsementRecords(status: string, count: string) {
  try {
    const res = await fetchWithAuth(`${licUrl}/getLicensesByCount?endorsement_status=${status}&count=${count}`);
    return res.ok && res.headers.get('content-type')?.startsWith('application/json') ? res.json() : [];
  } catch (error) {
    console.error('Error fetching license endorsement records:', error);
    return [];
  }
}

export async function getNext(status: string) {
  try {
    const res = await fetchWithAuth(`${apiUrl}/getNext/?reg_status=${status}`, { cache: 'no-cache' });
    if (!res.ok || res.status !== 200) return null;
    return res.headers.get('content-type')?.startsWith('application/json') ? res.json() : null;
  } catch (error) {
    console.error('Error fetching next item:', error);
    return null;
  }
}

export async function getNextLicense(status: string) {
  try {
    const res = await fetchWithAuth(`${licUrl}/getNext/?reg_status=${status}`, { cache: 'no-cache' });
    if (!res.ok || res.status === 204) return null;
    return res.headers.get('content-type')?.startsWith('application/json') ? res.json() : null;
  } catch (error) {
    console.error('Error fetching next license:', error);
    return null;
  }
}

export async function getRegById(Id: string) {
  revalidateTag('work');
  try {
    const res = await fetchWithAuth(`${apiUrl}/teacher_registrations/${Id}`, { next: { tags: ['work'] } });
    if (!res.ok) {
      if (res.status === 204) return null;
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching registration by ID:', error);
    return null;
  }
}

export async function getLicenseById(Id: string) {
  try {
    const res = await fetchWithAuth(`${licUrl}/license-data/${Id}`, { cache: 'no-cache' });
    if (!res.ok) {
      if (res.status === 204) return null;
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching license by ID:', error);
    return null;
  }
}

export async function UpdateStatus(id: string, status: string) {
  const res = await fetchWithAuth(`${apiUrl}/teacher_registrations/${id}?reg_status=${status}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.status;
}

export async function UpdateLicenseStatus(id: string, status: string) {
  const res = await fetchWithAuth(`${licUrl}/license_applications/${id}?reg_status=${status}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.status;
}

export async function GetReports() {
  const res = await fetchWithAuth(`${apiUrl}/StatisticalReports/`);
  return res.json();
}

export async function getMonthlyTeacherRegistrations() {
  const res = await fetchWithAuth(`${apiUrl}/Monthly-Statistics/`);
  return res.json();
}

export async function getTeacherRegistrationsByStatus() {
  const res = await fetchWithAuth(`${apiUrl}/Status-Statistics/`);
  return res.json();
}

export async function UpdateLicenseEndorsementStatus(id: string, status: string) {
  const res = await fetchWithAuth(`${licUrl}/license_applications/${id}?endorsement_status=${status}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.status;
}

export async function UpdateEndorsementStatus(id: string, status: string) {
  const res = await fetchWithAuth(`${apiUrl}/teacher_registrations/${id}?endorsement_status=${status}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.status;
}

export async function BulkRegistrationUpdate(data: string) {
  const jsonData = JSON.parse(data);
  const res = await fetchWithAuth(`${apiUrl}/processBulkRegistrations/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonData),
  });
  return res.status;
}