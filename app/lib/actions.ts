"use server"

// import { cookies } from 'next/headers';
import { revalidateTag } from "next/cache";
import { apiUrl, invUrl, licUrl } from "./store";
import { Activity, ActivityListResponse, ActivityObject, ActivityPayload, ActivityResponse, ComplaintPayload, ComplaintSearchResponse, DecodedToken, Investigation, InvestigationResponse, ReportPayload, ReportResponse, Session, TipOffListResponse, TipOffPayload, TipOffResponse } from './types';
import { decryptAccessToken, getSession, refreshToken } from '../auth/auth';
import { redirect } from 'next/navigation';
import { options } from './schema';


async function fetchWithAuth1(url: string, options: RequestInit = {}, timeoutMs: number = 120000): Promise<Response> {
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

const TOKEN_REFRESH_THRESHOLD = 18 * 60; // 8 minutes in seconds

async function fetchWithAuth(url: string, options: RequestInit = {}, timeoutMs: number = 120000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  console.log('URL',url)
  try {
    let session = await getSession();

    if (session && session.auth) {
      const currentTime = Math.floor(Date.now() / 1000);
      const decodedToken: DecodedToken = await decryptAccessToken(session.auth);

      console.log("Difference: ", decodedToken.exp - currentTime, 'Threshold: ', TOKEN_REFRESH_THRESHOLD);

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

export async function createComplaint(payload: ComplaintPayload): Promise<{success: boolean, code: number; message: string, data?: any }> {
  try {

    const stringifiedPayload = JSON.stringify(payload, null, 2);

    const response = await fetch(`${invUrl}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: stringifiedPayload
    });

    // console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Get the raw response text first
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (parseError) {
        errorMessage = `HTTP error! status: ${response.status}. Raw response: ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    let result;
    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } else {
      result = { message: 'Success', code: response.status, data: null };
    }

    return {
      success: true,
      code: response.status,
      message: result.message || 'Success',
      data: result
    };

  } catch (error) {
    console.error('Error adding complaint:', error);
    return {
      success: false,
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to add complaint. Please try again'
    };
  }
}

export async function updateComplaintStatus(ID: string, status: string): Promise<{code: number; message: string}> {
  try {


    const response = await fetch(`${invUrl}/update-status/${ID}?reg_status=${status}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });


    // Get the raw response text first
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (parseError) {
        errorMessage = `HTTP error! status: ${response.status}. Raw response: ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    let result;
    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } else {
      result = { message: 'Success', code: response.status, data: null };
    }

    return {
      code: response.status,
      message: result.message || 'Success',
    };

  } catch (error) {
    console.error('Error adding complaint:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to add complaint. Please try again'
    };
  }
}

export async function searchComplaintByInquiry(ID: string): Promise<ComplaintSearchResponse> {
  try {


    const response = await fetch(`${invUrl}/searchRecord?search=${ID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

    });

    // console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (parseError) {
        errorMessage = `HTTP error! status: ${response.status}. Raw response: ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    let result;
    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } else {
      result = { message: 'Success', code: response.status, data: null };
    }

    return {
      code: response.status,
      reporter: result
    };

  } catch (error) {
    console.error('Error adding complaint:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
    };
  }
}

export async function createTipOff(payload: TipOffPayload): Promise<TipOffResponse> {
  try {

    const stringifiedPayload = JSON.stringify(payload, null, 2);

    const response = await fetch(`${invUrl}/add-tipoff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: stringifiedPayload
    });

    // console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Get the raw response text first
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (parseError) {
        errorMessage = `HTTP error! status: ${response.status}. Raw response: ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    let result;
    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } else {
      result = { message: 'Success', code: response.status, data: null };
    }

    return {
      message: result.message || 'Success',
      code: response.status,
      data: result
    };

  } catch (error) {
    console.error('Error adding complaint:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to add complaint. Please try again',
    };
  }
}

export async function createReport(payload: ReportPayload, ID: string): Promise<ReportResponse> {
  try {
    console.log(payload)
    const stringifiedPayload = JSON.stringify(payload, null, 2);

    const response = await fetch(`${invUrl}/update-preliminary-investigations/${ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: stringifiedPayload
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (parseError) {
        errorMessage = `HTTP error! status: ${response.status}. Raw response: ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    let result;
    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } else {
      result = { message: 'Success', code: response.status, data: null };
    }

    return {
      message: result.message || 'Success',
      code: response.status,
    };

  } catch (error) {
    console.error('Error adding complaint:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to add complaint. Please try again',
    };
  }
}

export async function getReportRecordById(Id: string) {
  try {
    const res = await fetchWithAuth(`${invUrl}/preliminary-investigations/${Id}`, { cache: 'no-cache' } );

    if (!res.ok) {
      if (res.status === 200) return null;
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching record by ID:', error);
    return null;
  }
}

export async function createActivity(payload: ActivityPayload): Promise<ActivityResponse> {
  console.log(payload)
  try {

    const stringifiedPayload = JSON.stringify(payload, null, 2);

    const response = await fetch(`${invUrl}/activity-diaries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: stringifiedPayload
    });

    // console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Get the raw response text first
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (parseError) {
        errorMessage = `HTTP error! status: ${response.status}. Raw response: ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    let result;
    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } else {
      result = { message: 'Success', code: response.status, data: null };
    }

    return {
      message: result.message || 'Success',
      code: response.status,
      data: result
    };

  } catch (error) {
    console.error('Error adding complaint:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to add complaint. Please try again',
    };
  }
}

export async function getActivityByNumber(ID: string): Promise<ActivityObject> {
  try {


    const response = await fetch(`${invUrl}/activity-diaries/${ID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

    });

    // console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (parseError) {
        errorMessage = `HTTP error! status: ${response.status}. Raw response: ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    let result;
    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } else {
      result = { message: 'Success', code: response.status, data: null };
    }
    return {
      code: response.status,
      data: result
    };

  } catch (error) {
    console.error('Error adding complaint:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
    };
  }
}

export async function getTipOffRecordById(Id: string) {
  try {
    const res = await fetchWithAuth(`${invUrl}/get-tipoff/${Id}`, { cache: 'no-cache' } );

    if (!res.ok) {
      if (res.status === 200) return null;
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching record by ID:', error);
    return null;
  }
}

export async function getTipOffById(ID: string): Promise<TipOffResponse> {
  try {


    const response = await fetch(`${invUrl}/get-tipoff/${ID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

    });

    // console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (parseError) {
        errorMessage = `HTTP error! status: ${response.status}. Raw response: ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    let result;
    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } else {
      result = { message: 'Success', code: response.status, data: null };
    }

    return {
      code: response.status,
      data: result
    };

  } catch (error) {
    console.error('Error adding complaint:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
    };
  }
}

export async function getTipOffs(status: string, count: number): Promise<TipOffListResponse> {
  try {


    const response = await fetch(`${invUrl}/get-tipoff-list?reg_status=${status}&count=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

    });

    //console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    const responseText = await response.text();
    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (parseError) {
        errorMessage = `HTTP error! status: ${response.status}. Raw response: ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    let result;
    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } else {
      result = { message: 'Success', code: response.status, data: null };
    }

    return {
      code: response.status,
      data: result
    };

  } catch (error) {
    console.error('Error adding complaint:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
    };
  }
}

export async function getUserActivities(userid: string, count: number): Promise<ActivityListResponse> {
  try {


    const response = await fetch(`${invUrl}/user-activities?userid=${userid}&count=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

    });

    //console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    const responseText = await response.text();
    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (parseError) {
        errorMessage = `HTTP error! status: ${response.status}. Raw response: ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    let result;
    if (responseText) {
      try {
        result = JSON.parse(responseText);
        console.log(result)
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } else {
      result = { message: 'Success', code: response.status, data: null };
    }

    return {
      code: response.status,
      data: result
    };

  } catch (error) {
    console.error('Error adding complaint:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
    };
  }
}

// export async function logout() {
//   await cookies().set("session", "", { expires: new Date(0) });
//   return redirect('/welcome');
//   // Redirect logic should be handled on the client side
// }

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

// export async function getInvestigations(status: string, count: string) {
//   try {
//     const res = await fetchWithAuth(`${apiUrl}/GetRegistrationsByCount?reg_status=${status}&count=${count}`);
//     return res.ok && res.headers.get('content-type')?.startsWith('application/json') ? res.json() : [];
//   } catch (error) {
//     console.error('Error fetching registration applications:', error);
//     return [];
//   }
// }


interface Complaint {
  crime_location: string;
  nature_of_crime: string;
  date: string;
  time: string;
  status: string;
  bif_number: string;
  case_number: string;
  fir_number: string;
  outcome: string;
}

const locations = ['Gaborone', 'Francistown', 'Maun', 'Serowe', 'Molepolole'];
const crimes = ['Theft', 'Assault', 'Fraud', 'Burglary', 'Vandalism'];
const outcomes = ['Pending', 'Resolved', 'Under Investigation', 'Closed', 'Referred'];

interface Complaint {
  crime_location: string;
  nature_of_crime: string;
  date: string;
  time: string;
  status: string;
  bif_number: string;
  case_number: string;
  fir_number: string;
  outcome: string;
}

interface InvestigationsResponse {
  status: string;
  count: number;
  data: Complaint[];
}

export async function getInvRecords(status: string, count: string){
  try{
    const res = await fetchWithAuth(`${invUrl}/get-list?reg_status=${status}&count=${count}`);
    return res.ok && res.headers.get('content-type')?.startsWith('application/json') ? res.json() : [];
  }catch(error){
    console.error('Error fetching records:', error);
    return [];
  }
}

export async function getInvestigations(status: string, count: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Expanded mock data with varied statuses
  const mockComplaints: Complaint[] = [
    {
      crime_location: "Gaborone",
      nature_of_crime: "Theft",
      date: "2024-10-01",
      time: "14:00",
      status: "Registered",
      bif_number: "BIF123456",
      case_number: "CASE789",
      fir_number: "FIR456",
      outcome: "Pending"
    },
    {
      crime_location: "Francistown",
      nature_of_crime: "Assault",
      date: "2024-09-15",
      time: "22:30",
      status: "Under Investigation",
      bif_number: "BIF789012",
      case_number: "CASE345",
      fir_number: "FIR789",
      outcome: "Under Investigation"
    },
    {
      crime_location: "Maun",
      nature_of_crime: "Fraud",
      date: "2024-10-05",
      time: "09:15",
      status: "Closed",
      bif_number: "BIF345678",
      case_number: "CASE012",
      fir_number: "FIR123",
      outcome: "Resolved"
    },
    {
      crime_location: "Serowe",
      nature_of_crime: "Burglary",
      date: "2024-09-28",
      time: "03:45",
      status: "Registered",
      bif_number: "BIF901234",
      case_number: "CASE567",
      fir_number: "FIR234",
      outcome: "Pending"
    },
    {
      crime_location: "Molepolole",
      nature_of_crime: "Vandalism",
      date: "2024-10-10",
      time: "16:20",
      status: "Under Investigation",
      bif_number: "BIF567890",
      case_number: "CASE901",
      fir_number: "FIR567",
      outcome: "Under Investigation"
    }
  ];

  // Filter complaints based on status (case-insensitive)
  const filteredComplaints = mockComplaints.filter(complaint => {
    if (status.toLowerCase() === 'all') return true;
    return complaint.status.toLowerCase() === status.toLowerCase();
  });

  // Limit the number of returned complaints based on count
  const limitedComplaints = filteredComplaints.slice(0, parseInt(count));

  // Create the response object
  const response: InvestigationsResponse = {
    status: status,
    count: limitedComplaints.length,
    data: limitedComplaints
  };

  // Return the response as a JSON string
  return JSON.stringify(response);
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

export async function getInvRecordById(Id: string) {
  try {
    const res = await fetchWithAuth(`${invUrl}/complaints/${Id}`, { cache: 'no-cache' } );
    console.log('status',res.status)
    if (!res.ok) {
      if (res.status === 200) return null;
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching record by ID:', error);
    return null;
  }
}

export async function updateCaseById(code: string, updateData: Investigation | null): Promise<{success: boolean, code: number; data: Promise<any> }> {
  
  try {
    const response = await fetch(`${invUrl}/update-application/${code}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // const result = ;
    // const result = await response.json();
    return await {success: true, code: response.status, data: response.json()};
  } catch (error) {
    console.error('Error updating case:', error);
    throw error;
  }
}

export async function getInvById(Id: string) {
  // Simulating an async operation
  await new Promise(resolve => setTimeout(resolve, 100));

  // Sample data
  const sampleData = {
    "reporter": {
        "id": 1,
        "name": "Bopaki Tebalo",
        "contact_number": "123456789",
        "Omang_id": "440418213",
        "passport_no": "P123456",
        "occupation": "Engineer",
        "sex": "Male",
        "nationality": "Botswana",
        "address": "123 Main Street",
        "reg_status": "Incoming ",
        "inquiry_number": "INQ2024-10-00001",
        "case_number": null,
        "anonymous": null,
        "submission_type": null,
        "created_at": "2024-10-26T19:20:00.000000Z",
        "updated_at": "2024-10-26T19:20:00.000000Z"
    },
    "complaint": {
        "id": 1,
        "crime_location": "Gaborone",
        "inquiry_number": "INQ2024-10-00001",
        "nature_of_crime": "Theft",
        "date": "2024-10-01",
        "time": "14:00:00",
        "bif_number": "BIF123456",
        "case_number": "CASE789",
        "fir_number": "FIR456",
        "outcome": "Pending",
        "created_at": "2024-10-26T19:20:00.000000Z",
        "updated_at": "2024-10-26T19:20:00.000000Z"
    },
    "offender": {
        "id": 1,
        "name": "Jane Smith",
        "sex": "Female",
        "inquiry_number": "INQ2024-10-00001",
        "nationality": "Botswana",
        "dob": "1990-01-01",
        "age": 34,
        "contact_number": "987654321",
        "id_passport_number": "ID987654",
        "address": "456 Side Street",
        "ward": "Ward 1",
        "occupation": "Teacher",
        "place_of_work": "XYZ School",
        "created_at": "2024-10-26T19:20:00.000000Z",
        "updated_at": "2024-10-26T19:20:00.000000Z"
    },
    "investigation": {
        "id": 1,
        "inquiry_number": "INQ2024-10-00001",
        "investigating_officer": "Officer Brown",
        "police_station": "Gaborone Police Station",
        "cr_number": "CR123456",
        "offence": "Theft",
        "outcome": "Under investigation",
        "created_at": "2024-10-26T19:20:00.000000Z",
        "updated_at": "2024-10-26T19:20:00.000000Z"
    }
};

  return sampleData;
}

export async function getComplaintsById(Id: string): Promise<InvestigationResponse> {
  try {
    const response = await fetchWithAuth(`${invUrl}/complaints/${Id}`, { cache: 'no-cache' });

    // Get the raw response text first
    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (parseError) {
        errorMessage = `HTTP error! status: ${response.status}. Raw response: ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    let result;
    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } else {
      result = { message: 'Success', code: response.status, data: null };
    }

    return {
      code: response.status,
      data: result.data || result,
    };

  } catch (error) {
    console.error('Error fetching record by ID:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to fetch record. Please try again'
    };
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

export async function UpdateStatus(id: string, status: string, rejection_reason: string) {
  const res = await fetchWithAuth(`${apiUrl}/teacher_registrations/${id}?reg_status=${status}&rejection_reason=${rejection_reason}`, {
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