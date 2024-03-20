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
    //console.log('Home page',userRole)
    if(userRole?.includes('teacher') || userRole?.startsWith('teacher')){
        return <TeacherDashboard/>
    } else if(userRole?.includes('registration_officer') || userRole?.startsWith('registration_officer')){
        return <RegistrationOfficerDashboard/>
    } else if(userRole?.includes('snr_registration_officer') || userRole?.startsWith('snr_registration_officer')){
        return <SnrRegistrationOfficerDashboard/>
    } else if(userRole?.includes('manager') || userRole?.startsWith('manager')){
        return <ManagerDashboard/>
    } else if(userRole?.includes('director') || userRole?.startsWith('director')){
        return <DirectorDashboard/>
    } else if(userRole?.includes('registrar') || userRole?.startsWith('registrar')){
        return <RegistrarDashboard/>
    } else if(userRole?.includes("admin") || userRole?.startsWith('admin')){
        return <AdminDashboard/>
    } else {
        return <AccessDenied/>
    }
}