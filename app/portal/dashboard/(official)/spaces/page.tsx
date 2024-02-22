import React from 'react';
import DoughtnutCard from '@/app/components/(charts)/_DoughtnutCard';
import TableFilter from '@/app/components/(tables)/_tablefilter';
import LineChartCard from '@/app/components/(charts)/_LineChartCard';
import { fakerDE as faker } from '@faker-js/faker';

const Index: React.FC = () => {
  return (
      <div className="p-4 overflow-auto h-screen rounded-lg">
            <div className="w-full">
                <div className="rounded-lg">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex-row items-center justify-center h-96 border shadow border-gray-200 p-6 rounded-lg bg-gray-50">
                        </div>
                        <div className="flex col-span-2 items-center justify-center h-96 border border-gray-200 rounded bg-gray-50">
                        </div>
                        <div className="flex-row col-span-3 items-center justify-center h-96 border shadow border-gray-200 p-6 rounded-lg bg-gray-50">
                        </div>
                        <div className="flex col-span-2 items-center justify-center h-96 border border-gray-200 rounded bg-gray-50">
                        </div>
                        <div className="flex-row items-center justify-center h-96 border shadow border-gray-200 p-6 rounded-lg bg-gray-50">
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
};

export default Index;