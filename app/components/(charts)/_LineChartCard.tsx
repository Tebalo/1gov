"use client"
import 'chart.js/auto'; //https://react-chartjs-2.netlify.app/docs/migration-to-v4/#tree-shaking
import { Line } from "react-chartjs-2";

interface ChartProps{
    data:any;
    options:any;
}
interface CardProps{
    title: string;
    chartData: any;
    options: any;
}
const Chart: React.FC<ChartProps> = ({data, options}) =>{
    return <Line 
        options={options}
        data={data}/>
}
const LineChartCard: React.FC<CardProps> = ({chartData, options}) =>{
    return(
        <Chart data={chartData} options={options}/>
    );
}
export default LineChartCard;