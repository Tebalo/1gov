import { Work } from "../MyWork/work";
import { PageTitle } from "../PageTitle";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { regSchema} from "./data/schema";
import { z } from "zod"
import { getAll, getRegApplications } from "@/app/lib/actions";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecordTable } from "./components/registration-table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { SelectTable } from "./components/select-table";


export const RegistrationOfficerHome = async () => {
    //const tasks = await getRegApplications('Pending-Review','20')
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
                            <SelectTable userRole={"registration_officer"} />
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