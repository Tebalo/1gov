// hooks/useApplicationData.ts
import { useState, useEffect } from 'react';
import { getLicenseApplications, getRegApplications } from '../lib/actions';

export function useApplicationData(status: string, applicationType: 'registration' | 'license') {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (status === 'default') {
        setData(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = applicationType === 'registration' 
          ? await getRegApplications(status, '100')
          : await getLicenseApplications(status, '100');
        setData(response);
      } catch (err) {
        //setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [status, applicationType]);

  return { data, isLoading, error };
}