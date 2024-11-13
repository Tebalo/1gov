'use client'

import React, { ReactNode } from 'react';
// import { InfoItem } from './InfoItem';

interface InfoCardProps {
  title: string;
  icon: ReactNode;
  children: React.ReactNode;
}

const InfoCardTwo: React.FC<InfoCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center mb-2">
        <span className="mr-2">{icon}</span>
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
      </div>
      <div className="h-0.5 w-full bg-blue-400 rounded-full mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
};

export default InfoCardTwo;