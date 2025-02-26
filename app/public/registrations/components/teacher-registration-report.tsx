import React from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';


async function getRegistrations() {
    try {
      const response = await fetch('http://10.0.25.164:8080/trls-80/teacher_registrations/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 3600 // Revalidate every hour (in seconds)
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching registrations:', error);
      return [];
    }
  }

const TeacherRegistrationReport = async () => {
    const registrations = await getRegistrations()
    return (
        <div className="teacher-registration-report">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                Teacher Registrations
                </h1>
                <p className="mt-1 text-sm text-gray-500 md:text-base">
                View all registered teachers in the system
                </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <DataTable data={registrations.data} columns={columns} />
            </div>
        </div>
    );
};

export default TeacherRegistrationReport;