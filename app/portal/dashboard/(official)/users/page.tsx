import React from 'react';
import DoughtnutCard from '@/app/components/(charts)/_DoughtnutCard';
import TableFilter from '@/app/components/(tables)/_tablefilter';
import LineChartCard from '@/app/components/(charts)/_LineChartCard';
import { fakerDE as faker } from '@faker-js/faker';

const Index: React.FC = () => {
    const doughtnutData = {
        labels: ['New', 'Pending-Approval', 'Pending-Payment'],
        datasets: [
          {
            data: [300, 50, 100],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      };
    const doughtnutOptions={
        responsive:true,
        maintainAspectRatio: true,
        plugins:{
            legend:{
                position: 'bottom' as const,
            },
            title:{
                display: true,
                text: 'Teacher Registrations By Status'
            }
        }
      }
      const lineoptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Teacher vs Student-Teacher Registration',
          },
        },
      };
      
      const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
      
     const linedata = {
        labels,
        datasets: [
          {
            label: 'Teacher License Application',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Student-Teacher License Application',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
  return (
      <div className="p-4 overflow-auto h-screen rounded-lg">
            <div className="w-full">
                <div className="rounded-lg">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex-row items-center justify-center h-96 border shadow border-gray-200 p-6 rounded-lg bg-gray-50">
                        </div>
                        <div className="flex col-span-1 items-center justify-center h-96 border border-gray-200 rounded bg-gray-50">
                        </div>
                        <div className="flex-row items-center justify-center h-96 border shadow border-gray-200 p-6 rounded-lg bg-gray-50">
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