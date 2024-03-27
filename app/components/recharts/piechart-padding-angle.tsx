'use client'
import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Pending-Review', value: 500 },
  { name: 'Pending-Manager-Review', value: 300 },
  { name: 'Pending-SRO-Review', value: 300 },
  { name: 'Pending-Screening', value: 100 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default class ApplicationStatusPieChart extends PureComponent {
    state = {
        activeIndex: 0,
      };
    
      onPieEnter = (_: any, index: any) => {
        this.setState({
          activeIndex: index,
        });
      };
  render() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <div className='m-1'>
                <PieChart width={400} height={250}>
                    <Pie
                    activeIndex={this.state.activeIndex}
                    // activeShape={renderActiveShape}
                    data={data}
                    cx={175}
                    cy={120}
                    innerRadius={70}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="value"
                    onMouseEnter={this.onPieEnter}
                    >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
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
                        <span className='text-xs'>Pending-Manager-Review</span>
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
