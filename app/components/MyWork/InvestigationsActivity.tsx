'use client'
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mgt, roleObjects } from "@/app/lib/store";
import { Search } from "@/app/components/dashboard/search";
import Link from "next/link";
import { Plus } from "lucide-react";
import TipOffsTable from "../Home/components/tipoffs-table";
import ActivitiesTable from "../Home/components/activities-table";

interface Props {
  userRole: string;
  userid: string;
}

export const InvestigationsActivity = ({ userRole, userid }: Props) => {
  const { activity_object, tipoff_Next_Status, inv_Next_Status, defaultWork } = roleObjects[userRole] || {};
  console.log(userid, userRole)
  const [table, setTable] = useState('Activity');

  const handleSelectChange = (newValue: string) => {
    setTable(newValue);
  }

  const renderTable = () => {
    if (activity_object === false) return null;
    if(table === 'Activity'){
      return <ActivitiesTable userRole={userRole} userid={userid}/>
    }
  }
    
  return (
    <>
      <div className="flex flex-col gap-4 pb-5 md:grid md:grid-cols-2">
        <div className="space-y-4 md:space-y-0">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            {/* Select dropdown */}
            {/* <div className="w-full md:w-auto">
              <Label className="font-light">Show work for</Label>
              <Select onValueChange={handleSelectChange} value={table}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select an application..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Application Type</SelectLabel>
                    {activity_object && <SelectItem value="Activity">My activities</SelectItem>}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div> */}

            {/* Action buttons */}
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 md:items-end">
              <Link 
                href="/trls/work/activity/create" 
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Activity</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {renderTable()}
    </>
  )
}