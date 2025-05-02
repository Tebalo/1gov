import React from 'react';
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../registrations/components/student-teacher-registration-report'),
  { ssr: false }
)

const StudentRegistrationsPage = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="">
        <div className="bg-white rounded-lg shadow p-6">
          <DynamicComponentWithNoSSR/>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationsPage;