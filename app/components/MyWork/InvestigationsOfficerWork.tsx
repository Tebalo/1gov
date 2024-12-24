import { Work } from "../Home/components/work/work";
import { PageTitle } from "../PageTitle";
import { Label } from "@/components/ui/label";

export const InvestigationsOfficerWork = () => {
  return (
    <div className="overflow-auto h-screen rounded-lg">
      <div className="mb-5">
        <PageTitle Title="My Work" />
      </div>
      <div className="w-full">
        <div className="rounded-lg">
          <div className="flex space-x-2">
            <div className="p-2 space-y-2 w-64 items-center flex-1 justify-center border border-gray-200 rounded bg-gray-50">
                <div className="flex">
                <Label>My Assignments</Label>
                </div>
                <Work userRole="investigations_officer"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}