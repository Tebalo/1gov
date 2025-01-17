import { Work } from "@/app/components/Home/components/work/work";
import { PageTitle } from "@/app/components/PageTitle";
import ActionButtons from "@/app/components/record/components/ActionItems";
import AppealsActionButtons from "@/app/components/record/components/AppealsActionItems";
import CPDActionButtons from "@/app/components/record/components/CPDActionItems";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Page() {
    return (
        <div className="min-h-screen p-10">
            <div className="mb-6">
                <PageTitle Title="Components Factory" />
            </div>
            <div className="grid grid-cols-4 space-x-2">
                {/* <div className="border border-spacing-1 border-cyan-800 p-5 rounded-md">
                    <Label>Investigations Action Items</Label>
                    <ActionButtons recordId="INQ2024-11-00001" userRole="investigations_manager" current_status={"assessment"} investigation={undefined} preliminary_investigation={undefined}/>
                </div> */}
                <div className="border border-spacing-1 border-cyan-800 p-5 rounded-md">
                    <Label>CPD Action Items</Label>
                    <CPDActionButtons recordId="INQ2024-11-00001" userRole="teacher_development_manager" current_status={"recommend-for-approval"}/>
                </div>
                <div className="border border-spacing-1 border-cyan-800 p-5 rounded-md">
                    <Label>Appeal Action Items</Label>
                    <AppealsActionButtons recordId="INQ2024-11-00001" userRole="appeals_officer" current_status={"incoming-appeal"}/>
                </div>
            </div>
            <Separator/>
            <div className="my-8">
                <Work userRole="appeals_officer"/>
            </div>
        </div>
    )
}