import { Work } from "../MyWork/work";
import { PageTitle } from "../PageTitle";
import { getRegApplications } from "@/app/lib/actions";
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
  import { RecordTable } from "./components/registration-table";
import { SelectTable } from "./components/select-table";
import { Label } from "@/components/ui/label";

export const SnrRegistrationOfficerHome = () => {
    return(
        <>
        <div className="overflow-auto h-screen rounded-lg">
            <div className="mb-5">
                <PageTitle Title="Teacher Registration"/>
            </div>
            <div className="w-full">
                <div className="flex space-x-2">
                    <div className="p-2 space-y-2 w-64 items-center flex-1 justify-center border border-gray-200 rounded bg-gray-50">
                        <Label>My Work</Label>
                        <SelectTable userRole={"snr_registration_officer"} />
                    </div>
                </div>
            </div>
          </div>
        </>
    );
}