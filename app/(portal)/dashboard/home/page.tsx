import { getSession } from "@/app/auth/auth";
import { AccessDenied } from "@/app/components/AccessDenied";
import { AdminHome } from "@/app/components/AdminHome";
import { DirectorHome } from "@/app/components/DirectorHome";
import { ManagerHome } from "@/app/components/ManagerHome";
import { RegistrarHome } from "@/app/components/RegistrarHome";
import { RegistrationOfficerHome } from "@/app/components/RegistrationOfficerHome";
import { SnrRegistrationOfficerHome } from "@/app/components/SnrRegistrationOfficerHome";
import { TeacherHome } from "@/app/components/TeacherHome";


export default async function Home(){
    const session = await getSession();
    const userRole = session?.user?.roles[0]
    //console.log('Home page',userRole)
    if(userRole.includes('teacher') || userRole.startsWith('teacher')){
        return <TeacherHome/>
    } else if(userRole === 'registration_officer'){
        return <RegistrationOfficerHome/>
    } else if(userRole === 'snr_registration_officer'){
        return <SnrRegistrationOfficerHome/>
    } else if(userRole === 'manager'){
        return <ManagerHome/>
    } else if(userRole === 'director'){
        return <DirectorHome/>
    } else if(userRole === 'registrar'){
        return <RegistrarHome/>
    } else if(userRole.includes("admin") || userRole.startsWith('admin')){
        return <AdminHome/>
    } else {
        return <AccessDenied/>
    }
}