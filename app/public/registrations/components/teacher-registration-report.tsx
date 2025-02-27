import React from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { ExportButton } from './teacher-registration-export';
import { AlertCircle } from 'lucide-react';

async function getRegistrations() {
  try {
    const response = await fetch('http://10.0.25.164:8080/trls-80/teacher_registrations/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 36 // Revalidate every hour (in seconds)
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
    
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to connect..'
    };
  }
}

const TeacherRegistrationReport = async () => {
  const result = await getRegistrations();
  
  // If data fetching failed, show error state
  if (!result.success) {
    return (
      <div className="teacher-registration-report">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Teacher Certification Registry
          </h1>
          <p className="mt-1 text-sm text-gray-500 md:text-base">
            Search for and verify teacher certification status in our public database
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
            <p className="text-sm text-gray-400">
              Error details: {result.error}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // If successful, show the data table
  return (
    <div className="teacher-registration-report">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Teacher Certification Registry
          </h1>
          <p className="mt-1 text-sm text-gray-500 md:text-base">
            Search for and verify teacher certification status in our public database
          </p>
        </div>
        
        {/* <div className="mt-4 md:mt-0">
          <ExportButton data={result.data.data} />
        </div> */}
      </div>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <DataTable data={result.data.data} columns={columns} />
      </div>
    </div>
  );
};

export default TeacherRegistrationReport;