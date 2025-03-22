'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export const ActivityTracker = () => {
  const { updateLastActivity } = useAuth();

  useEffect(() => {
    // Track various user activities
    const activityEvents = [
      'mousedown', 
      'mousemove', 
      'keypress', 
      'scroll', 
      'touchstart',
      'click',
      'submit'  // For form submissions
    ];
    
    const handleActivity = () => {
      updateLastActivity();
    };
    
    // Add event listeners for all activity events
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });
    
    // Clean up event listeners
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [updateLastActivity]);

  return null; // This component doesn't render anything
};