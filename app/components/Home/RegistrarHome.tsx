import { ScrollArea } from "@/components/ui/scroll-area";
import { Work } from "../MyWork/work";
import { PageTitle } from "../PageTitle";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { getRegApplications } from "@/app/lib/actions";
import { SelectTable } from "./components/select-table";
import { Label } from "@/components/ui/label";

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
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-4">
                    <div className="flex-row items-center justify-center md:h-96 border shadow border-gray-200 p-6 rounded-lg bg-gray-50">
                    </div>
                    <div className="p-2 space-y-2 md:col-span-2 items-center justify-center md:h-96 border border-gray-200 rounded bg-gray-50">
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