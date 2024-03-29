import React from 'react';
import DoughtnutCard from '@/app/components/(charts)/_DoughtnutCard';
import TableFilter from '@/app/components/dashboard/(tables)/_tablefilter';
import LineChartCard from '@/app/components/(charts)/_LineChartCard';
import { fakerDE as faker } from '@faker-js/faker';

const Index: React.FC = () => {
  return (
            <div className="">
                <div className="rounded-lg">
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-4">
                        <div className="flex-row items-center justify-center h-96 border shadow border-gray-200 p-6 rounded-lg bg-gray-50">
                        </div>
                        <div className="flex lg:col-span-2 items-center justify-center h-96 border border-gray-200 rounded bg-gray-50">
                        </div>
                        <div className="flex-row lg:col-span-3 items-center justify-center h-96 border shadow border-gray-200 p-6 rounded-lg bg-gray-50">
                        </div>
                        <div className="flex lg:col-span-2 items-center justify-center h-96 border border-gray-200 rounded bg-gray-50">
                        </div>
                        <div className="flex-row items-center justify-center h-96 border shadow border-gray-200 p-6 rounded-lg bg-gray-50">
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default Index;