import CaseDetails from "@/app/components/case/casedetails";
import StudentWorkArea from "@/app/components/case/studentWorkArea";
//import Utilities from "@/app/components/case/utilities";
import WorkArea from "@/app/components/case/workarea";
import { getNext } from "@/app/lib/actions";
import { apiUrl } from "@/app/lib/store";
import Link from "next/link";
import { redirect } from 'next/navigation'
import { Metadata } from "next";

const Page: React.FC = async () => {
    //revalidate('work')
    const work = await getNext('Pending-Review')
    const filepath = `${apiUrl}/Qualifications/`
    if(!work){
      redirect('/trls/home')
    }
    
    return (
        <main className="h-full">
            <div className="flex flex-row h-full gap-1">
                {work !== null ? (
                    <>
                        <CaseDetails {...work}/>
                        {work.teacher_registrations?.registration_type === 'teacher' || 'Teacher' ? (<WorkArea {...work}/>):
                        (<StudentWorkArea {...work}/>)}:
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
                                        Dashboard
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>)
                }
                {/**<Utilities/>*/}
            </div>
       </main>
    );
};

export default Page; 