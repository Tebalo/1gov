'use client';

import { useAuth } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';

export const RefreshTokenModal = () => {
  const { showRefreshModal, refreshSession, logout } = useAuth();
  const [countdown, setCountdown] = useState<number>(60); // 60 seconds countdown

  useEffect(() => {
    if (!showRefreshModal) {
      setCountdown(60);
      return;
    }

    // Start countdown when modal is shown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          logout(); // Auto logout when countdown reaches zero
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showRefreshModal, logout]);

  if (!showRefreshModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4">Session Expiring</h2>
        <p className="mb-4">
          Your session is about to expire in <span className="font-semibold">{countdown}</span> seconds due to inactivity.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Logout
          </button>
          <button
            onClick={refreshSession}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Continue Session
          </button>
        </div>
      </div>
    </div>
  );
};