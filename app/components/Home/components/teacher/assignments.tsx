"use client";
import { PageTitle } from "@/app/components/PageTitle";
import { Role } from "@/app/lib/store";
import MyAssignmentsTable from "./my-assignments";
import { useEffect, useState } from "react";
import { getAccessGroups } from "@/app/auth/auth";
import { UserInfo } from "@/lib/audit-trail-service";
import { ClipboardList } from "lucide-react";


export const MyAssignments = ({status}: {status: string}) => {
    const [currentUser, setCurrentUser] = useState<UserInfo>({
        name: '',
        role: '',
        id: '',
    });
    useEffect(() => {
        const initializeUser = async () => {
        try {
            const profile = await getAccessGroups();
            if (profile && profile.current) {  // Add null check
                setCurrentUser(prev => ({
                ...prev,
                name: profile.username || '',
                role: profile.current.toLowerCase() || '',
                id: profile.userid || '',
            }));
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };
    initializeUser();
    }, []);

    return (
        <div className="overflow-auto h-[calc(100vh-4rem-2.5rem)] rounded-lg space-y-6">
            <div className="flex items-center space-x-2">
                <ClipboardList className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                    My Assignments
                </h2>
            </div>
            <div className="w-full">
                <div className="rounded-lg">
                <div className="flex space-x-2">
                    <div className="p-2 space-y-2 w-64 items-center flex-1 justify-center border border-gray-200 rounded bg-gray-50">
                        {/* My Assignments */}
                        <MyAssignmentsTable status={status} userRole={currentUser.role ?? ''} assigned_to={currentUser.name} />
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}