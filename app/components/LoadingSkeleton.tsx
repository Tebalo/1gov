import React from 'react';
import { Loader2 } from "lucide-react"

interface LoadingSkeletonProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  size = 'medium', 
  message = 'Loading...',
  className = '' 
}) => {
  // Helper function to render loader based on size
  const getLoader = () => {
    const sizes = {
      small: 'h-8 w-8',
      medium: 'h-16 w-16',
      large: 'h-24 w-24'
    };

    return (
      <div className="flex flex-col items-center justify-center space-y-6 w-full">
        <Loader2 className={`${sizes[size]} animate-spin text-primary`} />
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
      </div>
    );
  };

  return (
    <div 
      role="status" 
      className={`
        w-full h-[calc(100vh-4rem)]
        flex items-center justify-center
        ${className}
      `}
    >
      {/* Main loader */}
      {getLoader()}

      {/* Screen reader text */}
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
};

// Optional: Export a simpler version for basic loading states
export const SimpleLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-6">
    <Loader2 className="h-16 w-16 animate-spin text-primary"/>
    {message && <p className="text-lg font-medium text-muted-foreground">{message}</p>}
  </div>
);