'use client'

import React, { ReactNode } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
            {icon}
          </div>
          <h2 className="font-semibold text-lg text-foreground">
            {title}
          </h2>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className={`grid ${getGridCols()} gap-6`}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;