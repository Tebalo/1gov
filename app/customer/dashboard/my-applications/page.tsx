"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DraftsDataTable } from "../../components/drafts";
import { Cog, FileText, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserData } from "@/lib/hooks/useUserData";

export default function MyApplicationsPage() {
  // const userId = "440418213"
  const {nationalId, passportId} = useUserData();
  const userId = nationalId || passportId || '';
  
  return (
    <section className='p-4 md:p-6 space-y-6'>
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground">
          Manage your draft applications and view submitted forms
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-240px)]">
        <Tabs defaultValue="drafts" className="w-full">
          <div className="border-b border-gray-200 px-4 md:px-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-transparent h-auto p-0">
              <TabsTrigger 
                value="drafts" 
                className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none border-b-2 border-transparent"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Drafts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="submissions"
                className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none border-b-2 border-transparent"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Submissions</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="drafts" className="p-0 mt-0">
            <div className="p-4 md:p-6">
              <DraftsDataTable userId={userId} status={"draft"}/>
            </div>
          </TabsContent>
          
          <TabsContent value="submissions" className="p-0 mt-0">
            <div className="p-4 md:p-6">
              <DraftsDataTable userId={userId} status={"submitted"}/>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}