import { getRole } from "@/app/auth/auth";
import InvestigationView from "@/app/components/record/ComplaintViewer";
import { getInvById } from "@/app/lib/actions";
import Link from "next/link";

export default async function Page({params}:{params: {slug: string}}){
    const id = await params.slug;
    const inv = await getInvById(id)

    const userRole = await getRole()
    return (
        <main className="h-full">
            <div className="flex flex-row h-full gap-0">
                {inv ? (
                    <>
                        {userRole &&<InvestigationView data={inv} userRole={userRole}/>}
                    </>):(
                        <div className="w-full md:h-96 items-center flex justify-center">
                            <div>
                                <h2 className="text-center text-black text-3xl">Record not found!</h2>
                                <div className="flex items-center justify-center">
                                    <Link
                                    href='/trls/work'
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
