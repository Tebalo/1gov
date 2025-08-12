import React, { cache } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { ExportButton } from './teacher-registration-export';
import { AlertCircle } from 'lucide-react';
import { metadata } from '@/app/layout';
import RefreshButton from './refresh-button';
import { apiUrl, studentTeacherUrl } from '@/app/lib/store';

async function getRegistrations() {
  // Create a unique tag for this data
  const fetchTag = 'teacher-registrations';
  const cacheTime = 14400; // 4 hours
  try {
    const startTime = Date.now();
    
    const response = await fetch(`${studentTeacherUrl}/student-registrations/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: cacheTime, // Revalidate every hour (in seconds)
        tags: [fetchTag], // Add a tag to enable manual revalidation
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate that data has the expected structure
    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid data structure received from API');
    }
    
    // Construct metadata
    const metadata = {
      fetchedAt: new Date().toISOString(),
      lastModified: response.headers.get('last-modified') || new Date().toISOString(),
      nextUpdate: new Date(Date.now() + cacheTime * 1000).toISOString(), // Next revalidation time
      responseTime: `${Date.now() - startTime}ms`,
      cacheTag: fetchTag
    };
    
    return { 
      success: true, 
      data,
      metadata
    };
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to connect..',
      metadata: {
        fetchedAt: new Date().toISOString(),
        error: true
      }
    };
  }
}

const StudentTeacherRegistrationReport = async () => {
  const {success, data, metadata, error} = await getRegistrations();
  
  // If data fetching failed, show error state
  if (!success) {
    return (
      <div className="teacher-registration-report">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Student Teacher Certification Registry
          </h1>
          <p className="mt-1 text-sm text-gray-500 md:text-base">
            Search for and verify student-teacher certification status in our public database
          </p>
        </div>
        
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
      {/* Header Section with improved design */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 md:px-6 px-2 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            {/* Left side - Title and description */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-gray-800 md:text-3xl">
                Student Teacher Certification Registry
              </h1>
              <p className="mt-2 text-sm text-gray-600 md:text-base">
                Search for and verify student-teacher certification status in our public database
              </p>
              
            </div>
            
            {/* Right side - Refresh button and metadata */}
            <div className="flex flex-col space-y-3 md:space-y-4 md:items-end">
              <div className="flex items-center justify-end">
                <RefreshButton />
              </div>
              
              <div className="bg-white md:px-4 px-2 py-3 rounded-md border border-gray-200 text-sm text-gray-600 shadow-sm w-full md:w-auto">
                <div className="flex items-start gap-3 md:justify-end">
                  <div className="mt-0.5">
                    <svg className="h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Last Updated</div>
                    <div>{new Date(metadata.fetchedAt).toLocaleString()}</div>
                  </div>
                </div>
                
                {!('error' in metadata) && (
                  <div className="flex items-start gap-3 mt-3 md:justify-end">
                    <div className="mt-0.5">
                      <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 12a11 11 0 1 1-22 0 11 11 0 0 1 22 0Z"></path>
                        <path d="M8 12h8"></path>
                        <path d="M12 8v8"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Next Update</div>
                      <div>{new Date(metadata.nextUpdate).toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Data Table Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className='md:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'>
          <ExportButton data={data.data}/>
        </div>
        <div className="md:p-6">
          <DataTable data={data.data} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default StudentTeacherRegistrationReport;