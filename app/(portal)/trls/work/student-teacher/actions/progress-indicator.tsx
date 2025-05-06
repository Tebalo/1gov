// components/ProgressIndicator.tsx
import React, { useState, useEffect } from 'react';

interface ProgressIndicatorProps {
  isLoading: boolean;
  totalDuration?: number; // in milliseconds
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  isLoading, 
  totalDuration = 60000 // default to 1 minute (60000ms)
}) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Preparing...');

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    // Reset progress when loading starts
    setProgress(0);
    
    // Update messages based on progress
    const messageUpdates = [
      { threshold: 10, message: 'Initializing request...' },
      { threshold: 25, message: 'Processing data...' },
      { threshold: 50, message: 'Almost halfway there...' },
      { threshold: 75, message: 'Finalizing results...' },
      { threshold: 90, message: 'Almost done...' }
    ];

    // Calculate interval time to update progress
    const intervalTime = 500; // Update every 500ms
    const totalSteps = totalDuration / intervalTime;
    const progressIncrement = 100 / totalSteps;

    // Create interval to update progress
    const intervalId = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = Math.min(prevProgress + progressIncrement, 99.5);
        
        // Update status message based on progress
        for (const update of messageUpdates) {
          if (prevProgress < update.threshold && newProgress >= update.threshold) {
            setStatusMessage(update.message);
            break;
          }
        }
        
        return newProgress;
      });
    }, intervalTime);

    // Clean up interval on unmount or when loading completes
    return () => clearInterval(intervalId);
  }, [isLoading, totalDuration]);

  // Set progress to 100% when loading completes
  useEffect(() => {
    if (!isLoading && progress > 0) {
      setProgress(100);
      setStatusMessage('Complete!');
    }
  }, [isLoading, progress]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-medium">{statusMessage}</span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;