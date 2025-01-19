'use client'

import RolePermissionsForm from "@/app/components/Home/components/admin/RolePermissionForm";
import { PageTitle } from "@/app/components/PageTitle";
import { Card } from "@/components/ui/card";
import { Globe, Link, Network, Settings, Users } from 'lucide-react';
import RoleAssignment from "../components/RoleAssignment";
import URLConfigurationManager from "../components/URLConfigurationManager";
import { useState } from "react";

export default function DevelopmentStudio() {
    const [activeSection, setActiveSection] = useState('iam');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        {
            id: 'roles',
            label: 'Roles and Permissions',
            icon: <Settings className="h-4 w-4" />,
            component: <RolePermissionsForm />
        },
        {
            id: 'iam',
            label: 'Identity and Access Manager (IAM)',
            icon: <Users className="h-4 w-4" />,
            component: <RoleAssignment />
        },
        {
            id: 'url',
            label: 'URL Configuration Manager (UCM)',
            icon: <Link className="h-4 w-4" />,
            component: <URLConfigurationManager />
        }
    ];

    const handleSectionChange = (id: string) => {
        setActiveSection(id);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen overflow-auto">
            
            {/* Mobile Menu Toggle */}
            <div className="md:hidden container mx-auto">
                <Card className="p-2">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="w-full flex items-center justify-between p-3 text-sm font-medium"
                    >
                        {menuItems.find(item => item.id === activeSection)?.label}
                        <Settings className="h-4 w-4" />
                    </button>
                </Card>
            </div>
            
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                {/* Sub-menu - Hidden on mobile unless opened */}
                <div className={`md:col-span-3 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
                    <Card className="p-2 sticky top-4">
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSectionChange(item.id)}
                                    className={`w-full text-left flex items-center gap-2 px-4 py-3 rounded-lg transition-colors
                                        ${activeSection === item.id 
                                            ? 'bg-blue-50 text-blue-600' 
                                            : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="text-sm font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </Card>
                </div>

                {/* Content Area */}
                <div className="md:col-span-9">
                    <Card className="p-4 md:p-0">
                        {menuItems.find(item => item.id === activeSection)?.component}
                    </Card>
                </div>
            </div>
        </div>
    );
}