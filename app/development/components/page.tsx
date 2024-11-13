import { PageTitle } from "@/app/components/PageTitle";
import ActionButtons from "@/app/components/record/components/ActionItems";

export default function Page() {
    return (
        <div className="min-h-screen p-10">
            <div className="mb-6">
                <PageTitle Title="Components Studio" />
            </div>
            <div className="mb-8">
                <ActionButtons recordId="INQ2024-11-00001" access="investigations_officer" next_status={"Under-Review"}/>
            </div>
        </div>
    )
}