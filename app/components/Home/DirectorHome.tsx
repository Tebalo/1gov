import { ScrollArea } from "@/components/ui/scroll-area";
import { Work } from "../MyWork/work";
import { PageTitle } from "../PageTitle";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { getRegApplications } from "@/app/lib/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "recharts";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import ApplicationStatusPieChart from "../recharts/piechart-padding-angle";
import { Suspense } from "react";

export const DirectorHome = async () => {
    const tasks = await getRegApplications('Pending-Director-Review','20')
    return(
      <>
      <div className="overflow-auto h-screen rounded-lg">
        <div className="mb-5">
            <PageTitle Title="Teacher Registration and Licensing"/>
        </div>
        <div className="w-full">
            <div className="rounded-lg">
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-4">
                    <div className="flex-row items-center justify-center border shadow border-gray-200 p-2 rounded-lg bg-gray-50">
                    <h3 className="text-sm mb-1">Show statuses for</h3>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select an application..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Application Type</SelectLabel>
                          <SelectItem value="apple">Registration</SelectItem>
                          <SelectItem value="banana">License renewal</SelectItem>
                          <SelectItem value="blueberry">License</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Suspense fallback='Loading...'>
                      <ApplicationStatusPieChart/>
                    </Suspense>
                    </div>
                    <div className="p-2 space-y-2 md:col-span-2 items-center justify-center md:h-96 border border-gray-200 rounded bg-gray-50">
                      <Work status={"Pending-Director-Review"}/>
                      <ScrollArea className="h-96">
                          <DataTable data={tasks} columns={columns} />
                      </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
    );
}