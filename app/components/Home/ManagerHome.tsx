import { Work } from "../MyWork/work";
import { PageTitle } from "../PageTitle";
import { getRegApplications } from "@/app/lib/actions";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RecordTable } from "./components/registration-table";

export const ManagerHome = async () => {
  const tasks = await getRegApplications('Pending-Manager-Review','20')
    return(
        <>
          <div className="overflow-auto h-screen rounded-lg">
            <div className="mb-5">
                <PageTitle Title="Teacher Registration and Licensing"/>
            </div>
            <div className="w-full">
                <div className="flex space-x-2">
                <div className="p-2 space-y-2 w-64 items-center flex-1 justify-center border border-gray-200 rounded bg-gray-50">
                    <Tabs defaultValue="registration-application" className="w-full">
                            <TabsList className="grid w-full grid-cols-1">
                                <TabsTrigger value="registration-application">Teacher Registration Applications</TabsTrigger>
                                {/* <TabsTrigger value="license-registration">Teacher License Applications</TabsTrigger> */}
                            </TabsList>
                            <TabsContent value="registration-application">
                                <Card>
                                <CardHeader>
                                    {/* <CardTitle>Applications for Teacher registrations</CardTitle> */}
                                    <CardDescription>
                                        Review teacher records.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Work status={"Pending-Screening"}/>
                                    <RecordTable status="Pending-Screening"/>
                                </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="license-registration">
                                <Card>
                                <CardHeader>
                                    {/* <CardTitle>License </CardTitle> */}
                                    <CardDescription>
                                        Review teacher records.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <RecordTable status="Pending-Screening"/>
                                </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
          </div>
        </>
    );
}