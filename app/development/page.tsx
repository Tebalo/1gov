'use client'
import React, { Suspense, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Layout, FileText, AlertCircle, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageTitle } from "../components/PageTitle";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { TeacherRegistrationService } from "../components/teacher-form";
import { ServiceListWrapper } from "../components/ServiceListWrapper";
import Form from "../components/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RegistrationOfficerHome } from "../components/Home/RegistrationOfficerHome";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, href, className }) => (
  <Link href={href}>
    <Card className={cn(
      "relative transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:border-blue-500/50 cursor-pointer group overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20",
      className
    )}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/30 transition-all duration-300"></div>
      
      <CardContent className="pt-6 relative z-10">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 group-hover:from-blue-500/20 group-hover:to-indigo-500/20 transition-all duration-300 group-hover:scale-110">
            {icon}
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const DevelopmentStudio = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const services = [
    {
      title: "Interface Components",
      description: "Build and test UI components with live preview",
      icon: <Layout className="w-6 h-6 text-blue-500" />,
      href: "/development/components"
    },
    {
      title: "Case Interface",
      description: "Design and test case management interfaces",
      icon: <FileText className="w-6 h-6 text-indigo-500" />,
      href: "/development/viewers"
    },
    {
      title: "System Monitoring",
      description: "Monitor system performance and health",
      icon: <AlertCircle className="w-6 h-6 text-amber-500" />,
      href: "/development/monitoring"
    }
  ];

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen space-y-8">
      {/* Hero Section */}
      <div className="relative">
        <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white border-0 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <CardHeader className="relative z-10 pb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                <Sparkles className="w-8 h-8 text-blue-100" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold mb-2">Development Studio</CardTitle>
                <p className="text-blue-100 text-lg">Build, test, and deploy with confidence</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Search Section */}
      <Card className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-lg">Search Services</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search all available e-Services by name, category, description..."
              className="px-10 bg-white/80 border-gray-200 focus:border-blue-500 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="border-t border-gray-100 pt-6">
            <TeacherRegistrationService/>
            <Suspense fallback={<LoadingSkeleton/>}>
              <ServiceListWrapper/>
            </Suspense>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Section */}
      <Card className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Quick Access</CardTitle>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredServices.length} services
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSkeleton />}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service, index) => (
                <ServiceCard
                  key={index}
                  {...service}
                />
              ))}
            </div>

            {filteredServices.length === 0 && (
              <Card className="bg-gray-50/50 border-dashed border-2 border-gray-200">
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No services found</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Page() {
  return (
    <ScrollArea className="h-[calc(100vh-2rem)]">
      <section className='p-2 space-y-6'>
        {/* Page Header */}
        {/* <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Teacher Registration System</h1>
          <p className="text-gray-600">Complete your professional registration and licensing application</p>
        </div> */}

        {/* Main Form Container */}
        <div className='relative'>
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-indigo-50/50 rounded-3xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white/30 to-blue-50/50 rounded-3xl transform -rotate-1"></div>
          
          {/* Form content */}
          <div className="relative z-10">
            <Form />
            {/* <RegistrationOfficerHome/> */}
          </div>
        </div>

        {/* Development Studio Section (Optional) */}
        {/* Uncomment if you want to show development tools */}
        {/* <DevelopmentStudio /> */}
      </section>
    </ScrollArea>
  )
}