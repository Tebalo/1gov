import { InvestigationsWork } from "@/app/components/Home/components/investigations/investigationswork";
import { PageTitle } from "@/app/components/PageTitle";
import ActionButtons from "@/app/components/record/components/ActionItems";
import { Separator } from "@/components/ui/separator";

export default function Page() {
    return (
        <div className="min-h-screen p-10">
            <div className="mb-6">
                <PageTitle Title="Components Factory" />
            </div>
            <div className="mb-8">
                <ActionButtons recordId="INQ2024-11-00001" userRole="investigations_manager" current_status={"assessment"}/>
            </div>
            <Separator/>
            <div className="my-8">
                <InvestigationsWork userRole="investigations_manager"/>
            </div>
        </div>
    )
}