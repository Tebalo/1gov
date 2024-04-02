import { Work } from "../MyWork/work";
import { PageTitle } from "../PageTitle";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { regSchema} from "./data/schema";
import { z } from "zod"
import { getAll, getRegApplications } from "@/app/lib/actions";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

// Simulate a database read for tasks.
async function getTasks() {
    const data = await getAll()  
    return z.array(regSchema).parse(data)
  }

export const LicenseManagerHome = async () => {
    const tasks = await getRegApplications('Pending-Review','20')
    return(
        <>
        <div className="overflow-auto h-screen rounded-lg">
            <div className="mb-5">
                <PageTitle Title="Teacher Registration"/>
            </div>
            <div className="w-full">
                <div className="rounded-lg">
                    <div className="flex space-x-2">
                        <div className="p-2 space-y-2 w-64 items-center flex-1 justify-center border border-gray-200 rounded bg-gray-50">
                        <Label>My Work</Label>
                        <div className="flex space-x-2 items-end">
                            <div>
                                <Label className="font-light">Show work for</Label>
                                <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select an application..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Application Type</SelectLabel>
                                    <SelectItem value="Registration">Registration</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                                </Select>
                            </div>
                                <Work status={"Pending-Review"}/>
                            </div>
                            <div className="">
                                <DataTable data={tasks} columns={columns} />
                            </div>
                        </div>
                        <div className="flex-none w-60 items-center justify-center border shadow border-gray-200 p-6 rounded bg-gray-50">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}