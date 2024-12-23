import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const LocationChangeBanner = () => {
  return (
    <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200">
      <Info className="h-5 w-5 text-blue-500" />
      <AlertTitle className="text-blue-700">Temporary Change Notice</AlertTitle>
      <AlertDescription className="text-blue-600">
        Teacher registration has been temporarily moved to the{' '}
        <span className="font-semibold">Registration</span> menu while we update the system.
      </AlertDescription>
    </Alert>
  );
};

export default LocationChangeBanner;