'use client'
import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Group A', value: 500 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 100 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default class ApplicationStatusPieChart extends PureComponent {
//   static demoUrl = 'https://codesandbox.io/s/pie-chart-with-padding-angle-7ux0o';

  render() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <div className='m-1'>

      <PieChart width={400} height={250}>
        <Pie
          data={data}
          cx={140}
          cy={120}
          innerRadius={70}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        {/* <Pie
          data={data}
          cx={420}
          cy={200}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie> */}
      </PieChart>
      <div className='w-full justify-center italic grid grid-cols-2'>
            <div className='flex w-full justify-center items-center'>
                <span className="flex w-2 h-2 me-3 bg-blue-600 rounded-full"></span>
                <span className='text-xs'>Pending-Review</span>
            </div>
            <div className='flex w-full justify-center items-center'>
                <span className="flex w-2 h-2 me-3 bg-red-500 rounded-full"></span>
                <span className='text-xs'>Pending-Screening</span>
            </div>
            <div className='flex w-full justify-center items-center'>
                <span className="flex w-2 h-2 me-3 bg-green-500 rounded-full"></span>
                <span className='text-xs'>Pending-Review</span>
            </div>
            <div className='flex w-full justify-center items-center'>
                <span className="flex w-2 h-2 me-3 bg-yellow-300 rounded-full"></span>
                <span className='text-xs'>Pending-SRO-Review</span>
            </div>
        </div>
        </div>
      </ResponsiveContainer>
    );
  }
}
