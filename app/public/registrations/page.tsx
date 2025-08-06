import React from 'react';
import TeacherRegistrationReport from './components/teacher-registration-report';
import dynamic from 'next/dynamic'
import Link from 'next/link';

const DynamicComponentWithNoSSR = dynamic(
  () => import('./components/teacher-registration-report'),
  { ssr: false }
)

const RegistrationsPage = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="">
        <div className="bg-white rounded-lg shadow p-4">
          <DynamicComponentWithNoSSR/>
        </div>
      </div>
    </div>
  );
};

export default RegistrationsPage;