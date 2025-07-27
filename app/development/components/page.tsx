import { Work } from "@/app/components/Home/components/work/work";

export default function Page() {
    return (
        <div className="min-h-screen w-full bg-white relative flex flex-col flex-grow p-4 md:p-6">
            <div className="flex-grow">
                <Work userRole="registration_officer"/>
            </div>
        </div>
    )
}