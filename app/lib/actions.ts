"use server"

import { cookies } from 'next/headers';
import { revalidateTag } from "next/cache";
import { apiUrl, licUrl } from "./store";
import { DecodedToken, Session } from './types';
import { decryptAccessToken, getSession, refreshToken } from '../auth/auth';
import { redirect } from 'next/navigation';
import { options } from './schema';


async function fetchWithAuth1(url: string, options: RequestInit = {}, timeoutMs: number = 30000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let session = await getSession();
    const time = await session?.expires || '';

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

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    return response;
  } catch (error) {
    if (error === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

const TOKEN_REFRESH_THRESHOLD = 5 * 60; // 29 minutes in seconds

async function fetchWithAuth(url: string, options: RequestInit = {}, timeoutMs: number = 30000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let session = await getSession();

    if (session && session.auth) {
      const currentTime = Math.floor(Date.now() / 1000);
      const decodedToken: DecodedToken = await decryptAccessToken(session.auth);

      // console.log("Difference: ", decodedToken.exp - currentTime, 'Threshold: ', TOKEN_REFRESH_THRESHOLD);

      if (decodedToken.exp - currentTime < TOKEN_REFRESH_THRESHOLD) {
        // console.log("Token is close to expiring, attempting to refresh");
        const refreshSuccessful = await refreshToken();
        if (refreshSuccessful) {
          // console.log("Token refresh successful");
          session = await getSession(); // Get the updated session
        } else {
          // console.log("Token refresh failed");
          throw new Error('Session expired and refresh failed');
        }
      }
    } else {
      // console.log("No valid session found");
      throw new Error('No valid session');
    }

    const headers = new Headers(options.headers);
    
    if (session?.auth?.access_token) {
      headers.set('Authorization', `Bearer ${session.auth.access_token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });

    // Handle 401 errors (Unauthorized) by attempting one more token refresh
    if (response.status === 401) {
      // console.log("Received 401, attempting one more token refresh");
      const refreshSuccessful = await refreshToken();
      if (refreshSuccessful) {
        session = await getSession(); // Get the updated session
        if (session?.auth?.access_token) {
          headers.set('Authorization', `Bearer ${session.auth.access_token}`);
          return fetch(url, {
            ...options,
            headers,
            signal: controller.signal
          });
        }
      }
    }

    return response;
  } catch (error) {
    if (error) {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    console.error('Error in fetchWithAuth:', error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
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

export async function searchById(id: string){
  try{
    const res = await fetchWithAuth(`${apiUrl}/search-record/?search=${id}`, { cache: 'no-cache' });
    if (!res.ok || res.status !== 200) return null;
    return res.headers.get('content-type')?.startsWith('application/json') ? res.json() : null;
  } catch (error){
    console.error('Error fetching record', error)
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

export async function ReturnToCustomer(id: string, status: string, items: (string | undefined)[]) {

  const res = await fetchWithAuth(`${apiUrl}/customer-action/${id}?reg_status=${status}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "reg_status":status,
      items
    }),
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

export async function getStatuses() {
  const res = await fetchWithAuth(`${apiUrl}/Status-Statistics-Graph/`);
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

export async  function ConvertTime(time: string){
  return new Intl.DateTimeFormat("en-US", options).format(new Date(time))
}

export async function getRelativeTime(updateTime: string) {
  const now = new Date();
  const updated = new Date(updateTime);
  const diffSeconds = Math.floor((now.getTime() - updated.getTime()) / 1000);
  
  if (diffSeconds < 60) {
      return "Updated seconds ago";
  } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `Updated ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600);
      return `Updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffSeconds < 604800) {
      const days = Math.floor(diffSeconds / 86400);
      if (days === 1) {
          return "Updated a day ago";
      } else {
          return `Updated ${days} days ago`;
      }
  } else if (diffSeconds < 2592000) {
      const weeks = Math.floor(diffSeconds / 604800);
      if (weeks === 1) {
          return "Updated a week ago";
      } else {
          return `Updated ${weeks} weeks ago`;
      }
  } else if (diffSeconds < 31536000) {
      const months = Math.floor(diffSeconds / 2592000);
      if (months === 1) {
          return "Updated a month ago";
      } else {
          return `Updated ${months} months ago`;
      }
  } else {
      const years = Math.floor(diffSeconds / 31536000);
      if (years === 1) {
          return "Updated a year ago";
      } else {
          return `Updated ${years} years ago`;
      }
  }
}

export async function getSLAStatus(createdAt: string) {
  const created = new Date(createdAt);
  const today = new Date();
  const diffTime = today.getTime() - created.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const remainingDays = 30 - diffDays;

  let badgeColor = "bg-green-100 text-green-800";
  let displayText = `${remainingDays} days left`;

  if (remainingDays <= 5 && remainingDays > 0) {
      badgeColor = "bg-yellow-100 text-yellow-800";
  } else if (remainingDays <= 0) {
      badgeColor = "bg-red-100 text-red-800";
      const overdueDays = Math.abs(remainingDays);
      displayText = `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`;
  }

  return { badgeColor, displayText };
}