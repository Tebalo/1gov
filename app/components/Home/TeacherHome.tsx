import { Suspense } from "react";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { PageTitle } from "../PageTitle";
import { ServiceListWrapper } from "../ServiceListWrapper";
import { TeacherRegistrationService } from "../teacher-form";

export const TeacherHome = () => {
    return(
        <>
        <div className="h-[calc(100vh-4rem-2.5rem)]">
            <div className="mb-5">
                <PageTitle Title="Teacher Registration and Licensing"/>
            </div>
            {/* <Suspense fallback={<LoadingSkeleton/>}>
                <ServiceListWrapper/>
            </Suspense> */}
            <TeacherRegistrationService/>
        </div>
        </>
    );
}