import { getRole, getSession } from "@/app/auth/auth";
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
import { DirectorWork } from "@/app/components/MyWork/DirectorWork";
import { ManagerWork } from "@/app/components/MyWork/ManagerWork";
import { RegistrarWork } from "@/app/components/MyWork/RegistrarWork";
import { RegistrationOfficerWork } from "@/app/components/MyWork/RegistrationOfficerWork";
import { SnrRegistrationOfficerWork } from "@/app/components/MyWork/SnrRegistrationOfficerWork";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic';
export default async function Work(){
    const userRole = await getRole()

    if(userRole?.includes('CUSTOMER') || userRole?.startsWith('CUSTOMER')){
        return <TeacherHome/>
    } else if(userRole?.toUpperCase() === 'REGISTRATION_OFFICER'){
        return <RegistrationOfficerWork/>
    } else if(userRole?.toUpperCase() === 'SNR_REGISTRATION_OFFICER'){
        return <SnrRegistrationOfficerWork/>
    } else if(userRole === 'MANAGER'){
        return <ManagerWork/>
    } else if(userRole?.toUpperCase() === 'DIRECTOR'){
        return <DirectorWork/>
    } else if(userRole?.toUpperCase() === 'REGISTRAR'){
        return <RegistrarWork/>
    }else if(userRole?.toUpperCase() === 'LICENSE_OFFICER'){
        return <LicenseOfficerHome/>
    } else if(userRole?.toUpperCase() === 'SNR_LICENSE_OFFICER'){
        return <SnrLicenseOfficerHome/>
    } else if(userRole?.toUpperCase() === 'LICENSE_MANAGER'){
        return <LicenseManagerHome/>
    } else if(userRole?.toUpperCase() === "ADMIN"){
        return <AdminHome/>
    } else {
        return redirect('/welcome')
    }
}