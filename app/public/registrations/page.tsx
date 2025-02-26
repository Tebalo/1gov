import React from 'react';
import TeacherRegistrationReport from './components/teacher-registration-report';
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('./components/teacher-registration-report'),
  { ssr: false }
)

const RegistrationsPage = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Registrations</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Welcome to the registrations page.</p>
        <DynamicComponentWithNoSSR/>
      </div>
    </div>
  );
};

export default RegistrationsPage;