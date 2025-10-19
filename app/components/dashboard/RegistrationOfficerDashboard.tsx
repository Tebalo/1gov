import { PageTitle } from "../PageTitle";
import { RegistrationStats } from "./components/RegistrationStats ";
import { HorizontalBarChartStatus } from "./components/horizontal-bar-chart";
import InstitutionTypeBarChart from "./components/institution-type-bar-chart";
import { StatusDonutChart } from "./components/status-donut-chart";



export const RegistrationOfficerDashboard = () => {
    return (
        <div className="h-auto bg-background">
            <div className="bg-background p-6 border-b">
                <div className="mx-auto max-w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <PageTitle Title="Dashboard"/>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="mx-auto max-w-full space-y-2">
                    <RegistrationStats />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 ">
                        <div className="bg-card rounded-xl shadow-sm md:col-span-1">
                            <InstitutionTypeBarChart />
                        </div>
                        <div className="bg-card rounded-xl shadow-sm col-span-1">
                            <StatusDonutChart />
                        </div>  
                        <div className="bg-card rounded-xl shadow-sm col-span-2">
                            <HorizontalBarChartStatus />
                        </div>                                      
                    </div>
                </div>
            </div>
        </div>
    );
};