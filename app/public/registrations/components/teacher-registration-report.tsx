import React from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { ExportButton } from './teacher-registration-export';
import { AlertCircle } from 'lucide-react';
import { metadata } from '@/app/layout';
import RefreshButton from './refresh-button';
import { apiUrl } from '@/app/lib/store';


async function getRegistrations() {
  const maxRetries = 3;
  const timeoutMs = 30000; // 30 seconds timeout
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);
    
    try {
      // const startTime = Date.now();
      
      const response = await fetch(`${apiUrl}/teacher_registrations/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br', 
          'Connection': 'keep-alive', 
          'Cache-Control': 'no-cache', 
        },
        signal: abortController.signal,
        keepalive: true, 
        mode: 'cors',
        credentials: 'same-origin'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {

        if (response.status >= 500 && attempt < maxRetries) {

          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000)); // Exponential backoff
          continue;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || !data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid data structure received from API');
      }
      
      // const metadata = {
      //   fetchedAt: new Date().toISOString(),
      //   lastModified: response.headers.get('last-modified') || new Date().toISOString(),
      //   responseTime: `${Date.now() - startTime}ms`,
      //   dataSize: `${Math.round(JSON.stringify(data).length / 1024)}KB`, // Add response size
      //   recordCount: data.data.length,
      //   attempt: attempt 
      // };
      
      return { 
        success: true, 
        data,
        metadata
      };
      
    } catch (error) {
      clearTimeout(timeoutId);
      

      if (error instanceof Error) {

        if (error.name === 'AbortError') {
          console.warn(`Request timeout on attempt ${attempt}/${maxRetries}`);
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Progressive delay
            continue;
          }
          return { 
            success: false, 
            error: 'Request timeout - please check your connection',
            metadata: {
              fetchedAt: new Date().toISOString(),
              error: true,
              errorType: 'timeout',
              attempts: attempt
            }
          };
        }
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          console.warn(`Network error on attempt ${attempt}/${maxRetries}:`, error.message);
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
            continue;
          }
        }
      }

      console.error(`Error fetching registrations (attempt ${attempt}/${maxRetries}):`, error);
      
      if (attempt === maxRetries) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to connect',
        };
      }
    }
  }
  
  return { 
    success: false, 
    error: 'Maximum retry attempts exceeded',
  };
}

const TeacherRegistrationReport = async () => {
  const {success, data, error} = await getRegistrations();
  
  // If data fetching failed, show error state
  if (!success) {
    return (
      <div className="teacher-registration-report">
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Teacher Certification Registry
          </h1>
          <p className="mt-1 text-sm text-gray-500 md:text-base">
            Search for and verify teacher certification status in our public database
          </p>
        </div> */}
        
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-red-50 p-3 mb-4">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Connection Error</h2>
            <p className="text-gray-500 max-w-md mb-6">
              Failed to connect to the data component. Please try again later or contact support if the issue persists.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Error details: {error}
            </p>
            <div className="flex items-center justify-end">
                <RefreshButton />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // If successful, show the data table
  return (
    <div className="teacher-registration-report space-y-6">      
      {/* Data Table Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className='flex justify-end items-end p-2'>
          <ExportButton data={data.data}/>
        </div>
        <div className="md:p-6">
          <DataTable data={data.data} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default TeacherRegistrationReport;