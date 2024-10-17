export const dynamic = 'force-dynamic';
import { getRole, getSession } from "@/app/auth/auth";
import { AccessDenied } from "@/app/components/AccessDenied";
import { AdminDashboard } from "@/app/components/dashboard/AdminDashboard";
import { DirectorDashboard } from "@/app/components/dashboard/DirectorDashboard";
import { InvestigationsOfficerDashboard } from "@/app/components/dashboard/InvestigationsOfficerDashboard";
import { ManagerDashboard } from "@/app/components/dashboard/ManagerDashboard";
import { RegistrarDashboard } from "@/app/components/dashboard/RegistrarDashboard";
import { RegistrationOfficerDashboard } from "@/app/components/dashboard/RegistrationOfficerDashboard";
import { SnrRegistrationOfficerDashboard } from "@/app/components/dashboard/SnrRegistrationOfficerDashboard";
import { TeacherDashboard } from "@/app/components/dashboard/TeacherDashboard";

export default async function Dashboard(){
    const userRole = await getRole()
    if(userRole === 'teacher'){
        return <TeacherDashboard/>
    } else if(userRole?.toUpperCase() === 'REGISTRATION_OFFICER'){
        return <RegistrationOfficerDashboard/>
    }else if(userRole?.toUpperCase() === 'INVESTIGATIONS_OFFICER'){
        return <InvestigationsOfficerDashboard/>
    } else if(userRole?.toUpperCase() === 'SNR_REGISTRATION_OFFICER'){
        return <SnrRegistrationOfficerDashboard/>
    } else if(userRole?.toUpperCase() === 'MANAGER'){
        return <ManagerDashboard/>
    } else if(userRole?.toUpperCase() === 'DIRECTOR'){
        return <DirectorDashboard/>
    } else if(userRole?.toUpperCase() === 'REGISTRAR'){
        return <RegistrarDashboard/>
    } else if(userRole?.toUpperCase() === "ADMIN"){
        return <AdminDashboard/>
    } else {
        return <AccessDenied/>
    }
}