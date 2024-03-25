import { ScrollArea } from "@/components/ui/scroll-area";
import { Work } from "../MyWork/work";
import { PageTitle } from "../PageTitle";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { regSchema, taskSchema } from "./data/schema";
import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import { getAll, getRegApplications } from "@/app/lib/actions";

// Simulate a database read for tasks.
async function getTasks() {
    // const data = await fs.readFile(
    //   path.join(process.cwd(), "app/(portal)/trls/applications/data/task.json")
    // )
    const data = await getAll()
    // const tasks = JSON.parse(data.toString())
  
    return z.array(regSchema).parse(data)
  }

export const RegistrationOfficerHome = async () => {
    const tasks = await getRegApplications('Pending-Review','20')
    // console.log(tasks)
    return(
        <>
        <div className="overflow-auto h-screen rounded-lg">
            <div className="mb-5">
                <PageTitle Title="Teacher Registration"/>
            </div>
            <div className="w-full">
                <div className="rounded-lg">
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-4">
                        <div className="flex-row items-center justify-center md:h-96 border shadow border-gray-200 p-6 rounded-lg bg-gray-50">
                        </div>
                        <div className="p-2 space-y-2 md:col-span-2 items-center justify-center md:h-96 border border-gray-200 rounded bg-gray-50">
                            <Work status={"Pending-Review"}/>
                            <div className="">
                            <ScrollArea className="h-96">
                                <DataTable data={tasks} columns={columns} />
                            </ScrollArea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}