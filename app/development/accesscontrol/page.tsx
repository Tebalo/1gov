import RolePermissionsForm from "@/app/components/Home/components/admin/RolePermissionForm";
import { PageTitle } from "@/app/components/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Link, Network, Settings, Users } from 'lucide-react';
import RoleAssignment from "../components/RoleAssignment";
import URLConfigurationManager from "../components/URLConfigurationManager";

export default async function DevelopmentStudio() {
    return (
        <div className="h-screen overflow-auto pb-8">
            <div className="mb-8">
                <PageTitle Title="Settings"/>
            </div>
            
            <div className="container mx-auto">
                <Tabs defaultValue="iam" className="w-full">
                    <TabsList className="w-full justify-start mb-6 bg-white p-1 border">
                        <TabsTrigger 
                            value="roles" 
                            className="flex items-center gap-2 px-4 py-2"
                        >
                            <Settings className="h-4 w-4" />
                            Roles and Permissions
                        </TabsTrigger>
                        <TabsTrigger 
                            value="iam"
                            className="flex items-center gap-2 px-4 py-2"
                        >
                            <Users className="h-4 w-4" />
                            Identity and Access Manager (IAM)
                        </TabsTrigger>
                        <TabsTrigger value="url" className="flex items-center gap-2 px-4 py-2">
                            <Link  className="h-4 w-4" />
                            URL Configuration Manager (UCM)
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="roles" className="bg-white rounded-lg shadow-sm border p-6">
                        <RolePermissionsForm/>
                    </TabsContent>
                    
                    <TabsContent value="iam" className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="text-gray-600">
                            <RoleAssignment/>
                        </div>
                    </TabsContent>
                    <TabsContent value="url" className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="text-gray-600">
                            <URLConfigurationManager/>
                        </div>
                    </TabsContent>           
                </Tabs>
            </div>
        </div>
    );
}