'use client'
import React, { Suspense, useState } from "react";
import { PageTitle } from "../PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Layout, Activity, FileText, AlertCircle, ClipboardSignature, BarChart3 } from "lucide-react";
import Link from "next/link";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { cn } from "@/lib/utils";
import LocationChangeBanner from "./components/TRLSBanner";

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

export const RegistrationOfficerHome = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const services = [
    {
      title: "My Work",
      description: "Work lists and queues",
      icon: <Activity className="w-6 h-6 text-blue-500" />,
      href: "/trls/work"
    },
    {
      title: "Registration",
      description: "Registration requests",
      icon: <ClipboardSignature className="w-6 h-6 text-blue-500" />,
      href: "/trls/registration"
    },
    {
      title: "Reports",
      description: "View and generate",
      icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
      href: "/trls/dashboard"
    }
  ];

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <PageTitle Title="Registration Services Dashboard" />
      </div>
      {/* <LocationChangeBanner /> */}
      {/* Search Section */}
      <div className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search all available e-Services by name, category, description..."
                className="pl-10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Section */}
      <div className="space-y-6">
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
      </div>
    </div>
  );
};