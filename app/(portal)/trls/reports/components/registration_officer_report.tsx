import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeacherRegistrationReport from "@/app/public/registrations/components/teacher-registration-report";
import StudentTeacherRegistrationReport from "@/app/public/registrations/components/student-teacher-registration-report";
import { StudentRegistrationCard } from "@/app/components/dashboard/components/StudentsRegistrationStatsCard";
import { PageTitle } from "@/app/components/PageTitle";

export const TeacherReport = () => {
    return (
        <div className="h-screen overflow-y-auto bg-background">
            <div className="sticky top-0 z-10 bg-background p-6 border-b">
                <div className="mx-auto max-w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <PageTitle Title="Dashboard"/>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="mx-auto max-w-full">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="w-full sm:w-auto bg-muted/20 p-1 sticky top-24 z-10">
                            <TabsTrigger 
                                value="reports"
                                className="text-sm font-medium transition-colors"
                            >
                                Teacher Reports
                            </TabsTrigger>
                            <TabsTrigger 
                                value="student-reports"
                                className="text-sm font-medium transition-colors"
                            >
                                Student Reports
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="reports">
                            <TeacherRegistrationReport/>
                        </TabsContent>   
                        <TabsContent value="student-reports">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">        
                                <div className="col-span-3"><StudentTeacherRegistrationReport /></div>
                                <div><StudentRegistrationCard/></div>
                            </div>
                        </TabsContent>              
                    </Tabs>
                </div>
            </div>
        </div>
    );
}