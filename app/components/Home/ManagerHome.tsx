// 'use client'
// import React, { Suspense, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Activity, BarChart3, Zap, TrendingUp, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { cn } from "@/lib/utils";
import { MyAssignments } from "./components/teacher/assignments";
import { getAccessGroups } from "@/app/auth/auth";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
  badge?: string;
}

export const ManagerHome = async () => {
  const profile = await getAccessGroups();
  return (
    <div className="min-h-[calc(100vh-4rem-2.5rem)] bg-gradient-to-br from-gray-50/50 to-white">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back {profile?.username}! Here&apos;s what&apos;s happening today.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium text-gray-900">Just now</p>
          </div>
        </div>
      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> 
        {/* Quick Access Section */}
        {/* <div className="lg:col-span-1">
          <QuickAccess/>
        </div> */}
        
        {/* My Assignments Section */}
        <div className="lg:col-span-3">
          <MyAssignments status={"Pending-Manager-Approval"} userRole={profile?.current ?? ''} assigned_to={profile?.username ?? ''}/>
        </div>
      </div>
    </div>
  );
};

// const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, href, className, badge }) => (
//   <Link href={href}>
//     <Card className={cn(
//       "relative transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400/60 cursor-pointer group border-gray-200/60 bg-gradient-to-br from-white to-gray-50/30",
//       className
//     )}>
//       <CardContent className="pt-6 pb-5">
//         <div className="flex items-start space-x-4">
//           <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300 border border-blue-100/60">
//             {icon}
//           </div>
//           <div className="space-y-2 flex-1">
//             <div className="flex items-center justify-between">
//               <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors duration-200">
//                 {title}
//               </h3>
//               {badge && (
//                 <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
//                   {badge}
//                 </span>
//               )}
//             </div>
//             <p className="text-sm text-gray-600 leading-relaxed">
//               {description}
//             </p>
//           </div>
//         </div>
//         {/* Subtle gradient overlay on hover */}
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
//       </CardContent>
//     </Card>
//   </Link>
// );

// // Stats cards for better visual hierarchy
// const StatsCard = ({ icon, title, value, change, changeType }: {
//   icon: React.ReactNode;
//   title: string;
//   value: string;
//   change?: string;
//   changeType?: 'positive' | 'negative' | 'neutral';
// }) => (
//   <Card className="bg-gradient-to-br from-white to-gray-50/50 border-gray-200/60">
//     <CardContent className="pt-6">
//       <div className="flex items-center space-x-3">
//         <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/60">
//           {icon}
//         </div>
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <div className="flex items-center space-x-2">
//             <p className="text-2xl font-bold text-gray-900">{value}</p>
//             {change && (
//               <span className={cn(
//                 "text-xs font-medium px-2 py-1 rounded-full",
//                 changeType === 'positive' && "bg-green-100 text-green-700",
//                 changeType === 'negative' && "bg-red-100 text-red-700",
//                 changeType === 'neutral' && "bg-gray-100 text-gray-700"
//               )}>
//                 {change}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );
// const QuickAccess = () => {
//   const [searchQuery, setSearchQuery] = useState("");

//   const services = [
//     {
//       title: "Work Basket",
//       description: "Access your work lists and queues",
//       icon: <Activity className="w-6 h-6 text-blue-600" />,
//       href: "/trls/work",
//       badge: "5 new"
//     },
//     {
//       title: "Reports",
//       description: "View and generate detailed reports",
//       icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
//       href: "/trls/dashboard"
//     }
//   ];

//   const filteredServices = services.filter(service =>
//     service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     service.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="space-y-6">
//       {/* Section Header */}
//       <div className="flex items-center space-x-3">
//         <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
//           <Zap className="w-5 h-5 text-white" />
//         </div>
//         <div>
//           <h2 className="text-xl font-bold text-gray-900">Quick Access</h2>
//           <p className="text-sm text-gray-600">Find and access your tools quickly</p>
//         </div>
//       </div>

//       {/* Enhanced Search Section */}
//       <Card className="border-gray-200/60 bg-gradient-to-br from-white to-gray-50/30">
//         <CardContent className="pt-6">
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//             <Input
//               type="text"
//               placeholder="Search e-Services by name, category, or description..."
//               className="pl-12 pr-4 py-3 bg-white/80 border-gray-200/80 focus:border-blue-400 focus:ring-blue-400/20 text-gray-900 placeholder:text-gray-500"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Services Section */}
//       <div className="space-y-4">
//         <Suspense fallback={<LoadingSkeleton />}>
//           <div className="space-y-4">
//             {filteredServices.map((service, index) => (
//               <ServiceCard
//                 key={index}
//                 {...service}
//               />
//             ))}
//           </div>

//           {filteredServices.length === 0 && (
//             <Card className="border-gray-200/60 bg-gradient-to-br from-white to-gray-50/30">
//               <CardContent className="py-12">
//                 <div className="text-center">
//                   <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                     <Search className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
//                   <p className="text-gray-500">Try adjusting your search terms or browse all available services.</p>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </Suspense>
//       </div>
//     </div>
//   )
// }