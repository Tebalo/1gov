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
              <DraftsDataTable userId={userId} />
            </div>
          </TabsContent>
          
          <TabsContent value="submissions" className="p-0 mt-0">
            <div className="p-4 md:p-6">
              <Card className="border-dashed border-2 border-gray-200">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Cog className="h-6 w-6 text-gray-400 animate-spin" />
                  </div>
                  <CardTitle className="text-xl text-gray-600">Work in Progress</CardTitle>
                  <CardDescription className="text-gray-500">
                    The submissions view is currently under development. 
                    You&apos;ll be able to view all your submitted applications here soon.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    In the meantime, you can continue working on your drafts or create new applications.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}