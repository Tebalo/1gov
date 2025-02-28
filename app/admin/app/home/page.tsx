'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  UsersRound, 
  Settings, 
  FileText, 
  BarChart4, 
  CalendarClock, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';

export default function AdminHomePage() {
    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome to the TRLS administration system
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        Admin
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                        <CalendarClock className="mr-1 h-3 w-3" />
                        2025 - Active
                    </Badge>
                </div>
            </div>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3 bg-blue-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">User Management</CardTitle>
                            <UsersRound className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardDescription>
                            Manage system users and roles
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-3 grid-cols-2 text-sm">
                            <div className="bg-slate-50 p-3 rounded">
                                <p className="text-muted-foreground">Total Users</p>
                                <p className="text-xl font-medium mt-1">12</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded">
                                <p className="text-muted-foreground">Admin Users</p>
                                <p className="text-xl font-medium mt-1">2</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4 pb-4">
                        <Button variant="ghost" size="sm">View Details</Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/app/roles">
                                <span className="flex items-center">
                                    Manage
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </span>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3 bg-purple-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">Content Management</CardTitle>
                            <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <CardDescription>
                            Manage site content and resources
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-3 grid-cols-2 text-sm">
                            <div className="bg-slate-50 p-3 rounded">
                                <p className="text-muted-foreground">Published</p>
                                <p className="text-xl font-medium mt-1">10</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded">
                                <p className="text-muted-foreground">Draft</p>
                                <p className="text-xl font-medium mt-1">7</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4 pb-4">
                        <Button variant="ghost" size="sm">View Details</Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/app/content">
                                <span className="flex items-center">
                                    Manage
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </span>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3 bg-amber-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">Reports</CardTitle>
                            <BarChart4 className="h-5 w-5 text-amber-600" />
                        </div>
                        <CardDescription>
                            View system analytics and reports
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-3 grid-cols-2 text-sm">
                            <div className="bg-slate-50 p-3 rounded">
                                <p className="text-muted-foreground">Monthly Users</p>
                                <p className="text-xl font-medium mt-1">12</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded">
                                <p className="text-muted-foreground">Registrations</p>
                                <p className="text-xl font-medium mt-1">78</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4 pb-4">
                        <Button variant="ghost" size="sm">View Details</Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/app/reports">
                                <span className="flex items-center">
                                    Manage
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </span>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3 bg-green-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">System Settings</CardTitle>
                            <Settings className="h-5 w-5 text-green-600" />
                        </div>
                        <CardDescription>
                            Configure system preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-3 grid-cols-2 text-sm">
                            <div className="bg-slate-50 p-3 rounded">
                                <p className="text-muted-foreground">Last Updated</p>
                                <p className="text-xl font-medium mt-1">Today</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded">
                                <p className="text-muted-foreground">Version</p>
                                <p className="text-xl font-medium mt-1">2.50.99</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4 pb-4">
                        <Button variant="ghost" size="sm">View Details</Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/app/settings">
                                <span className="flex items-center">
                                    Manage
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </span>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}