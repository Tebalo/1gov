'use client'
import React, { Suspense, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Layout, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageTitle } from "../components/PageTitle";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { TeacherRegistrationService } from "../components/teacher-form";
import { ServiceListWrapper } from "../components/ServiceListWrapper";
import Form from "../components/form";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      "transition-all hover:shadow-lg hover:border-blue-500/50 cursor-pointer group",
      className
    )}>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
            {icon}
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg group-hover:text-blue-500 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500">
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
    // {
    //   title: "Access Control",
    //   description: "Manage access control settings",
    //   icon: <FileText className="w-6 h-6 text-blue-500" />,
    //   href: "/development/accesscontrol"
    // },
    {
      title: "Interface Components",
      description: "Build and test components",
      icon: <AlertCircle className="w-6 h-6 text-blue-500" />,
      href: "/development/components"
    },
    {
      title: "Case Interface",
      description: "Build and test interfaces",
      icon: <AlertCircle className="w-6 h-6 text-blue-500" />,
      href: "/development/viewers"
    }
  ];

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-2 overflow-auto pr-10 rounded-md">
      {/* Search Section */}
      <div className="mb-8 bg-white rounded-md">
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search all available e-Services by name, category, description..."
                className="px-10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <TeacherRegistrationService/>
            <Suspense fallback={<LoadingSkeleton/>}>
              <ServiceListWrapper/>
            </Suspense>
          </CardContent>
      </Card>
      </div>
      {/* Services Section */}
      {/* <div className="space-y-6 bg-white p-2 rounded-md">
        <div className="flex items-center space-x-2">
          <Layout className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Quick Access
          </h2>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={index}
                {...service}
              />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-gray-500">
                  <p>No services found matching your search.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </Suspense>
      </div> */}
    </div>
  );
};

export default function Page() {
    return (
        // <>
        //     <DevelopmentStudio/>
        // </>
        // <ScrollArea className="h-[calc(100vh-4rem-2.5rem)]">
      <section className='py-2'>
        
          <div className='container'>
              <Form />
          </div>
        
      </section>
      // </ScrollArea>
    )
}