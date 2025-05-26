import { getRole} from "@/app/auth/auth";
import { AdminHome } from "@/app/components/Home/AdminHome";
import { TeacherHome } from "@/app/components/Home/TeacherHome";
import { AppealsWorkPage } from "@/app/components/MyWork/APPEALSWork";
import { CPDWorkPage } from "@/app/components/MyWork/CPDWork";
import { InvestigationsDirectorWork } from "@/app/components/MyWork/InvestigationsDirectorWork";
import { InvestigationsManagerWork } from "@/app/components/MyWork/InvestigationsManagerWork";
import { InvestigationsOfficerWork } from "@/app/components/MyWork/InvestigationsOfficerWork";
import { LicenseWorkPage } from "@/app/components/MyWork/LICENSEWork";
import { RegistrarWork } from "@/app/components/MyWork/RegistrarWork";
import { RegistrationWorkPage } from "@/app/components/MyWork/RegistrationWork";
import { SeniorInvestigationsOfficerWork } from "@/app/components/MyWork/SNRInvestigationsOfficerWork";

import {  Role } from "@/app/lib/store";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic';

export default async function Work(){
    const userRole = await getRole()  as Role;

    if(userRole?.includes('CUSTOMER') || userRole?.startsWith('CUSTOMER')){
        return <TeacherHome/>
    } else if(userRole?.toUpperCase() === 'REGISTRATION_OFFICER'){
        return <RegistrationWorkPage userRole={"registration_officer"}/>
    } else if(userRole?.toUpperCase() === 'INVESTIGATIONS_OFFICER'){
        return <InvestigationsOfficerWork/>
    } else if(userRole?.toUpperCase() === 'SENIOR_INVESTIGATIONS_OFFICER'){
        return <SeniorInvestigationsOfficerWork/>
    }else if(userRole?.toUpperCase() === 'INVESTIGATIONS_MANAGER'){
        return <InvestigationsManagerWork/>
    }else if(userRole?.toUpperCase() === 'SNR_REGISTRATION_OFFICER'){
        return <RegistrationWorkPage userRole={"snr_registration_officer"}/>
    } else if(userRole?.toUpperCase() === 'MANAGER'){
        return <RegistrationWorkPage userRole={"manager"}/>
    } else if(userRole?.toUpperCase() === 'INVESTIGATIONS_DIRECTOR'){
        return <InvestigationsDirectorWork/>
    }else if(userRole?.toUpperCase() === 'DISCIPLINARY_COMMITTEE'){
        return <InvestigationsOfficerWork/>
    }else if(userRole?.toUpperCase() === 'DIRECTOR'){
        return <RegistrationWorkPage userRole={"director"}/>
    } else if(userRole?.toUpperCase() === 'TEACHER_DEVELOPMENT_MANAGER'){
        return <CPDWorkPage userRole={"teacher_development_manager"}/>
    }else if(userRole?.toUpperCase() === 'TEACHER_DEVELOPMENT_OFFICER'){
        return <CPDWorkPage userRole={"teacher_development_officer"}/>
    }else if(userRole?.toUpperCase() === 'SENIOR_DEVELOPMENT_OFFICER'){
        return <CPDWorkPage userRole={"senior_development_officer"}/>
    }else if(userRole?.toUpperCase() === 'APPEALS_OFFICER'){
        return <AppealsWorkPage userRole={"appeals_officer"}/>
    }else if(userRole?.toUpperCase() === 'SENIOR_APPEALS_OFFICER'){
        return <AppealsWorkPage userRole={"senior_appeals_officer"}/>
    }else if(userRole?.toUpperCase() === 'APPEALS_MANAGER'){
        return <AppealsWorkPage userRole={"appeals_manager"}/>
    }else if(userRole?.toUpperCase() === 'APPEALS_DIRECTOR'){
        return <AppealsWorkPage userRole={"appeals_director"}/>
    }else if(userRole?.toUpperCase() === 'REGISTRAR'){
        return <RegistrarWork/>
    }else if(userRole?.toUpperCase() === 'LICENSE_OFFICER'){
        return <LicenseWorkPage userRole={"license_officer"}/>
    } else if(userRole?.toUpperCase() === 'SNR_LICENSE_OFFICER'){
        return <LicenseWorkPage userRole={"snr_license_officer"}/>
    } else if(userRole?.toUpperCase() === 'LICENSE_MANAGER'){
        return <LicenseWorkPage userRole={"license_manager"}/>
    } else if(userRole?.toUpperCase() === "ADMIN"){
        return <AdminHome/>
    } else {
        return redirect('/welcome')
    }
}