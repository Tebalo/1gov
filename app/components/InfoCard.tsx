'use client'

import React, { ReactNode } from 'react';
// import { InfoItem } from './InfoItem';

interface InfoCardProps {
  title: string;
  icon: ReactNode;
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <div className="flex items-center mb-2">
        {icon}
        <h2 className="text-xl font-semibold ml-2">{title}</h2>
      </div>
      <div className="h-0.5 w-full bg-blue-400 rounded-full mb-4"></div>
      <div className="grid grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
};

export default InfoCard;