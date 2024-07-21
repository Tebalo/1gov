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
import { SelectTable } from "../Home/components/select-table";

export const DirectorWork = async () => {
    return(
      <>
      <div className="overflow-auto h-screen rounded-lg">
        <div className="mb-5">
            <PageTitle Title="Teacher Registration and Licensing"/>
        </div>
        <div className="w-full">
            <div className="rounded-lg">
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-4">
                    <div className="p-2 space-y-2 md:col-span-3 items-center justify-center md:h-fit border border-gray-200 rounded bg-gray-50">                      
                      <Label>My Work</Label>
                      <SelectTable userRole={"director"} />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
    );
}