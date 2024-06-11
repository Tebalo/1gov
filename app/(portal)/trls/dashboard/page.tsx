import { getSession } from "@/app/auth/auth";
import { AccessDenied } from "@/app/components/AccessDenied";
import { AdminDashboard } from "@/app/components/dashboard/AdminDashboard";
import { DirectorDashboard } from "@/app/components/dashboard/DirectorDashboard";
import { ManagerDashboard } from "@/app/components/dashboard/ManagerDashboard";
import { RegistrarDashboard } from "@/app/components/dashboard/RegistrarDashboard";
import { RegistrationOfficerDashboard } from "@/app/components/dashboard/RegistrationOfficerDashboard";
import { SnrRegistrationOfficerDashboard } from "@/app/components/dashboard/SnrRegistrationOfficerDashboard";
import { TeacherDashboard } from "@/app/components/dashboard/TeacherDashboard";
import { redirect } from "next/navigation";

async function getRole() {
    const session = await getSession();
    let userRole = '';
    const roles = ['MANAGER', 'REGISTRATION_OFFICER', 'SNR_REGISTRATION_OFFICER', , 'DIRECTOR', 'REGISTRAR', 'LICENSE_OFFICER', 'SNR_LICENSE_OFFICER', 'LICENSE_MANAGER', 'ADMIN'];
    
    if(!session?.user?.realm_access){
        redirect('/welcome');
    }
    for(const role of session?.user?.realm_access?.roles || []){
        if(roles.includes(role)){
            userRole = await role;
            break;
        }
    }
    return userRole;
}

export default async function Dashboard(){
    const session = await getSession();
    const userRole = await getRole()

    if(userRole === 'teacher'){
        return <TeacherDashboard/>
    } else if(userRole === 'registration_officer' || userRole === 'REGISTRATION_OFFICER'){
        return <RegistrationOfficerDashboard/>
    } else if(userRole === 'snr_registration_officer' || userRole === 'SNR_REGISTRATION_OFFICER'){
        return <SnrRegistrationOfficerDashboard/>
    } else if(userRole === 'manager' || userRole === 'MANAGER'){
        return <ManagerDashboard/>
    } else if(userRole === 'director' || userRole === 'DIRECTOR'){
        return <DirectorDashboard/>
    } else if(userRole === 'registrar' || userRole === 'REGISTRAR'){
        return <RegistrarDashboard/>
    } else if(userRole === "admin" || userRole === "ADMIN"){
        return <AdminDashboard/>
    } else {
        return <AccessDenied/>
    }
}