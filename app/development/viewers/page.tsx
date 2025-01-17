'use client'

import { useState } from "react";
import { PageTitle } from "@/app/components/PageTitle";
import { Card } from "@/components/ui/card";
import { FileText, RefreshCcw, FileCog, RotateCcw, Search, FileSearch, UserPlus } from 'lucide-react';
import RenewalContent from "./components/renewal";
import RevocationContent from "./components/revocation";
import CategoryContent from "./components/changeofcategory";
import RestorationContent from "./components/restoration";
import CreateCasePage from "@/app/(portal)/trls/work/investigation/create/page";
import InvestigationContent from "./components/investigation";
import RegistrationContent from "./components/registration";

export default function Page() {
    const [activeSection, setActiveSection] = useState('renewal');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        {
            id: 'renewal',
            label: 'Renewal View',
            icon: <RefreshCcw className="h-4 w-4" />,
            component: <RenewalContent />
        },
        {
            id: 'revocation',
            label: 'Revocation View',
            icon: <FileText className="h-4 w-4" />,
            component: <RevocationContent />
        },
        {
            id: 'category',
            label: 'Change of Category View',
            icon: <FileCog className="h-4 w-4" />,
            component: <CategoryContent />
        },
        {
            id: 'restoration',
            label: 'Restoration View',
            icon: <RotateCcw className="h-4 w-4" />,
            component: <RestorationContent />
        },
        {
            id: 'investigation-form',
            label: 'Investigation Form',
            icon: <Search className="h-4 w-4" />,
            component: <CreateCasePage />
        },
        {
            id: 'investigation',
            label: 'Investigation View',
            icon: <FileSearch className="h-4 w-4" />,
            component: <InvestigationContent />
        },
        {
            id: 'registration',
            label: 'Registration View',
            icon: <UserPlus className="h-4 w-4" />,
            component: <RegistrationContent />
        }
    ];

    const handleSectionChange = (id: string) => {
        setActiveSection(id);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen overflow-auto pb-8">
            {/* <div className="mb-4 md:mb-2 z-20">
                <PageTitle Title="RECORD UI TESTING USING DUMMY DATA"/>
            </div> */}
            
            {/* Mobile Menu Toggle */}
            <div className="md:hidden mb-4">
                <Card className="p-2">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="w-full flex items-center justify-between p-3 text-sm font-medium"
                    >
                        {menuItems.find(item => item.id === activeSection)?.label}
                        <FileCog className="h-4 w-4" />
                    </button>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
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
                <div className="md:col-span-9 z-20">
                    <Card className="p-4 md:p-6">
                        {menuItems.find(item => item.id === activeSection)?.component}
                    </Card>
                </div>
            </div>
        </div>
    );
}