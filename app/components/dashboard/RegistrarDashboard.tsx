import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTitle } from "../PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "./date-range-picker";
import { RecentSales } from "./components/recent-sales";
import { Overview } from "./components/overview";
import { AllTeacherRegistrations } from "./components/AllTeacherRegistrations";
import { TeacherRegistrations } from "./components/TeacherRegistrations";
import { StudentRegistrations } from "./components/StudentRegistrations";
import { MaleTeacherRegistrations } from "./components/MaleTeacherRegistrations";
import { MonthlyTeacherRegistrations } from "./components/MonthlyTeacherRegistrations-SimpleBarGraph";

export const RegistrarDashboard = () => {
    return(
        <>
        <div className="overflow-auto h-screen rounded-lg">
            <div className="mb-5">
                <div className="flex items-center justify-between space-y-2 mr-10">
                    <PageTitle Title="Dashboard"/>
                    <div className="flex items-center space-x-2">
                        <CalendarDateRangePicker />
                        <Button>Download</Button>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="rounded-lg">
                    <div className="flex-1 space-y-4 p-8 pt-6">
                        <Tabs defaultValue="overview" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="analytics" disabled>
                                    Analytics
                                </TabsTrigger>
                                <TabsTrigger value="reports" disabled>
                                    Reports
                                </TabsTrigger>
                                <TabsTrigger value="notifications" disabled>
                                    Notifications
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <AllTeacherRegistrations/>
                                    <TeacherRegistrations/>
                                    <StudentRegistrations/>
                                    <MaleTeacherRegistrations/>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                    <Card className="col-span-4">
                                    <CardHeader>
                                        <CardTitle>Monthly Teacher Registrations</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pl-2">
                                        <MonthlyTeacherRegistrations />
                                    </CardContent>
                                    </Card>
                                    <Card className="col-span-3">
                                    <CardHeader>
                                        <CardTitle>Team</CardTitle>
                                        <CardDescription>
                                        Applications processed this month.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RecentSales />
                                    </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}