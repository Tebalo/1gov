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
import { ListOfTeacherRegistrationsByStatus } from "./components/TeacherRegistrationByStatus-List";
import { HorizontalBarChartStatus } from "./components/horizontal-bar-chart";
import { MixedBarChartStatuses } from "./components/bar-chart-mixed-statuses";
import { BarChartMonthlyRegistrations } from "./components/bar-chart-monthly-regustrations";
import { BarChartDailyRegistrations } from "./components/bar-chart-daily-registrations";
import { PieChartStatuses } from "./components/pie-chart-statuses";
import { LineChartDailyRegistrations } from "./components/line-chart-daily-registrations";
import { FemaleTeacherRegistrations } from "./components/FemaleTeacherRegistrations";
import { TotalIssuedLicenses } from "./components/TotalIssuedLicenses";

export const InvestigationsOfficerDashboard = () => {
    return(
        <>
         <div className="overflow-auto h-screen rounded-lg">
            <div className="mb-2">
                <div className="flex items-center justify-between space-y-2 mr-10">
                    <PageTitle Title="Dashboard"/>
                    <div className="flex items-center space-x-2">
                        {/* <CalendarDateRangePicker />
                        <Button>Download</Button> */}
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="rounded-lg">
                    <div className="flex-1 space-y-4 p-8 pt-6">
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}