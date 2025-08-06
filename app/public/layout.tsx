import { Metadata } from 'next';
import React, { Suspense } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const metadata: Metadata = {
    title: "Registrations",
    description: "Teacher registration and licensing system",
    icons: {
      icon: '/Code-of-Arms-colour.png'
    }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body suppressHydrationWarning={true}>
                <main className='md:mx-auto md:px-0'>
                    {/* Background Image Container */}
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={'/background.png'}
                            alt=""
                            fill
                            className="object-cover"
                            quality={100}
                            priority
                        />
                        {/* Overlay for better readability */}
                        <div className="absolute inset-0 bg-sky-400/55"/>
                    </div>
                    <div className='md:container rounded-md md:mx-auto md:max-w-9xl bg-white/95 relative z-10'>
                        <Suspense fallback={<LoadingSkeleton />}>
                            {children}
                        </Suspense>
                    </div>   
                </main>
                
                {/* Footer */}
                {/* <footer className="hidden md:block border-t border-gray-200 bg-gradient-to-b from-gray-300 to-white mt-12">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-8">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                            </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-600">
                            © 2025 Teacher Registration System. All rights reserved.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                            <div className="flex items-center space-x-6">
                            <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                                Terms of Service
                            </Link>
                            <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                                Privacy Policy
                            </Link>
                            <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                                Contact Us
                            </Link>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                            <a href="https://web.facebook.com/profile.php?id=100093971226881" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>

                            </div>
                        </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            The Teacher Registration System is an official government service. All information is collected and processed in accordance with relevant data protection regulations.
                        </p>
                        </div>
                    </div>
                </footer> */}
            </body>
        </html>
    );
}