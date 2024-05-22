import { PageTitle } from "../PageTitle";

export const RegistrarDashboard = () => {
    return(
        <>
        <div className="overflow-auto h-screen rounded-lg">
            <div className="mb-5">
                <PageTitle Title="Dashboard"/>
            </div>
            <div className="w-full">
                <div className="rounded-lg">
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-4">
                        <div className="flex-row items-center justify-center md:h-96 border shadow border-gray-200 p-6 rounded-lg bg-gray-50">
                        </div>
                        <div className="flex md:col-span-2 items-center justify-center md:h-96 border border-gray-200 rounded bg-gray-50">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}