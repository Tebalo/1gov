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

export default async function Dashboard(){
    const session = await getSession();
    const userRole = session?.user?.roles[0]
    if(!session?.user?.access){
        redirect('/welcome')
      }
    if(userRole === 'teacher'){
        return <TeacherDashboard/>
    } else if(userRole === 'registration_officer'){
        return <RegistrationOfficerDashboard/>
    } else if(userRole === 'snr_registration_officer'){
        return <SnrRegistrationOfficerDashboard/>
    } else if(userRole === 'manager'){
        return <ManagerDashboard/>
    } else if(userRole === 'director'){
        return <DirectorDashboard/>
    } else if(userRole === 'registrar'){
        return <RegistrarDashboard/>
    } else if(userRole === "admin"){
        return <AdminDashboard/>
    } else {
        return <AccessDenied/>
    }
}