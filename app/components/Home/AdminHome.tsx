import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DoughtnutCard from "../(charts)/_DoughtnutCard";
import MyWork from "../dashboard/(tables)/_myWork";
import { PageTitle } from "../PageTitle";
import { SearchCheck } from "lucide-react";
import { CreateInvestigation } from "../MyWork/components/createInvestigation";
import RolePermissionsForm from "./components/admin/RolePermissionForm";

export const AdminHome = () => {
    return(
        <>
        <div className="overflow-auto h-screen rounded-lg">
            <div className="mb-5">
                <PageTitle Title="Teacher Registration and Licensing"/>
            </div>
            <div className="w-full">
                <RolePermissionsForm/>
            </div>
        </div>
        </>
    );
}