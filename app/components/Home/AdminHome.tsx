import DoughtnutCard from "../(charts)/_DoughtnutCard";
import MyWork from "../(tables)/_myWork";
import { PageTitle } from "../PageTitle";

export const AdminHome = () => {
    return(
        <>
        <div className="overflow-auto h-screen rounded-lg">
            <div className="mb-5">
                <PageTitle Title="Teacher Registration and Licensing"/>
            </div>
            <div className="w-full">
                <div className="rounded-lg">
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-4">
                        <div className="flex md:col-span-2 items-center justify-center md:h-96 border border-gray-200 rounded bg-gray-50">
                            <MyWork/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}