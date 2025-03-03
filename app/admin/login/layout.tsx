import { Metadata } from 'next';
import React from 'react';
import Image from "next/image";

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
            <body>
                <main className='min-h-screen flex flex-col relative'>
                    {/* Background Image Container */}
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={'/admin-bg.svg'}
                            alt=""
                            fill
                            className="object-cover"
                            quality={100}
                            priority
                        />
                        {/* Overlay for better readability */}
                        <div className="absolute inset-0 bg-red-400/55"/>
                    </div>
                    {children}
                </main>
                {/* Footer */}
                <footer className="relative z-10 mt-auto">
                    <div className="flex flex-col items-center mb-4">
                    <p className="text-sm text-white">©2025 TRLS Portal</p>
                    </div>
                </footer>
            </body>
        </html>
    );
}