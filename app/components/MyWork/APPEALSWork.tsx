import { Role } from "@/app/lib/store";
import { PageTitle } from "../PageTitle";
import { Label } from "@/components/ui/label";
import { Work } from "../Home/components/work/work";

interface Props {
  userRole: Role;
}

export const AppealsWorkPage = ({userRole}:Props) => {
  return (
    <div className="overflow-auto h-screen rounded-lg">
      <div className="mb-5">
        <PageTitle Title="Appeals" />
      </div>
      <div className="w-full">
        <div className="rounded-lg">
          <div className="flex space-x-2">
            <div className="p-2 space-y-2 w-64 items-center flex-1 justify-center border border-gray-200 rounded bg-gray-50">
              <Label>My Work</Label>
                <Work userRole={userRole}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}