'use client'
import { UserProfile } from "../components/my-profile";
import { CustomerNavigationMenu } from "../components/nav-menu";
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
                <Image
                  src="/botepco.png"
                  alt='Coat-of-arms'
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:inline truncate">
                BOTEPCO
              </span>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center flex-shrink-0">
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation - positioned below header */}
      <div className="fixed top-14 sm:top-16 left-0 right-0 z-40">
        <CustomerNavigationMenu />
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-28 sm:pt-32 lg:pt-32">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-200px)] sm:min-h-[calc(100vh-220px)] lg:min-h-[calc(100vh-220px)] overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8 overflow-x-auto">
              <div className="min-w-0 w-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center text-gray-400">
            <p className="text-xs sm:text-sm">
              &copy; {new Date().getFullYear()} BOTEPCO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}