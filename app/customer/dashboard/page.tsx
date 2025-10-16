'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RegistrationStatusComponent from "../components/registration";
import { Loader, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(true)
    const [username, setUserName] = useState('')
  
    useEffect(() => {
        const fetchId = async () => {
            try {
                const response = await fetch('/api/auth/profile', {
                    credentials: 'include'
                })
                
                if (!response.ok) {
                    throw new Error('Failed to fetch access groups')
                }
                
                const result = await response.json()

                if (result) {
                    const id = result.nationalId || result.passportId || result.userid;
                    setUserId(id);
                    setUserName(result.username)
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
        <main className="min-h-screen bg-gray-50">
            <div className="">
                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="pb-4">
                        {username ? (
                            <UserWelcomeMessage username={username}/>
                            ):(
                            <div className="flex justify-center items-center p-8">
                                <div className="text-gray-500"><Loader className="w-10 h-10 animate-spin"/></div>
                            </div>
                        )}
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

const UserWelcomeMessage: React.FC<{username: string}> = ({username}) => {
    const getGreeting = (): string => {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 12) {
            return 'GOOD MORNING';
        } else if (hour >= 12 && hour < 17) {
            return 'GOOD AFTERNOON';
        } else if (hour >= 17 && hour < 21) {
            return 'GOOD EVENING';
        } else {
            return 'GOOD DAY';
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 rounded-full">
                <UserRound className="w-6 h-6 text-gray-600" />
            </div>
            <div>
                <h1 className="text-xl font-semibold text-gray-900">
                    {getGreeting()}, {username.toUpperCase()}
                </h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back! Here&lsquo;s your registration overview</p>
            </div>
        </div>
    );
};

// const UserWelcomeMessage: React.FC<{username:string}> = ({username}) => {
//     return (
//         <div className="flex items-center space-x-4">
//             <div className="p-3 bg-gray-100 rounded-full">
//                 <UserRound className="w-6 h-6 text-gray-600" />
//             </div>
//             <div>
//                 <h1 className="text-xl font-semibold text-gray-900">GOOD DAY, {username.toUpperCase()}</h1>
//                 <p className="text-sm text-gray-500 mt-1">Welcome to your dashboard</p>
//             </div>
//         </div>
//     )
// }