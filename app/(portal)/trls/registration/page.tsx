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
import { AppealsWorkPage } from "@/app/components/MyWork/APPEALSWork";
import { CPDWorkPage } from "@/app/components/MyWork/CPDWork";
import { DirectorWork } from "@/app/components/MyWork/DirectorWork";
import { DisciplinaryCommitteWork } from "@/app/components/MyWork/DisciplinaryCommitteWork";
import { InvestigationsDirectorWork } from "@/app/components/MyWork/InvestigationsDirectorWork";
import { InvestigationsManagerWork } from "@/app/components/MyWork/InvestigationsManagerWork";
import { InvestigationsOfficerWork } from "@/app/components/MyWork/InvestigationsOfficerWork";
import { ManagerWork } from "@/app/components/MyWork/ManagerWork";
import { RegistrarWork } from "@/app/components/MyWork/RegistrarWork";
import { RegistrationOfficerWork } from "@/app/components/MyWork/RegistrationOfficerWork";
import { RegistrationWorkPage } from "@/app/components/MyWork/RegistrationWork";
import { SeniorInvestigationsOfficerWork } from "@/app/components/MyWork/SNRInvestigationsOfficerWork";
import { SnrRegistrationOfficerWork } from "@/app/components/MyWork/SnrRegistrationOfficerWork";
import {  Role } from "@/app/lib/store";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic';
export default async function Work(){
    const userRole = await getRole() as Role;

    if(userRole?.includes('CUSTOMER') || userRole?.startsWith('CUSTOMER')){
        return <TeacherHome/>
    } else if(userRole?.toUpperCase() === 'REGISTRATION_OFFICER'){
        return <RegistrationOfficerWork/>
    } else if(userRole?.toUpperCase() === 'SNR_REGISTRATION_OFFICER'){
        return <SnrRegistrationOfficerWork/>
    } else if(userRole.toUpperCase() === 'MANAGER'){
        return <ManagerWork/>
    } else if(userRole?.toUpperCase() === 'DIRECTOR'){
        return <DirectorWork/>
    } else if(userRole?.toUpperCase() === 'REGISTRAR'){
        return <RegistrarWork/>
    }else {
        return redirect('/welcome')
    }
}