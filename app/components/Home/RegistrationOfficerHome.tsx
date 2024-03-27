import { ScrollArea } from "@/components/ui/scroll-area";
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

export const RegistrationOfficerHome = async () => {
    const tasks = await getRegApplications('Pending-Review','20')
    return(
        <>
        <div className="overflow-auto h-screen rounded-lg">
            <div className="mb-5">
                <PageTitle Title="Teacher Registration"/>
            </div>
            <div className="w-full">
                <div className="rounded-lg">
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-4">
                        <div className="p-2 space-y-2 md:col-span-2 items-center justify-center md:h-96 border border-gray-200 rounded bg-gray-50">
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
                                <ScrollArea className="h-96">
                                    <DataTable data={tasks} columns={columns} />
                                </ScrollArea>
                            </div>
                        </div>
                        <div className="flex-row items-center justify-center md:h-96 border shadow border-gray-200 p-6 rounded bg-gray-50">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}