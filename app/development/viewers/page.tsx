import { PageTitle } from "@/app/components/PageTitle";
import RenewalContent from "./components/page";

export default async function Page() {
    return(
        <>
        <div className="overflow-auto h-screen rounded-lg">
            <div className="mb-5">
                <PageTitle Title="Viewers"/>
            </div>
            <div className="w-full">
                <RenewalContent/>
            </div>
        </div>
        </>
    );
}