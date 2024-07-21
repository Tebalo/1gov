import { PageTitle } from "../PageTitle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ApplicationStatusPieChart from "../recharts/piechart-padding-angle";
import { Suspense } from "react";
import { Label } from "@/components/ui/label";
import { SelectTable } from "./components/select-table";

export const DirectorHome = async () => {
    return(
      <>
      <div className="overflow-auto h-screen rounded-lg">
        <div className="mb-5">
            <PageTitle Title="Welcome to Teacher Registration and Licensing System"/>
        </div>
        <div className="w-full">
            <div className="rounded-lg">
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-4">
                    <div className="flex-row items-center justify-center border shadow border-gray-200 p-1 h-fit rounded bg-gray-50 space-x-2">
                      <Label>Applications by status</Label>
                      <div>
                        <Label className="font-light">Show statuses for</Label>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select an application..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Application Type</SelectLabel>
                              <SelectItem value="Registration">Registration</SelectItem>
                              <SelectItem value="License renewal">License renewal</SelectItem>
                              <SelectItem value="License">License</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Suspense fallback='Loading...'>
                          <ApplicationStatusPieChart/>
                        </Suspense>
                      </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
    );
}