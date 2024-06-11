import { getSession } from "@/app/auth/auth";
import { AccessDenied } from "@/app/components/AccessDenied";
import { AdminHome } from "@/app/components/Home/AdminHome";
import { DirectorHome } from "@/app/components/Home/DirectorHome";
import { LicenseManagerHome } from "@/app/components/Home/LicenseManagerHome";
import { LicenseOfficerHome } from "@/app/components/Home/LicenseOfficerHome";
import { ManagerHome } from "@/app/components/Home/ManagerHome";
import { RegistrarHome } from "@/app/components/Home/RegistrarHome";
import { RegistrationOfficerHome } from "@/app/components/Home/RegistrationOfficerHome";
import { SnrLicenseOfficerHome } from "@/app/components/Home/SnrLicenseOfficerHome";
import { SnrRegistrationOfficerHome } from "@/app/components/Home/SnrRegistrationOfficerHome";
import { TeacherHome } from "@/app/components/Home/TeacherHome";
import { redirect } from "next/navigation";

export default async function Home(){
    const session = await getSession();
    //const userRole = session?.user?.realm_access?.roles[0]
    const roles = ['REGISTRATION_OFFICER', 'SNR_REGISTRATION_OFFICER', 'MANAGER', 'DIRECTOR', 'REGISTRAR', 'LICENSE_OFFICER', 'SNR_LICENSE_OFFICER', 'LICENSE_MANAGER', 'ADMIN'];
    
    let userRole = '';

    for(const role of session?.user?.realm_access?.roles || []){
        if(roles.includes(role)){
            userRole = role;
            break;
        }
    }
    if(!session?.user?.realm_access){
        redirect('/welcome');
    }

    if(userRole?.includes('teacher') || userRole?.startsWith('teacher')){
        return <TeacherHome/>
    } else if(userRole === 'registration_officer' || userRole === 'REGISTRATION_OFFICER'){
        return <RegistrationOfficerHome/>
    } else if(userRole === 'snr_registration_officer' || userRole === 'SNR_REGISTRATION_OFFICER'){
        return <SnrRegistrationOfficerHome/>
    } else if(userRole === 'manager' || userRole === 'MANAGER'){
        return <ManagerHome/>
    } else if(userRole === 'director' || userRole === 'DIRECTOR'){
        return <DirectorHome/>
    } else if(userRole === 'registrar' || userRole === 'REGISTRAR'){
        return <RegistrarHome/>
    }else if(userRole === 'license_officer' || userRole === 'LICENSE_OFFICER'){
        return <LicenseOfficerHome/>
    } else if(userRole === 'snr_license_officer' || userRole === 'SNR_LICENSE_OFFICER'){
        return <SnrLicenseOfficerHome/>
    } else if(userRole === 'license_manager' || userRole === 'LICENSE_MANAGER'){
        return <LicenseManagerHome/>
    } else if(userRole === "admin" || userRole === "ADMIN"){
        return <AdminHome/>
    } else {
        return <AccessDenied/>
    }
}