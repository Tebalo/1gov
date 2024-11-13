import RolePermissionsForm from "@/app/components/Home/components/admin/RolePermissionForm";
import { PageTitle } from "@/app/components/PageTitle";

export default async function DevelopmentStudio() {
    return(
        <>
        <div className="overflow-auto h-screen rounded-lg">
            <div className="mb-5">
                <PageTitle Title="Development Studio"/>
            </div>
            <div className="w-full">
                <RolePermissionsForm/>
            </div>
        </div>
        </>
    );
}