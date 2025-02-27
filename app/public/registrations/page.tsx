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
      {/* App Bar */}
      {/* <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">

          </div>
        </div>
      </header> */}
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:px-6">
        <div className="bg-white rounded-lg shadow p-6">
          <DynamicComponentWithNoSSR/>
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              © 2025 Teacher Registration System. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegistrationsPage;