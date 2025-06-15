import { SelectTable } from "../Home/components/select-table";
import { PageTitle } from "../PageTitle";
import { Label } from "@/components/ui/label";

export const ManagerWork = async () => {
    return(
        <>
          <div className="overflow-auto h-[calc(100vh-4rem-2.5rem)] rounded-lg">
            <div className="mb-5">
                <PageTitle Title="Teacher Registration"/>
            </div>
            <div className="w-full">
                <div className="flex space-x-2">
                    <div className="p-2 space-y-2 w-64 items-center flex-1 justify-center border border-gray-200 rounded bg-gray-50">
                        <Label>My Work</Label>
                        <SelectTable userRole={"manager"} />
                    </div>
                </div>
            </div>
          </div>
        </>
    );
}