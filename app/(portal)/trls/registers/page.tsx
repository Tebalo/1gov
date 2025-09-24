import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTitle } from "@/app/components/PageTitle";
import Registers from "@/app/public/registrations/components/registers";
import TeacherTable from "@/app/components/Home/components/teacher/teacher-table";
import { getRole } from "@/app/auth/auth";
import { Role } from "@/app/lib/store";


export default async function Register(){
    const rawRole = await getRole() as Role;
    const userRole = rawRole.toLowerCase() as Lowercase<Role>;
    return (
        <div className="h-screen overflow-y-auto bg-background">
            <div className="sticky top-0 z-10 bg-background p-6 border-b">
                <div className="mx-auto max-w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <PageTitle Title="Registers"/>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="mx-auto max-w-full">
                    <Tabs defaultValue="licensed" className="w-full">
                        <TabsList className="w-full sm:w-auto bg-muted/20 p-1 sticky top-24 z-10">
                            <TabsTrigger 
                                value="licensed"
                                className="text-sm font-medium transition-colors"
                            >
                                Licensed Teachers
                            </TabsTrigger>
                            <TabsTrigger 
                                value="registered"
                                className="text-sm font-medium transition-colors"
                            >
                                Registered Teachers
                            </TabsTrigger>
                            {userRole=="manager" && <TabsTrigger 
                                value="pending-payment"
                                className="text-sm font-medium transition-colors"
                            >
                                Pending Payment
                            </TabsTrigger>}
                            <TabsTrigger 
                                value="de-registered"
                                className="text-sm font-medium transition-colors"
                            >
                                De-registered Teachers
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="licensed" className="space-y-6 mt-6">
                            <Registers status="Endorsement-Complete"/>
                        </TabsContent>
                        <TabsContent value="registered" className="space-y-6 mt-6">
                            <Registers status="Pending-Endorsement"/>
                        </TabsContent>   
                        <TabsContent value="pending-payment" className="space-y-6 mt-6">
                            <TeacherTable status="Pending-Payment" userRole={"manager"}/>
                        </TabsContent> 
                        <TabsContent value="de-registered" className="space-y-6 mt-6">
                            <Registers status="Manager-Revoked"/>
                        </TabsContent>              
                    </Tabs>
                </div>
            </div>
        </div>
    );
}