import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DoughtnutCard from "../(charts)/_DoughtnutCard";
import MyWork from "../dashboard/(tables)/_myWork";
import { PageTitle } from "../PageTitle";
import { SearchCheck } from "lucide-react";
import { CreateInvestigation } from "../MyWork/components/createInvestigation";

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
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <SearchCheck className="mr-2" />Investigation&apos;s component
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CreateInvestigation/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}