'use client'

import React, { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  icon: ReactNode;
  children: React.ReactNode;
  columns?: number;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  title, 
  icon, 
  children, 
  columns = 3 
}) => {
  const getGridCols = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center mb-2 bg-zinc-100 p-2 rounded-md">
        <span className="mr-2">{icon}</span>
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
      </div>
      {/* <div className="h-0.5 w-full bg-blue-400 rounded-full mb-4"></div> */}
      <div className={`grid ${getGridCols()} gap-4`}>
        {children}
      </div>
    </div>
  );
};

export default InfoCard;