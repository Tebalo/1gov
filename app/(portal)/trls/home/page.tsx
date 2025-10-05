export const dynamic = 'force-dynamic';

import { getRole} from "@/app/auth/auth";
import { AdminHome } from "@/app/components/Home/AdminHome";
import { DisciplinaryCommitteHome } from "@/app/components/Home/DisciplinaryCommitteHome";
import { UserHome } from "@/app/components/Home/Home";
import { InvestigationsDirectorHome } from "@/app/components/Home/InvestigationsDirectorHome";
import { InvestigationsOfficerHome } from "@/app/components/Home/InvestigationsOfficerHome";
import { ManagerHome } from "@/app/components/Home/ManagerHome";
import { RegistrationOfficerHome } from "@/app/components/Home/RegistrationOfficerHome";
import { SnrRegistrationOfficerHome } from "@/app/components/Home/SnrRegistrationOfficerHome";
import { CPDROLES, Role } from "@/app/lib/store";
import { redirect } from "next/navigation";

export default async function Home(){
    const userRole = await getRole() as Role;

    if(userRole?.toUpperCase() === 'REGISTRATION_OFFICER'){
        return <RegistrationOfficerHome/>
        //return <TeacherHome/>
    } else if(userRole?.toUpperCase() === 'INVESTIGATIONS_OFFICER'){
        return <InvestigationsOfficerHome/>
    } else if(userRole?.toUpperCase() === 'INVESTIGATIONS_MANAGER'){
        return <InvestigationsOfficerHome/>
    } else if(userRole?.toUpperCase() === 'SENIOR_INVESTIGATIONS_OFFICER'){
        return <InvestigationsOfficerHome/>
    } else if(userRole?.toUpperCase() === 'SNR_REGISTRATION_OFFICER'){
        return <SnrRegistrationOfficerHome/>
    } else if(userRole?.toUpperCase() === 'MANAGER'){
        return <ManagerHome/>
    } else if(userRole?.toUpperCase() === 'DIRECTOR'){
        return <ManagerHome/>
    }else if(CPDROLES.includes(userRole ?? '')){
        return <UserHome/>
    }else if(userRole?.toUpperCase() === 'INVESTIGATIONS_DIRECTOR'){
        return <InvestigationsDirectorHome/>
    } else if(userRole?.toUpperCase() === 'DISCIPLINARY_COMMITTEE'){
        return <DisciplinaryCommitteHome/>
    }else if(userRole?.toUpperCase() === 'REGISTRAR'){
        return <ManagerHome/>
    }else if(userRole?.toUpperCase() === 'LICENSE_OFFICER'){
        return <UserHome/>
    } else if(userRole?.toUpperCase() === 'SNR_LICENSE_OFFICER'){
        return <UserHome/>
    } else if(userRole?.toUpperCase() === 'LICENSE_MANAGER'){
        return <UserHome/>
    } else if(userRole?.toUpperCase() === "ADMIN"){
        return <AdminHome/>
    } else {
        return redirect('/welcome')
    }
}