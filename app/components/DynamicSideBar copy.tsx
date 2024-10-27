"use client"

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Logo } from "./Logo";
import { getAccessGroups, getRole, getSession, logout } from "../auth/auth";
import SidebarNav from "./SidebarNav";
import NavUtils from "./NavComponents/NavUtilis";
import { AccessGroup, Session } from '../lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from "@/components/ui/tooltip";

interface SidebarProps {
    // Add any props if needed
}

const DynamicSidebar: React.FC<SidebarProps> = () => {
    let session: Session | null = null;
    const userRoleRef = useRef<string | ''>('');
    const accessProfileRef = useRef<AccessGroup | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean | null>(null);

    useEffect(() => {
        async function fetchSessionAndRole() {
            try {
                //session = await getSession();
                userRoleRef.current = await getRole() || '';
                accessProfileRef.current = await getAccessGroups() || null;
                if (!accessProfileRef.current) {
                    //await logout()
                }

                // Set the initial state for the sidebar
                const savedIsSidebarCollapsed = localStorage.getItem('isSidebarCollapsed');
                if (savedIsSidebarCollapsed !== null) {
                    setIsSidebarCollapsed(JSON.parse(savedIsSidebarCollapsed));
                } else {
                    setIsSidebarCollapsed(false);
                }
            } catch (error) {
                console.error('Error fetching session or role:', error);
                // Handle error appropriately, maybe show an error message or redirect
            }
        }

        fetchSessionAndRole();
    }, []);

    useEffect(() => {
        if (isSidebarCollapsed !== null) {
            localStorage.setItem('isSidebarCollapsed', JSON.stringify(isSidebarCollapsed));
        }
    }, [isSidebarCollapsed]);

    if (isSidebarCollapsed === null) {
        return (
            <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                {/* Placeholder content or skeleton loader */}
            </Suspense>
        );
    }

    return (
        <TooltipProvider>
            <aside
                id="dynamic-sidebar"
                className={`top-0 left-0 shadow-xl transition-transform ${isSidebarCollapsed ? '-translate-x-full sm:translate-x-0' : 'sm:translate-x-0'} hidden md:block h-full`}
                aria-label="Sidebar"
            >
                <div className="h-full px-0 bg-sky-400 shadow-lg rounded-r-lg flex flex-col">
                    <div className="my-10 ml-5 flex-1 overflow-y-auto">
                        <SidebarNav currentPersona={accessProfileRef.current?.current || ''} isCollapsed={isSidebarCollapsed} />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -right-4 top-0 z-10"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    >
                        {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </Button>
                    <div className={`absolute bottom-0 w-full border-t bg-sky-400 ${isSidebarCollapsed ? 'hidden' : ''}`}>
                        <NavUtils accessProfile={accessProfileRef.current} />
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    );
}

export default DynamicSidebar;