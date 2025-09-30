'use client';

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RefreshCw, AlertCircle } from "lucide-react";
import TeacherRegistrationViewer from "../../ui/teacher-multi-step";
import { getTeacherRegistrationById } from "@/app/lib/actions";
import { getRole } from "@/app/auth/auth";
import { Role } from "@/app/lib/store";

type LoadingState = 'loading' | 'success' | 'error';

export default function TeacherRegistrationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const id = params.slug as string;
  const assignedTo = searchParams.get('assigned_to');
  
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [response, setResponse] = useState<any>(null);
  const [userRole, setUserRole] = useState<Lowercase<Role> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoadingState('loading');
    setError(null);
    
    try {
      // Fetch data in parallel
      const [registrationData, rawRole] = await Promise.all([
        getTeacherRegistrationById(id, assignedTo || undefined),
        getRole()
      ]);

      if (registrationData.code === 200) {
        setResponse(registrationData);
        setUserRole((rawRole as Role).toLowerCase() as Lowercase<Role>);
        setLoadingState('success');
      } else {
        setError(registrationData.message || 'Failed to load registration');
        setLoadingState('error');
      }
    } catch (e) {
      console.error('Error loading registration:', e);
      setError(e instanceof Error ? e.message : 'An unexpected error occurred');
      setLoadingState('error');
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, assignedTo]);

  // Loading state
  if (loadingState === 'loading') {
    return (
      <main className="h-full">
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading registration details
            </h3>
            <p className="text-sm text-gray-600">
              Please wait while we fetch the information...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (loadingState === 'error') {
    const retryUrl = `/trls/work/teacher/${id}${assignedTo ? `?assigned_to=${encodeURIComponent(assignedTo)}` : ''}`;
    
    return (
      <main className="h-full">
        <div className="flex h-[80vh] items-center justify-center w-full">
          <div className="text-center px-4 max-w-md">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              Unable to Load Registration
            </h2>
            <p className="mb-2 text-gray-700 font-medium">
              Connection Error
            </p>
            <p className="mb-6 text-sm text-gray-600">
              {error || 'Unable to load the record. Please check your connection and try again.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={loadData}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
              <Link
                href="/trls/work/teacher"
                className="inline-flex items-center gap-2 rounded-md bg-gray-200 px-6 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Go Back
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Success state
  return (
    <main className="h-full">
      <div className="flex flex-row h-full gap-0">
        {response && userRole && (
          <TeacherRegistrationViewer 
            data={response} 
            userRole={userRole}
          />
        )}
      </div>
    </main>
  );
}