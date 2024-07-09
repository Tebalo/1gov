'use client';

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-600 mb-6">We are sorry, but an error occurred while processing your request.</p>
        {error.message && (
          <p className="text-sm text-gray-500 mb-6">Error details: {error.message}</p>
        )}
        <Button 
          onClick={reset}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </Button>
      </div>
    </main>
  );
}