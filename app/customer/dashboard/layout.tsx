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
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand area (optional) */}
            <div className="w-6 h-6 items-center justify-center">
              <Image
                src="/botepco.png"
                alt='Coat-of-arms'
                width={100}
                height={100}
                className="w-full h-full object-contain"
                priority
                />
            </div>
            {/* <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-gray-900">BOTEPCO</span>
              </div>
            </div> */}
            
            {/* Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <CustomerNavigationMenu />
            </div>
            
            {/* User Profile */}
            <div className="flex items-center">
              <UserProfile />
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation (optional) */}
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2">
            <CustomerNavigationMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-200px)]">
            <div className="p-2">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} BOTEPCO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}