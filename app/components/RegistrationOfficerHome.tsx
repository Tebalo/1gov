import DoughtnutCard from "./(charts)/_DoughtnutCard";
import MyWork from "./(tables)/_myWork";
import { Work } from "./MyWork/work";
import { PageTitle } from "./PageTitle";
import { fakerDE as faker } from '@faker-js/faker';

export const RegistrationOfficerHome = () => {
    return(
        <>
        <div className="overflow-auto h-screen rounded-lg">
            <div className="mb-5">
                <PageTitle Title="Teacher Registration and Licensing"/>
            </div>
            <div className="w-full">
                <div className="rounded-lg">
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-4">
                        <div className="flex-row items-center justify-center md:h-96 border shadow border-gray-200 p-6 rounded-lg bg-gray-50">
                        </div>
                        <div className="flex md:col-span-2 items-center justify-center md:h-96 border border-gray-200 rounded bg-gray-50">
                            <Work status={"Pending-Review"}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}