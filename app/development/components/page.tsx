import { Work } from "@/app/components/Home/components/work/work";
import { PageTitle } from "@/app/components/PageTitle";
import ActionButtons from "@/app/components/record/components/ActionItems";
import AppealsActionButtons from "@/app/components/record/components/AppealsActionItems";
import CPDActionButtons from "@/app/components/record/components/CPDActionItems";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Page() {
    return (
        <div className="min-h-screen w-full bg-white relative flex flex-col flex-grow p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-spacing-1 border-cyan-800 p-5 rounded-md">
                    <Label>CPD Action Items</Label>
                    <CPDActionButtons 
                        recordId="INQ2024-11-00001" 
                        userRole="teacher_development_manager" 
                        current_status={"recommend-for-approval"}
                    />
                </div>
                <div className="border border-spacing-1 border-cyan-800 p-5 rounded-md">
                    <Label>Appeal Action Items</Label>
                    <AppealsActionButtons 
                        recordId="INQ2024-11-00001" 
                        userRole="appeals_officer" 
                        current_status={"incoming-appeal"}
                    />
                </div>
            </div>
            <Separator className="my-6"/>
            <div className="flex-grow">
                <Work userRole="appeals_officer"/>
            </div>
        </div>
    )
}