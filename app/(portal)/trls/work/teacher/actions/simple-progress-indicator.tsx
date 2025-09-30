import React, { useState, useEffect } from 'react';

interface ProgressIndicatorProps {
  isLoading: boolean;
  totalDuration?: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  isLoading, 
  totalDuration = 60000
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    setProgress(0);
    
    const intervalTime = 500;
    const totalSteps = totalDuration / intervalTime;
    const progressIncrement = 100 / totalSteps;

    const intervalId = setInterval(() => {
      setProgress(prevProgress => Math.min(prevProgress + progressIncrement, 99.5));
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [isLoading, totalDuration]);

  useEffect(() => {
    if (!isLoading && progress > 0) {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  }, [isLoading, progress]);

  if (!isLoading && progress === 0) return null;

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50 backdrop-blur-sm">
      <div className="relative animate-bounce">
        {/* Shadow effect for levitation */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-400 blur-xl opacity-30 scale-75 translate-y-8"></div>
        
        {/* Main circle container with shadow */}
        <div className="relative bg-white rounded-full p-6 shadow-2xl">
          <svg className="transform -rotate-90 w-32 h-32">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="54"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="54"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Loading</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;