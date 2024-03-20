import { getSession } from "@/app/auth/auth";
import { AccessDenied } from "@/app/components/AccessDenied";
import { AdminHome } from "@/app/components/AdminHome";
import { DirectorHome } from "@/app/components/DirectorHome";
import { ManagerHome } from "@/app/components/ManagerHome";
import { RegistrarHome } from "@/app/components/RegistrarHome";
import { RegistrationOfficerHome } from "@/app/components/RegistrationOfficerHome";
import { SnrRegistrationOfficerHome } from "@/app/components/SnrRegistrationOfficerHome";
import { TeacherHome } from "@/app/components/TeacherHome";
import { redirect } from "next/navigation";


export default async function Home(){
    const session = await getSession();
    const userRole = session?.user?.roles[0]
    if(!session?.user?.access){
        redirect('/welcome')
      }
    //console.log('Home page',userRole)
    if(userRole?.includes('teacher') || userRole?.startsWith('teacher')){
        return <TeacherHome/>
    } else if(userRole?.includes('registration_officer') || userRole?.startsWith('registration_officer')){
        return <RegistrationOfficerHome/>
    } else if(userRole?.includes('snr_registration_officer') || userRole?.startsWith('snr_registration_officer')){
        return <SnrRegistrationOfficerHome/>
    } else if(userRole?.includes('manager') || userRole?.startsWith('manager')){
        return <ManagerHome/>
    } else if(userRole?.includes('director') || userRole?.startsWith('director')){
        return <DirectorHome/>
    } else if(userRole?.includes('registrar') || userRole?.startsWith('registrar')){
        return <RegistrarHome/>
    } else if(userRole?.includes("admin") || userRole?.startsWith('admin')){
        return <AdminHome/>
    } else {
        return <AccessDenied/>
    }
}