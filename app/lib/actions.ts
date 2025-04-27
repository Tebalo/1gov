"use server"

// import { cookies } from 'next/headers';
import { revalidateTag } from "next/cache";
import { apiUrl, appealUrl, cpdUrl, deltaCategoryUrl, invUrl, licUrl, renewalUrl, restorationUrl, revocationUrl, studentTeacherUrl } from "./store";
import {  Appeals_list, ActivityListResponse, ActivityObject, ActivityPayload, ActivityResponse, ComplaintPayload, ComplaintSearchResponse, CPDListResponse, CPDResponseGet, DecodedToken, Investigation, InvestigationResponse, ReportPayload, ReportResponse, TipOffListResponse, TipOffPayload, TipOffResponse, appeal, TeacherRegistrationResponse, InvestigationReportPayload } from './types';
import { decryptAccessToken, getAccessGroups, getSession, refreshToken } from '../auth/auth';
import { options } from './schema';
import { RevocationListResponse } from "../components/Home/components/revocation/types/revocation";
import { RevocationResponse } from "../(portal)/trls/work/revocation/types/revocation-type";
import { RestorationListResponse } from "../components/Home/components/restoration/types/restoration";
import { RenewalListResponse } from "../components/Home/components/renewal/types/renewal";

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

//const TOKEN_REFRESH_THRESHOLD = 18 * 60; // 8 minutes in seconds
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ChangeOfCategoryResponse } from "../(portal)/trls/work/changeofcategory/types/changeofcategory-type";
import { RestorationResponse } from "../(portal)/trls/work/restoration/types/restoration-type";
import { endorsement_status } from "../components/Home/data/data";
import { InvestigationResponseList } from "../components/Home/components/investigations-table";
import { StudentTeacherListResponse } from "../components/Home/components/studentteacher/types/studentteacher";
import { StudentTeacherResponse } from "../(portal)/trls/work/student-teacher/types/student-type";
//import { DecodedToken } from '@/types'; // Adjust import path as needed

const TOKEN_REFRESH_THRESHOLD = 300; // 5 minutes in seconds

// Create a custom axios instance
const axiosInstance: AxiosInstance = axios.create({
  timeout: 120000, // Default timeout of 120 seconds
});

async function fetchWithAuth(
  url: string,
  options: AxiosRequestConfig = {},
  timeoutMs: number = 160000,
  maxRetries: number = 3
): Promise<AxiosResponse> {
  let retryCount = 0;

  // Configure axios instance with custom timeout
  axiosInstance.defaults.timeout = timeoutMs;

  // Create retry handler
  const handleRetry = async (error: any): Promise<AxiosResponse> => {
    if (retryCount < maxRetries) {
      retryCount++;
      const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
    
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      return attemptRequest();
    }
    throw error;
  };

  // Add request interceptor for token management
  axiosInstance.interceptors.request.use(async (config) => {
    try {
      let session = await getSession();
      let groups = await getAccessGroups();

      if (!session?.auth?.access_token) {
        throw new Error('No valid session or access token');
      }

      const decodedToken: DecodedToken = await decryptAccessToken(session.auth);
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token needs refresh
      if (decodedToken.exp - currentTime < TOKEN_REFRESH_THRESHOLD) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          throw new Error('Token refresh failed');
        }
        session = await getSession();
        if (!session?.auth?.access_token) {
          throw new Error('Invalid session after refresh');
        }
      }

      // Set the Authorization header
      config.headers.Authorization = `Bearer ${session.auth.access_token}`;
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      throw error;
    }
  });

  // Add response interceptor for handling 401s
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          const refreshed = await refreshToken();
          if (!refreshed) {
            throw new Error('Token refresh failed on 401');
          }

          const newSession = await getSession();
          if (!newSession?.auth?.access_token) {
            throw new Error('Invalid session after 401 refresh');
          }

          // Retry the original request with new token
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${newSession.auth.access_token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Error handling 401:', refreshError);
          throw new Error('Authentication failed after refresh attempt');
        }
      }
      return Promise.reject(error);
    }
  );

  // Main request function
  async function attemptRequest(): Promise<AxiosResponse> {
    try {
      const response = await axiosInstance({
        url,
        ...options,
      });
      return response;
    } catch (error: any) {
      // Handle timeout and network errors
      if (
        error.code === 'ECONNABORTED' ||
        error.message.includes('timeout') ||
        error.message.includes('Network Error')
      ) {
        return handleRetry(error);
      }

      console.error('FetchWithAuth error:', {
        url,
        retryCount,
        error: error.message || 'Unknown error'
      });
      throw error;
    }
  }

  return attemptRequest();
}

// Example usage:
export async function makeAuthenticatedRequest(
  url: string,
  method: string = 'GET',
  data?: any,
  customConfig: AxiosRequestConfig = {}
) {
  const config: AxiosRequestConfig = {
    method,
    ...customConfig,
  };

  if (data) {
    config.data = data;
  }

  try {
    const response = await fetchWithAuth(url, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
}
async function fetchWithAuth2(url: string, options: RequestInit = {}, timeoutMs: number = 120000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {0
    let session = await getSession();

    if (session && session.auth) {
      const currentTime = Math.floor(Date.now() / 1000);
      const decodedToken: DecodedToken = await decryptAccessToken(session.auth);

      console.log("Difference: ", decodedToken.exp - currentTime, 'Threshold: ', TOKEN_REFRESH_THRESHOLD);

      if (decodedToken.exp - currentTime < TOKEN_REFRESH_THRESHOLD) {
        const refreshSuccessful = await refreshToken();
        if (refreshSuccessful) {
          session = await getSession();
        } else {
          throw new Error('Session expired and refresh failed');
        }
      }
    } else {
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

    if (response.status === 401) {
      const refreshSuccessful = await refreshToken();
      if (refreshSuccessful) {
        session = await getSession();
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
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    console.error('Error in fetchWithAuth:', error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
async function fetchWithAuth3(
  url: string, 
  options: RequestInit = {}, 
  timeoutMs: number = 120000,
  maxRetries: number = 3
): Promise<Response> {
  let retryCount = 0;
  
  async function attemptFetch(): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log(`Request aborted due to timeout after ${timeoutMs}ms`);
    }, timeoutMs);

    try {
      let session = await getSession();

      if (session && session.auth) {
        const currentTime = Math.floor(Date.now() / 1000);
        const decodedToken: DecodedToken = await decryptAccessToken(session.auth);

        console.log("Difference: ", decodedToken.exp - currentTime, 'Threshold: ', TOKEN_REFRESH_THRESHOLD);

        if (decodedToken.exp - currentTime < TOKEN_REFRESH_THRESHOLD) {
          const refreshSuccessful = await refreshToken();
          if (refreshSuccessful) {
            session = await getSession();
          } else {
            throw new Error('Session expired and refresh failed');
          }
        }
      } else {
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

      if (response.status === 401) {
        const refreshSuccessful = await refreshToken();
        if (refreshSuccessful) {
          session = await getSession();
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
      if (error instanceof DOMException && error.name === 'AbortError') {
        if (retryCount < maxRetries) {
          retryCount++;
          const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Max 10 seconds
          console.log(`Retry attempt ${retryCount} after ${backoffDelay}ms`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          return attemptFetch();
        }
        throw new Error(`Request failed after ${maxRetries} retries due to timeout`);
      }
      console.error('Error in fetchWithAuth:', error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return attemptFetch();
}

async function fetchWithAuth4(
  url: string, 
  options: RequestInit = {}, 
  timeoutMs: number = 120000,
  maxRetries: number = 3
): Promise<Response> {
  let retryCount = 0;
  
  async function attemptFetch(): Promise<Response> {
    const controller = new AbortController();
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        controller.abort();
        reject(new Error(`Request timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    try {
      let session = await getSession();

      // Early validation of session
      if (!session?.auth?.access_token) {
        throw new Error('No valid session or access token');
      }

      const decodedToken: DecodedToken = await decryptAccessToken(session.auth);
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token needs refresh
      if (decodedToken.exp - currentTime < TOKEN_REFRESH_THRESHOLD) {
        try {
          const refreshed = await refreshToken();
          if (!refreshed) {
            throw new Error('Token refresh failed');
          }
          session = await getSession();
          // Validate session after refresh
          if (!session?.auth?.access_token) {
            throw new Error('Invalid session after refresh');
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          throw new Error('Session expired and refresh failed');
        }
      }

      // Prepare headers with type safety
      const headers = new Headers(options.headers);
      // We can safely use session.auth.access_token here because we've validated it above
      headers.set('Authorization', `Bearer ${session.auth.access_token}`);

      const fetchPromise = fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (response.status === 401) {
        try {
          const refreshed = await refreshToken();
          if (!refreshed) {
            throw new Error('Token refresh failed on 401');
          }
          
          const newSession = await getSession();
          if (!newSession?.auth?.access_token) {
            throw new Error('Invalid session after 401 refresh');
          }
          
          headers.set('Authorization', `Bearer ${newSession.auth.access_token}`);
          return fetch(url, {
            ...options,
            headers,
            signal: controller.signal
          });
        } catch (refreshError) {
          console.error('Error handling 401:', refreshError);
          throw new Error('Authentication failed after refresh attempt');
        }
      }

      return response;

    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        if (retryCount < maxRetries) {
          retryCount++;
          const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          console.log(`Retry attempt ${retryCount} after ${backoffDelay}ms`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          return attemptFetch();
        }
      }
      
      console.error('FetchWithAuth error:', {
        url,
        retryCount,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  return attemptFetch();
}

// Example usage:
// try {
//   const response = await fetchWithAuth('https://api.example.com/data', {
//     method: 'GET'
//   }, 5000, 3); // 5 second timeout, max 3 retries
//   const data = await response.json();
// } catch (error) {
//   console.error('Request failed:', error);
// }
export async function createComplaint(payload: ComplaintPayload): Promise<{success: boolean, code: number; message: string,error?: string, data?: any }> {
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
      error: result.error,
      data: result
    };

  } catch (error) {
    return {
      success: false,
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to add complaint. Please try again',
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
      cache:'no-cache'
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

export async function updateCPDStatus(ID: string, status: string): Promise<{code: number; message: string}> {
  try {
    const response = await fetch(`${cpdUrl}/update_status/${ID}?reg_status=${status}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache:'no-cache'
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

export async function updateAppealsStatus(ID: string, status: string): Promise<{code: number; message: string}> {
  try {
    const response = await fetch(`${appealUrl}/update_status/${ID}?reg_status=${status}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache:'no-cache'
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

export async function updateRenewalStatus(ID: string, status: string, bearer?:string): Promise<{code: number; message: string}> {
  try {
    // console.log('Bearer:', bearer);
    let param_key='reg_status';
    if(status == "Endorsement-Complete" || status == "Endorsement-Recommendation"){
      param_key='endorsement_status';
    }

    const response = await fetch(`${renewalUrl}/license-renewal/${ID}?${param_key}=${status}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${bearer}`
      },
      cache:'no-cache'
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

export async function updateRevocationStatus(ID: string, status: string): Promise<{code: number; message: string}> {
  try {
    let response;
    if(status === 'Endorsement-Complete' || status === 'Endorsement-Recommendation'){
      response = await fetch(`${revocationUrl}/update_status/${ID}?endorsement_status=${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        cache:'no-cache'
      });
    } else {
      response = await fetch(`${revocationUrl}/update_status/${ID}?reg_status=${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        cache:'no-cache'
      });
    }

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

export async function updateChangeOfCategoryStatusV1(
  ID: string, 
  status: string
): Promise<{code: number; message: string}> {
  try {
    let response;
    if(status === 'Endorsement-Complete' || status === 'Endorsement-Recommendation'){
      response = await fetchWithAuth(
        `${deltaCategoryUrl}/category-change/${ID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          params: {
            endorsement_status: status
          }
        }
      );
    }else {
      response = await fetchWithAuth(
        `${deltaCategoryUrl}/category-change/${ID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          params: {
            reg_status: status
          }
        }
      );
    }

    return {
      code: response.status,
      message: response.data?.message || 'Success'
    };

  } catch (error) {
    // Log the error with more context
    console.error('Error updating category status:', {
      ID,
      status,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    if (axios.isAxiosError(error)) {
      return {
        code: error.response?.status || 500,
        message: error.response?.data?.message || 'Failed to update status. Please try again'
      };
    }

    return {
      code: 500,
      message: error instanceof Error ? error.message : 'Failed to update status. Please try again'
    };
  }
}

export async function updateChangeOfCategoryStatus(
  ID: string, 
  status: string,
  bearer?: string
 ): Promise<{code: number; message: string}> {
  try {
    // Prepare query parameters
    const params = new URLSearchParams();
    if(status === 'Endorsement-Complete' || status === 'Endorsement-Recommendation') {
      params.append('endorsement_status', status);
    } else {
      params.append('reg_status', status);
    }
 
    const response = await fetch(
      `${deltaCategoryUrl}/category-change/${ID}?${params.toString()}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${bearer}`
        },
        // Trigger revalidation
        next: {
          tags: [`category-${ID}`]
        }
      }
    );
 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
 
    const data = await response.json();
 
    // Trigger revalidation after successful update
    // await fetch('/api/revalidate', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ tag: `category-${ID}` })
    // });
 
    return {
      code: response.status,
      message: data?.message || 'Success'
    };
 
  } catch (error) {
    // Log the error with more context
    console.error('Error updating category status:', {
      ID,
      status,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
 
    // Handle specific HTTP errors
    if (error instanceof Error && 'status' in error) {
      return {
        code: (error as any).status || 500,
        message: (error as any).message || 'Failed to update status. Please try again'
      };
    }
 
    return {
      code: 500,
      message: error instanceof Error ? error.message : 'Failed to update status. Please try again'
    };
  }
}


export async function updateStudentTeacherStatus(
  ID: string, 
  status: string,
  bearer?: string
 ): Promise<{code: number; message: string}> {
  try {
    // Prepare query parameters
    const params = new URLSearchParams();
    let baseURL = `${studentTeacherUrl}/student-teacher/`;
    if(status === 'Endorsement-Complete' || status === 'Endorsement-Recommendation') {
      params.append('endorsement_status', status);
      baseURL = `${restorationUrl}/student-endorsement/`
    } else {
      params.append('reg_status', status);
    }
 
    const response = await fetch(
      `${baseURL}${ID}?${params.toString()}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${bearer}`
        },
        // Trigger revalidation
        next: {
          tags: [`student-${ID}`]
        }
      }
    );
 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
 
    const data = await response.json();
 
    return {
      code: response.status,
      message: data?.message || 'Success'
    };
 
  } catch (error) {
    // Log the error with more context
    console.error('Error updating category status:', {
      ID,
      status,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
 
    // Handle specific HTTP errors
    if (error instanceof Error && 'status' in error) {
      return {
        code: (error as any).status || 500,
        message: (error as any).message || 'Failed to update status. Please try again'
      };
    }
 
    return {
      code: 500,
      message: error instanceof Error ? error.message : 'Failed to update status. Please try again'
    };
  }
}

export async function updateRestorationStatusV1(
  ID: string, 
  status: string
): Promise<{code: number; message: string}> {
  try {
    let response;
    if(status === 'Endorsement-Complete' || status === 'Endorsement-Recommendation'){
      response = await fetchWithAuth(
        `${restorationUrl}/license-restoration/${ID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          params: {
            endorsement_status: status
          }
        }
      );
    }else{
      response = await fetchWithAuth(
        `${restorationUrl}/license-restoration/${ID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          params: {
            reg_status: status
          }
        }
      );
    }
    return {
      code: response.status,
      message: response.data?.message || 'Success'
    };

  } catch (error) {
    // Log the error with more context
    console.error('Error updating category status:', {
      ID,
      status,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    if (axios.isAxiosError(error)) {
      return {
        code: error.response?.status || 500,
        message: error.response?.data?.message || 'Failed to update status. Please try again'
      };
    }

    return {
      code: 500,
      message: error instanceof Error ? error.message : 'Failed to update status. Please try again'
    };
  }
}

export async function updateRestorationStatus(
  ID: string, 
  status: string,
  bearer?: string
 ): Promise<{code: number; message: string}> {
  try {
    // Prepare query parameters
    const params = new URLSearchParams();
    if(status === 'Endorsement-Complete' || status === 'Endorsement-Recommendation') {
      params.append('endorsement_status', status);
    } else {
      params.append('reg_status', status);
    }
 
    const response = await fetch(
      `${restorationUrl}/license-restoration/${ID}?${params.toString()}`, 
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${bearer}`
        },
        next: {
          tags: [`restoration-${ID}`]
        }
      }
    );
 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
 
    const data = await response.json();
 
    // Trigger revalidation after successful update
    // await fetch('/api/revalidate', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ tag: `restoration-${ID}` })
    // });
 
    return {
      code: response.status,
      message: data?.message || 'Success'
    };
 
  } catch (error) {
    // Log the error with more context
    console.error('Error updating restoration status:', {
      ID,
      status,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
 
    if (error instanceof Error && 'status' in error) {
      return {
        code: (error as any).status || 500,
        message: (error as any).message || 'Failed to update status. Please try again'
      };
    }
 
    return {
      code: 500,
      message: error instanceof Error ? error.message : 'Failed to update status. Please try again'
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
    const response = await fetch(
      `${invUrl}/update-preliminary-investigations/${ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: "no-store",
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        code: response.status,
        message: errorData?.message || 'Failed to create report'
      };
    }

    return {
      message: 'Report created successfully',
      code: response.status
    };

  } catch (error) {
    console.error('Error creating report:', error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : 'Failed to create report'
    };
  }
}

export async function createInvestigationReportv1(payload: InvestigationReportPayload, ID: string): Promise<ReportResponse> {
try {
  const response = await fetchWithAuth(
    `${invUrl}/update-investigations/${ID}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: payload // Axios uses data instead of body
    }
  );

  // Successful response (2xx status code)
  return {
    message: 'Report created successfully',
    code: response.status,
  };

} catch (error) {
  console.error('Error creating report:', error);
  
  if (axios.isAxiosError(error)) {
    // Handle specific Axios errors
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || 'Failed to create report';

    return {
      code: statusCode,
      message: errorMessage,
    };
  }

  // Handle non-Axios errors
  return {
    code: 500,
    message: error instanceof Error ? error.message : 'Failed to create report',
  };
}
}

export async function createInvestigationReport(payload: InvestigationReportPayload, ID: string): Promise<ReportResponse> {
  try {
    const response = await fetch(
      `${invUrl}/update-investigations/${ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );
 
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        code: response.status,
        message: errorData?.message || 'Failed to create report'
      };
    }
 
    return {
      message: 'Report created successfully', 
      code: response.status
    };
 
  } catch (error) {
    console.error('Error creating report:', error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : 'Failed to create report'
    };
  }
 }

export async function getReportRecordById(Id: string) {
  try {
    const res = await fetch(
      `${invUrl}/preliminary-investigations/${Id}`, 
      { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-cache' 
      }
    );

    if (res.status === 200) {
      return res.json();
    }
    return null;

  } catch (error) {
    console.error('Error fetching record by ID:', error);
    return null;
  }
}

export async function createActivityV1(payload: ActivityPayload): Promise<ActivityResponse> {
  try {
    const response = await fetchWithAuth(
      `${invUrl}/activity-diaries`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: payload  // Axios uses 'data' instead of 'body'
      }
    );

    // Successful response (2xx status code)
    return {
      message: 'Activity created successfully',
      code: response.status,
      data: response.data?.data || { 
        success: true,
        activity_number: response.data?.activity_number || 'Unknown'
      }
    };

  } catch (error) {
    console.error('Error creating activity:', error);
    
    if (axios.isAxiosError(error)) {
      // Handle specific Axios errors
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || 'Failed to create activity';

      return {
        code: statusCode,
        message: errorMessage,
        // data: null
      };
    }

    // Handle non-Axios errors
    return {
      code: 500,
      message: error instanceof Error ? error.message : 'Failed to create activity',
      // data: null
    };
  }
}

export async function createActivity(payload: ActivityPayload): Promise<ActivityResponse> {
  try {
    const response = await fetch(
      `${invUrl}/activity-diaries`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );
 
    const data = await response.json();
 
    if (!response.ok) {
      return {
        code: response.status,
        message: data?.message || 'Failed to create activity'
      };
    }
 
    return {
      message: 'Activity created successfully',
      code: response.status,
      data: data?.data || {
        success: true,
        activity_number: data?.activity_number || 'Unknown'
      }
    };
 
  } catch (error) {
    console.error('Error creating activity:', error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : 'Failed to create activity'
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
    const res = await fetch(
      `${invUrl}/get-tipoff/${Id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'force-cache'
      }
    );
 
    if (res.status === 200) {
      return res.json();
    }
    return null;
 
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

export async function getCPDs(status: string, count: number): Promise<CPDListResponse> {
  try {

    const response = await fetch(`${cpdUrl}/get_list?reg_status=${status}&count=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache:'no-cache'
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

export async function getAppeals(status: string, count: number): Promise<Appeals_list> {
  try {

    const response = await fetch(`${appealUrl}/get-appeals-list?reg_status=${status}&count=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    cache:'no-cache'
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
      code: response.status,
      data: result.data
    };

  } catch (error) {
    console.error('Error passing json:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
    };
  }
}

export async function getRevocations(status: string, count: number): Promise<RevocationListResponse> {
  try {

    const response = await fetch(`${revocationUrl}/get_list?reg_status=${status}&count=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    cache:'no-cache'
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
      code: response.status,
      message: "success",
      applications: result.applications
    };

  } catch (error) {
    console.error('Error passing json:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
    };
  }
}

export async function getRestorations(status: string, count: number): Promise<RestorationListResponse> {
  try {
    let param_key='reg_status';
    if(status == "Endorsement-Complete" || status == "Pending-Endorsement" || status == "Endorsement-Recommendation"){
      param_key='endorsement_status';
    }

    const response = await fetch(`${restorationUrl}/GetRegistrationsByCount?${param_key}=${status}&count=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    cache:'no-cache'
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
      code: response.status,
      message: "success",
      applications: result
    };

  } catch (error) {
    console.error('Error passing json:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
    };
  }
}

export async function getRenewals(status: string, count: number): Promise<RenewalListResponse> {

  try {
    let param_key='reg_status';
    if(status == "Endorsement-Complete" || status == "Pending-Endorsement" || status == "Endorsement-Recommendation"){
      param_key='endorsement_status';
    }
    const response = await fetch(`${renewalUrl}/GetRegistrationsByCount?${param_key}=${status}&count=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    cache:'no-cache'
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
      code: response.status,
      message: "success",
      data: result
    };

  } catch (error) {
    console.error('Error passing json:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
    };
  }
}

export async function getChangeOfCategories(status: string, count: number): Promise<RenewalListResponse> {

  try {
    let param_key='reg_status';
    if(status == "Endorsement-Complete" || status == "Pending-Endorsement" || status == "Endorsement-Recommendation"){
      param_key='endorsement_status';
    }
    const response = await fetch(`${deltaCategoryUrl}/GetRegistrationsByCount?${param_key}=${status}&count=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    cache:'no-cache'
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
      code: response.status,
      message: "success",
      data: result
    };

  } catch (error) {
    console.error('Error passing json:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
    };
  }
}

export async function getStudentTeacherList(status: string, count: number): Promise<StudentTeacherListResponse> {

  try {
    let param_key='reg_status';
    if(status == "Endorsement-Complete" || status == "Pending-Endorsement" || status == "Endorsement-Recommendation"){
      param_key='endorsement_status';
    }
    const response = await fetch(`${studentTeacherUrl}/GetRegistrationsByCount?${param_key}=${status}&count=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    cache:'no-cache'
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
      code: response.status,
      message: "success",
      data: result
    };

  } catch (error) {
    console.error('Error passing json:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
    };
  }
}

export async function getCPDByNumber(ID: string): Promise<CPDResponseGet> {
  try {


    const response = await fetch(`${cpdUrl}/cpd-applications/${ID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    cache:'no-cache'
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

export async function getAppealByNumber(ID: string): Promise<appeal> {
  try {


    const response = await fetch(`${appealUrl}/get-appeal/${ID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache:'no-cache'
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
      code: response.status,
      message: result?.message,
      profile: result?.profile,
      appeals_application: result?.appeals_application
    };

  } catch (error) {
    console.error('Error adding complaint:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
    };
  }
}

export async function getRevocationByNumber(ID: string): Promise<RevocationResponse> {
  try {
    const response = await fetch(`${revocationUrl}/get-revocations/${ID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache:'no-cache'
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
      code: response.status,
      message: result?.message,
      profile: result?.profile,
      revocation: result?.revocation
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

export async function authenticate(_currentState: unknown, formData: FormData) {
  // Implementation depends on your authentication mechanism
  // This should be handled by your auth provider (e.g., NextAuth.js)
}

export async function revalidate(params: string) {
  revalidateTag(params);
}

export async function getAll() {
  const res = await fetchWithAuth4(`${apiUrl}/teacher_registrations/`);
  if (!res.ok) return [];
  return res.json();
}

export async function getRegApplicationsv1(status: string, count: string) {
  try {
    const res = await fetchWithAuth4(`${apiUrl}/GetRegistrationsByCount?reg_status=${status}&count=${count}`);
    return res.ok && res.headers.get('content-type')?.startsWith('application/json') ? res.json() : [];
  } catch (error) {
    console.error('Error fetching registration applications:', error);
    return [];
  }
}

export async function getRegApplications(status: string, count: string) {
  try {
    const res = await fetch(
      `${apiUrl}/GetRegistrationsByCount?reg_status=${status}&count=${count}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
 
    return res.ok && res.headers.get('content-type')?.startsWith('application/json') ? res.json() : [];
 
  } catch (error) {
    console.error('Error fetching registration applications:', error);
    return [];
  }
 }

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

export async function getInvRecordsv1(status: string, count: string) {
  try {
    const response = await fetchWithAuth(`${invUrl}/get-list`, {
      method: 'GET',
      params: {
        reg_status: status,
        count: count
      }
    });

    // Axios automatically parses JSON and throws on non-2xx status codes
    return response.data || [];
  } catch (error) {
    console.error('Error fetching records:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
    }
    return [];
  }
}

export async function getInvRecords(status: string, count: string) {
  try {
    const queryParams = new URLSearchParams({
      reg_status: status,
      count: count
    });
 
    const res = await fetch(
      `${invUrl}/get-list?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
 
    if (!res.ok) return [];
    
    const data = await res.json();

    return data || [];
 
  } catch (error) {
    console.error('Error fetching records:', error);
    return [];
  }
 }

export async function getInvestigationsList(status: string, count: number): Promise<InvestigationResponseList> {

  try {
    const response = await fetch(`${invUrl}/get-list?reg_status=${status}&count=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    cache:'no-cache'
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
      success: result.success,
      data: result.data
    };

  } catch (error) {
    console.error('Error passing json:', error);
    return {
      success: error instanceof Error && 'status' in error ? (error as any).status : 500,
    };
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
    const res = await fetchWithAuth4(`${licUrl}/getLicensesByCount?reg_status=${status}&count=${count}`);
    return res.ok && res.headers.get('content-type')?.startsWith('application/json') ? res.json() : [];
  } catch (error) {
    console.error('Error fetching license applications:', error);
    return [];
  }
}

export async function getEndorsementRecordsv1(status: string, count: string) {
  try {
    const res = await fetchWithAuth4(`${apiUrl}/GetRegistrationsByCount?endorsement_status=${status}&count=${count}`);
    return res.ok && res.headers.get('content-type')?.startsWith('application/json') ? res.json() : [];
  } catch (error) {
    console.error('Error fetching endorsement records:', error);
    return [];
  }
}

export async function getEndorsementRecords(status: string, count: string) {
  try {
    const res = await fetch(
      `${apiUrl}/GetRegistrationsByCount?endorsement_status=${status}&count=${count}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
 
    return res.ok && res.headers.get('content-type')?.startsWith('application/json') ? res.json() : [];
 
  } catch (error) {
    console.error('Error fetching endorsement records:', error);
    return [];
  }
 }

export async function getLicenseEndorsementRecords(status: string, count: string) {
  try {
    const res = await fetchWithAuth4(`${licUrl}/getLicensesByCount?endorsement_status=${status}&count=${count}`);
    return res.ok && res.headers.get('content-type')?.startsWith('application/json') ? res.json() : [];
  } catch (error) {
    console.error('Error fetching license endorsement records:', error);
    return [];
  }
}

export async function getNextv1(status: string) {
  try {
    const res = await fetchWithAuth4(`${apiUrl}/getNext/?reg_status=${status}`, { cache: 'no-cache' });
    if (!res.ok || res.status !== 200) return null;
    return res.headers.get('content-type')?.startsWith('application/json') ? res.json() : null;
  } catch (error) {
    console.error('Error fetching next item:', error);
    return null;
  }
}

export async function getNext(status: string) {
  try {
    const res = await fetch(
      `${apiUrl}/getNext/?reg_status=${status}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-cache'
      }
    );
 
    if (!res.ok || res.status !== 200) return null;
    return res.headers.get('content-type')?.startsWith('application/json') ? res.json() : null;
 
  } catch (error) {
    console.error('Error fetching next item:', error);
    return null;
  }
 }

export async function searchByIdv1(id: string){
  try{
    const res = await fetchWithAuth4(`${apiUrl}/search-record/?search=${id}`, { cache: 'no-cache' });
    if (!res.ok || res.status !== 200) return null;
    return res.headers.get('content-type')?.startsWith('application/json') ? res.json() : null;
  } catch (error){
    console.error('Error fetching record', error)
  }
}

export async function searchById(id: string) {
  try {
    const res = await fetch(
      `${apiUrl}/search-record/?search=${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-cache'
      }
    );
 
    if (!res.ok || res.status !== 200) return null;
    return res.headers.get('content-type')?.startsWith('application/json') ? res.json() : null;
 
  } catch (error) {
    console.error('Error fetching record', error);
    return null;
  }
 }

export async function getNextLicense(status: string) {
  try {
    const res = await fetchWithAuth4(`${licUrl}/getNext/?reg_status=${status}`, { cache: 'no-cache' });
    if (!res.ok || res.status === 204) return null;
    return res.headers.get('content-type')?.startsWith('application/json') ? res.json() : null;
  } catch (error) {
    console.error('Error fetching next license:', error);
    return null;
  }
}

export async function getRegByIdV2(Id: string) {
  revalidateTag('work');
  try {
    const res = await fetchWithAuth4(`${apiUrl}/teacher_registrations/${Id}`, { next: { tags: ['work'] } });
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

export async function getRegById(Id: string) {
  try {
    const response = await fetch(`${apiUrl}/teacher_registrations/${Id}`, {
      method: 'GET',
      headers: {},
      cache: 'no-cache'
    });

    if (!response.ok) {
      if (response.status === 200) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || null;
    
  } catch (error) {
    console.error('Error fetching registration by ID:', error);
    return null;
  }
}

export async function getInvRecordById(Id: string) {
  try {
    const response = await fetch(`${invUrl}/complaints/${Id}`, {
      method: 'GET',
      headers: {
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || null;

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
// NOT-INUSE
export async function getComplaintsById(Id: string): Promise<InvestigationResponse> {
  try {
    const response = await fetchWithAuth(
      `${invUrl}/complaints/${Id}`, 
      {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      }
    );
 
    // Successful response (2xx status code)
    return {
      success: true,
      data: response.data
    };
 
  } catch (error) {
    console.error('Error fetching complaint:', error);
    
    if (axios.isAxiosError(error)) {
      // Handle specific Axios errors
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || 'Failed to fetch complaint';
 
      return {
        success: false,
        message: errorMessage,
        //data: null
      };
    }
 
    // Handle non-Axios errors
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch complaint',
      //data: null
    };
  }
}
// NOT-INUSE
 export async function getInById(Id: string): Promise<InvestigationResponse> {
  try {
    const response = await fetchWithAuth4(`${invUrl}/complaints/${Id}`, { cache: 'no-cache' });

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
      data: result.data
    };

  } catch (error) {
    console.error('Error fetching record by ID:', error);
    return {
      success: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to fetch record. Please try again'
    };
  }
}

export async function getRenewalByIdV1(Id: string): Promise<TeacherRegistrationResponse> {
  try {
    const response = await fetchWithAuth4(`${renewalUrl}/license-renewal/${Id}`, { cache: 'no-cache' });

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
      message: 'success',
      teacher_registrations: result?.teacher_registrations,
      teacher_preliminary_infos: result?.teacher_preliminary_infos,
      edu_pro_qualifications: result?.edu_pro_qualifications,
      other_qualifications: result?.edu_pro_qualifications,
      bio_datas: result?.bio_datas,
      background_checks: result?.background_checks,
      declarations: result?.declarations,
      offence_convictions: result?.offence_convictions,
      employment_details: result?.employment_details,
      attachments: result?.attachments,
    };

  } catch (error) {
    console.error('Error fetching record by ID:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to fetch record. Please try again'
    };
  }
}

export async function getRenewalById(Id: string): Promise<TeacherRegistrationResponse> {
  try {
    const response = await fetch(`${renewalUrl}/license-renewal/${Id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers as needed
      },
      cache: 'no-store', // Equivalent to no-cache
      next: {
        tags: [`renewal-${Id}`] // Tag for revalidation
      }
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
      message: 'success',
      teacher_registrations: result?.teacher_registrations,
      teacher_preliminary_infos: result?.teacher_preliminary_infos,
      edu_pro_qualifications: result?.edu_pro_qualifications,
      other_qualifications: result?.edu_pro_qualifications,
      bio_datas: result?.bio_datas,
      background_checks: result?.background_checks,
      declarations: result?.declarations,
      offence_convictions: result?.offence_convictions,
      employment_details: result?.employment_details,
      attachments: result?.attachments,
    };
 
  } catch (error) {
    console.error('Error fetching record by ID:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to fetch record. Please try again'
    };
  }
 }
 
 
 // Example update function that triggers revalidation
 export async function updateRenewal(Id: string, data: any) {
  try {
    const response = await fetch(`${renewalUrl}/license-renewal/${Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers
      },
      body: JSON.stringify(data)
    });
 
    if (!response.ok) {
      throw new Error('Failed to update renewal');
    }
 
    // Trigger revalidation
    await fetch('/api/revalidate/renewal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: Id })
    });
 
    return await response.json();
  } catch (error) {
    console.error('Error updating renewal:', error);
    throw error;
  }
 }

export async function getChangeOfCategoryByIdV1(Id: string): Promise<ChangeOfCategoryResponse> {
  try {
    const response = await fetchWithAuth4(`${deltaCategoryUrl}/category-change/${Id}`, { cache: 'no-cache' });

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
      message: 'success',
      teacher_registrations: result?.teacher_registrations,
      teacher_preliminary_infos: result?.teacher_preliminary_infos,
      edu_pro_qualifications: result?.edu_pro_qualifications,
      other_qualifications: result?.edu_pro_qualifications,
      bio_datas: result?.bio_datas,
      background_checks: result?.background_checks,
      declarations: result?.declarations,
      offence_convictions: result?.offence_convictions,
      employment_details: result?.employment_details,
      attachments: result?.attachments,
      categories: result?.categories
    };

  } catch (error) {
    console.error('Error fetching record by ID:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to fetch record. Please try again'
    };
  }
}

export async function getChangeOfCategoryById(Id: string): Promise<ChangeOfCategoryResponse> {
  try {
    const response = await fetch(`${deltaCategoryUrl}/category-change/${Id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any auth headers if needed
      },
      cache: 'no-store', // Equivalent to 'no-cache'
      next: {
        tags: ['category-change'], // Optional: for revalidation
      }
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
      message: 'success',
      teacher_registrations: result?.teacher_registrations,
      teacher_preliminary_infos: result?.teacher_preliminary_infos,
      edu_pro_qualifications: result?.edu_pro_qualifications,
      other_qualifications: result?.edu_pro_qualifications,
      bio_datas: result?.bio_datas,
      background_checks: result?.background_checks,
      declarations: result?.declarations,
      offence_convictions: result?.offence_convictions,
      employment_details: result?.employment_details,
      attachments: result?.attachments,
      categories: result?.categories
    };

  } catch (error) {
    console.error('Error fetching record by ID:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to fetch record. Please try again'
    };
  }
}

export async function getStudentTeacherById(Id: string): Promise<StudentTeacherResponse> {

  try {
    const response = await fetch(`${studentTeacherUrl}/student-teacher/${Id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any auth headers if needed
      },
      cache: 'no-store', // Equivalent to 'no-cache'
      // next: {
      //   tags: ['category-change'], // Optional: for revalidation
      // }
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
      message: 'success',
      teacher_registrations: result?.teacher_registrations,
      student_study_programmes: result?.student_study_programmes,
      student_preliminary_infos: result?.student_preliminary_infos,
      bio_datas: result?.bio_datas,
      background_checks: result?.background_checks,
      declarations: result?.declarations,
      offence_convictions: result?.offence_convictions,
      attachments: result?.attachments,
    };

  } catch (error) {
    console.error('Error fetching record by ID:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to fetch record. Please try again'
    };
  }
}

export async function getRestorationByIdv1(Id: string): Promise<RestorationResponse> {
  try {
    const response = await fetchWithAuth4(`${restorationUrl}/license-restoration/${Id}`, { cache: 'no-cache' });

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
      message: 'success',
      teacher_registrations: result?.teacher_registrations,
      teacher_preliminary_infos: result?.teacher_preliminary_infos,
      edu_pro_qualifications: result?.edu_pro_qualifications,
      other_qualifications: result?.edu_pro_qualifications,
      bio_datas: result?.bio_datas,
      background_checks: result?.background_checks,
      declarations: result?.declarations,
      offence_convictions: result?.offence_convictions,
      employment_details: result?.employment_details,
      attachments: result?.attachments,
      categories: result?.categories
    };

  } catch (error) {
    console.error('Error fetching record by ID:', error);
    return {
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      message: error instanceof Error ? error.message : 'Failed to fetch record. Please try again'
    };
  }
}

export async function getRestorationById(Id: string): Promise<RestorationResponse> {
  try {
    const response = await fetch(`${restorationUrl}/license-restoration/${Id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers as needed
      },
      cache: 'no-store',
      next: { 
        tags: [`restoration-${Id}`]
      }
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
      message: 'success',
      teacher_registrations: result?.teacher_registrations,
      teacher_preliminary_infos: result?.teacher_preliminary_infos,
      edu_pro_qualifications: result?.edu_pro_qualifications,
      other_qualifications: result?.edu_pro_qualifications,
      bio_datas: result?.bio_datas,
      background_checks: result?.background_checks,
      declarations: result?.declarations,
      offence_convictions: result?.offence_convictions,
      employment_details: result?.employment_details,
      attachments: result?.attachments,
      categories: result?.categories
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
    const res = await fetchWithAuth4(`${licUrl}/license-data/${Id}`, { cache: 'no-cache' });
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

export async function UpdateStatusV1(id: string, status: string, rejection_reason: string) {
  const res = await fetchWithAuth(`${apiUrl}/teacher_registrations/${id}?reg_status=${status}&rejection_reason=${rejection_reason}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.status;
}

export async function UpdateStatus(id: string, status: string, rejection_reason: string, bearer?: string) {
  const res = await fetch(
    `${apiUrl}/teacher_registrations/${id}?reg_status=${status}&rejection_reason=${rejection_reason}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearer}`
      },
    }
  );
  return res.status;
 }

export async function ReturnToCustomerv1(id: string, status: string, items: (string | undefined)[]) {

  const res = await fetchWithAuth4(`${apiUrl}/customer-action/${id}?reg_status=${status}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "reg_status":status,
      items
    }),
  });
  return res.status;
}

export async function ReturnToCustomer(id: string, status: string, items: (string | undefined)[], bearer?: string) {
  const res = await fetch(
    `${apiUrl}/customer-action/${id}?reg_status=${status}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearer}`
      },
      body: JSON.stringify({
        reg_status: status,
        items
      })
    }
  );
  return res.status;
 }

export async function UpdateLicenseStatus(id: string, status: string) {
  const res = await fetchWithAuth(`${licUrl}/license_applications/${id}?reg_status=${status}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.status;
}

// export async function GetReports() {
//   const res = await fetchWithAuth4(`${apiUrl}/StatisticalReports/`);
//   return res.json();
// }

// export async function getMonthlyTeacherRegistrations() {
//   const res = await fetchWithAuth4(`${apiUrl}/Monthly-Statistics/`);
//   return res.json();
// }

// export async function getStatuses() {
//   const res = await fetchWithAuth4(`${apiUrl}/Status-Statistics-Graph/`);
//   return res.json();
// }

// export async function getTeacherRegistrationsByStatus() {
//   const res = await fetchWithAuth4(`${apiUrl}/Status-Statistics/`);
//   return res.json();
// }

export async function GetReports() {
  const res = await fetch(
    `${apiUrl}/StatisticalReports/`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return res.json();
 }
 
 export async function getMonthlyTeacherRegistrations() {
  const res = await fetch(
    `${apiUrl}/Monthly-Statistics/`,
    {
      method: 'GET', 
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return res.json();
 }
 
 export async function getStatuses() {
  const res = await fetch(
    `${apiUrl}/Status-Statistics-Graph/`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return res.json();
 }
 
 export async function getTeacherRegistrationsByStatus() {
  const res = await fetch(
    `${apiUrl}/Status-Statistics/`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return res.json();
 }

export async function UpdateLicenseEndorsementStatus(id: string, status: string) {
  const res = await fetchWithAuth(`${licUrl}/license_applications/${id}?endorsement_status=${status}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.status;
}

export async function UpdateEndorsementStatusv1(id: string, status: string) {
  const res = await fetchWithAuth(`${apiUrl}/teacher_registrations/${id}?endorsement_status=${status}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.status;
}

export async function UpdateEndorsementStatus(id: string, status: string, bearer?: string) {
  const res = await fetch(
    `${apiUrl}/teacher_registrations/${id}?endorsement_status=${status}`,
    {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearer}` 
      }
    }
  );
  return res.status;
 }

export async function BulkRegistrationUpdatev1(data: string) {
  const jsonData = JSON.parse(data);
  const res = await fetchWithAuth4(`${apiUrl}/processBulkRegistrations/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonData),
  });
  return res.status;
}

export async function BulkRegistrationUpdate(data: string) {
  const jsonData = JSON.parse(data);
  const res = await fetch(
    `${apiUrl}/processBulkRegistrations/`,
    {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData)
    }
  );
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