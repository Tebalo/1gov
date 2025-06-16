import { Suspense } from "react";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { PageTitle } from "../PageTitle";
import { ServiceListWrapper } from "../ServiceListWrapper";

export const TeacherHome = () => {
    return(
        <>
        <div className="h-[calc(100vh-4rem-2.5rem)]">
            <div className="mb-5">
                <PageTitle Title="Teacher Registration and Licensing"/>
            </div>
            <div className="md:flex md:mb-32 mb-10 justify-between overflow-y-auto h-full">
                <div className="bg-gray-100 p-2 rounded-lg w-full">
                    <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900">Search e-Services</label>
                    <input type="text" id="base-input" placeholder="Search all available e-Services by name, category, description etc.." className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
                </div>
            </div>
            <div className="flex items-center space-x-2 mb-5">
                <svg className="flex-shrink-0 w-7 h-7 text-sky-300 transition duration-75 group-hover:text-sky-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                </svg>
                <span className="md:text-lg text-gray-900 font-semibold">Service Categories</span>
            </div>
            <Suspense fallback={<LoadingSkeleton/>}>
                <ServiceListWrapper/>
            </Suspense>
        </div>
        </>
    );
}