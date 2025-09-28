'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RegistrationStatusComponent from "../components/registration";
import { Loader, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { getAccessGroups } from "@/app/auth/auth";

export default function Dashboard() {
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(true)
  
    useEffect(() => {
        const fetchId = async () => {
            try {
                const result = await getAccessGroups();

                if (result) {
                    const id = result.nationalId || result.passportId || result.userid;
                    setUserId(id);
                }
            } catch (error) {
                console.error('Error fetching access groups:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchId();
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="pb-4">
                        <UserWelcomeMessage/>
                    </CardHeader>
                    <Separator className="border-gray-200" />                   
                    <CardContent className="pt-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center p-8">
                                <div className="text-gray-500"><Loader className="w-10 h-10 animate-spin"/></div>
                            </div>
                        ): (<RegistrationStatusComponent userId={userId}/>)}                        
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}

const UserWelcomeMessage = () => {
    return (
        <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 rounded-full">
                <UserRound className="w-6 h-6 text-gray-600" />
            </div>
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Hello, Bopaki Tebalo</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome to your dashboard</p>
            </div>
        </div>
    )
}