import React from 'react';

interface LoadingSkeletonProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ size = 'medium', className = '' }) => {
  const getSkeletonItems = () => {
    switch (size) {
      case 'small':
        return (
          <>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24"></div>
          </>
        );
      case 'large':
        return (
          <>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-3/4"></div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2"></div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-5/6"></div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
          </>
        );
      default: // medium
        return (
          <>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-3/4"></div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2"></div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-5/6"></div>
          </>
        );
    }
  };

  return (
    <div role="status" className={`animate-pulse space-y-2.5 ${className}`}>
      {getSkeletonItems()}
      <span className="sr-only">Loading...</span>
    </div>
  );
};