import { getSession } from "@/app/auth/auth";
import { AccessDenied } from "@/app/components/AccessDenied";
import { AdminDashboard } from "@/app/components/AdminDashboard";
import { DirectorDashboard } from "@/app/components/DirectorDashboard";
import { ManagerDashboard } from "@/app/components/ManagerDashboard";
import { RegistrarDashboard } from "@/app/components/RegistrarDashboard";
import { RegistrationOfficerDashboard } from "@/app/components/RegistrationOfficerDashboard";
import { SnrRegistrationOfficerDashboard } from "@/app/components/SnrRegistrationOfficerDashboard";
import { TeacherDashboard } from "@/app/components/TeacherDashboard";
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