import { getSession } from "@/app/auth/auth";
import { ApplicationForTeacherRegistration } from "@/app/components/record/AppForTeacherRegistration";
import CaseDetails from "@/app/components/record/record-details";
import WorkArea from "@/app/components/record/work-area";
import { getRegById } from "@/app/lib/actions";
import Link from "next/link";
import { redirect } from "next/navigation";
async function getRole() {
    const session = await getSession();
    let userRole = '';
    const roles = ['REGISTRATION_OFFICER', 'SNR_REGISTRATION_OFFICER', 'MANAGER', 'DIRECTOR', 'REGISTRAR', 'LICENSE_OFFICER', 'SNR_LICENSE_OFFICER', 'LICENSE_MANAGER', 'ADMIN'];
    
    if(!session?.user?.realm_access){
        redirect('/welcome');
    }
    for(const role of session?.user?.realm_access?.roles || []){
        if(roles.includes(role)){
            userRole = role;
            break;
        }
    }
    return userRole;
}

export default async function Page({params}:{params: {slug: string}}){
    const id = await params.slug;
    const work = await getRegById(id)
    const session = await getSession();
    const userRole = await getRole()
    return (
        <main className="h-full">
            <div className="flex flex-row h-full gap-0">
                {work ? (
                    <>
                        <ApplicationForTeacherRegistration data={work} userRole={userRole}/>
                        {/* <CaseDetails data={work} userRole={userRole}/>
                        <WorkArea userRole={userRole} data={work}/> */}
                    </>):(
                        <div className="w-full md:h-96 items-center flex justify-center">
                            <div>
                                <h2 className="text-center text-black text-3xl">Work not found!</h2>
                                <div className="flex items-center justify-center">
                                    <Link
                                    href='/trls/home'
                                    scroll={false}
                                    >
                                        <button
                                        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                                        >
                                            Home
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                }
                {/**<Utilities/>*/}
            </div>
       </main>
    );
};
