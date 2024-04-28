import { getSession } from "@/app/auth/auth";
import { ApplicationForTeacherRegistration } from "@/app/components/record/AppForTeacherRegistration";
import { ApplicationForStudentLicense } from "@/app/components/record/ApplicationForStudentLicense";
import CaseDetails from "@/app/components/record/record-details";
import WorkArea from "@/app/components/record/work-area";
import { getLicenseById, getRegById } from "@/app/lib/actions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({params}:{params: {slug: string}}){
    const id = await params.slug;
    const work = await getLicenseById(id)

    const session = await getSession();
    const userRole = await session?.user?.roles[0]
    if(!session?.user?.access){
        redirect('/welcome')
    }
    return (
        <main className="h-full">
            <div className="flex flex-row h-full gap-0">
                {work ? (
                    <>
                        <ApplicationForStudentLicense data={work} userRole={userRole}/>
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
            </div>
       </main>
    );
};
