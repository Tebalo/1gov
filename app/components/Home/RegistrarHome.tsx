import { PageTitle } from "../PageTitle";
import { getRegApplications } from "@/app/lib/actions";
import { SelectTable } from "./components/select-table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export const RegistrarHome = async () => {
   const tasks = await getRegApplications('Pending-Registrar-Review','20')
    return(
    <>
      <div className="overflow-auto h-screen rounded-lg">
        <div className="mb-5">
            <PageTitle Title="Teacher Registration and Licensing"/>
        </div>
        <div className="w-full">
            <div className="rounded-lg">
                <div className="flex w-full">
                    <div className="p-2 space-y-2 w-64 items-center flex-1 justify-center border border-gray-200 rounded bg-gray-50">                      
                      <Label>My Work</Label>
                      <SelectTable userRole={"registrar"} />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
    );
}