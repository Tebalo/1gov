import { Suspense } from "react";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { PageTitle } from "./PageTitle";
import { ServiceListWrapper } from "./ServiceListWrapper";

export const AccessDenied = () => {
    return(
        <>
        <div className="flex w-full items-center justify-center h-full">
            <div className="flex items-center space-x-2 mb-5">
                <span className="md:text-lg text-gray-900 font-semibold">Access denied</span>
            </div>
        </div>
        </>
    );
}