import { getAccessGroups, getRole } from "@/app/auth/auth";
import { InvestigationsActivity } from "@/app/components/MyWork/InvestigationsActivity";

export default async function Activity(){
    const profile = await getAccessGroups();

    if(profile?.current.toUpperCase() === 'INVESTIGATIONS_OFFICER'){
        return <InvestigationsActivity userRole={profile.current} userid={profile.userid}/>;
    } else if(profile?.current.toUpperCase() === 'INVESTIGATIONS_MANAGER'){
        return <InvestigationsActivity userRole={profile.current} userid={profile.userid}/>;
    }else if(profile?.current.toUpperCase() === 'INVESTIGATIONS_MANAGER'){
        return <InvestigationsActivity userRole={profile.current} userid={profile.userid}/>;
    }else{
        <>Access denied</>
    }
}