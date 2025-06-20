// /lib/hooks/useBeforeUnload.ts
import { useEffect } from 'react';

interface UseBeforeUnloadOptions {
  when: boolean;
  message?: string;
  onBeforeUnload?: () => void;
}

export const useBeforeUnload = ({ 
  when, 
  message = 'You have unsaved changes. Are you sure you want to leave?',
  onBeforeUnload 
}: UseBeforeUnloadOptions) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (when) {
        event.preventDefault();
        event.returnValue = message;
        onBeforeUnload?.();
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [when, message, onBeforeUnload]);
};