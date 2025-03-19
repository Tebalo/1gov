'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield,  
  Save, 
  RefreshCw, 
  Lock, 
  Key, 
  AlertCircle,
  CheckCircle2,
  Database
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ApiEndpointsCard from '../components/admin-urls';
import { version } from '@/app/lib/store';

export default function AdminSettings() {
    // const [emailNotifications, setEmailNotifications] = useState(true);
    // const [smsNotifications, setSmsNotifications] = useState(false);
    // const [darkMode, setDarkMode] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [userRegistration, setUserRegistration] = useState(true);
    const [twoFactorAuth, setTwoFactorAuth] = useState(true);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const env = process.env.environment;
    const last_updated = process.env.last_updated;

    const handleSaveSettings = () => {
        // Here you would typically save the settings to your backend
        setShowSuccessMessage(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
    };

    return (
        <div className="space-y-6 md:p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Configure your system preferences and options
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    <Button 
                        variant="default" 
                        onClick={handleSaveSettings}
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Reset
                    </Button>
                </div>
            </div>
            
            {showSuccessMessage && (
                <Alert variant="default" className="border-green-500 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-600">Success</AlertTitle>
                    <AlertDescription className="text-green-600">
                        Your settings have been saved successfully.
                    </AlertDescription>
                </Alert>
            )}
            
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="w-full md:w-auto grid grid-cols-3 h-auto p-1">
                    <TabsTrigger value="general" className="px-4 py-2">General</TabsTrigger>
                    <TabsTrigger value="security" className="px-4 py-2">Security</TabsTrigger>
                    <TabsTrigger value="system" className="px-4 py-2">System</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-6 mt-6">
                    <ApiEndpointsCard/>

                    {/* <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">Appearance</CardTitle>
                                    <CardDescription>Customize how the system looks</CardDescription>
                                </div>
                                <Sun className="h-5 w-5 text-amber-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Dark Mode</p>
                                        <p className="text-sm text-muted-foreground">Toggle dark mode appearance</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sun className="h-4 w-4 text-amber-500" />
                                        <Switch 
                                            checked={darkMode}
                                            onCheckedChange={setDarkMode}
                                        />
                                        <Moon className="h-4 w-4 text-slate-700" />
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="language">System Language</Label>
                                        <Select defaultValue="en">
                                            <SelectTrigger id="language" className="mt-1">
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="fr">French</SelectItem>
                                                <SelectItem value="es">Spanish</SelectItem>
                                                <SelectItem value="de">German</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="timezone">Timezone</Label>
                                        <Select defaultValue="utc">
                                            <SelectTrigger id="timezone" className="mt-1">
                                                <SelectValue placeholder="Select timezone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="utc">UTC</SelectItem>
                                                <SelectItem value="est">Eastern Time (ET)</SelectItem>
                                                <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                                                <SelectItem value="cet">Central European Time (CET)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}
                    
                    {/* <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">Notifications</CardTitle>
                                    <CardDescription>Manage your notification preferences</CardDescription>
                                </div>
                                <Bell className="h-5 w-5 text-blue-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Email Notifications</p>
                                        <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                                    </div>
                                    <Switch 
                                        checked={emailNotifications}
                                        onCheckedChange={setEmailNotifications}
                                    />
                                </div>
                                
                                <Separator />
                                
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">SMS Notifications</p>
                                        <p className="text-sm text-muted-foreground">Receive text messages for critical alerts</p>
                                    </div>
                                    <Switch 
                                        checked={smsNotifications}
                                        onCheckedChange={setSmsNotifications}
                                    />
                                </div>
                                
                                <Separator />
                                
                                {emailNotifications && (
                                    <div>
                                        <Label htmlFor="email">Notification Email</Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            placeholder="admin@example.com" 
                                            className="mt-1"
                                        />
                                        <p className="text-sm text-muted-foreground mt-1">
                                            System notifications will be sent to this email address
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card> */}
                </TabsContent>
                
                <TabsContent value="security" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">Authentication</CardTitle>
                                    <CardDescription>Manage authentication settings</CardDescription>
                                </div>
                                <Shield className="h-5 w-5 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Two-Factor Authentication</p>
                                    <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                                </div>
                                <Switch 
                                    checked={twoFactorAuth}
                                    onCheckedChange={setTwoFactorAuth}
                                />
                            </div>
                            
                            <Separator />
                            
                            <div>
                                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Input 
                                        id="session-timeout" 
                                        type="number" 
                                        defaultValue="30" 
                                        min="5" 
                                        max="240"
                                        className="w-32"
                                    />
                                    <span className="text-sm text-muted-foreground">minutes</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Users will be logged out after this period of inactivity
                                </p>
                            </div>
                            
                            <Separator />
                            
                            <div>
                                <h3 className="font-medium mb-2">Password Policy</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="min-length">Minimum Length</Label>
                                        <Input 
                                            id="min-length" 
                                            type="number" 
                                            defaultValue="8" 
                                            min="6" 
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="expiry-days">Password Expiry (days)</Label>
                                        <Input 
                                            id="expiry-days" 
                                            type="number" 
                                            defaultValue="90" 
                                            min="0" 
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            0 = never expire
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="space-y-4">
                                <div>
                                    <Label className="font-medium">Admin Account</Label>
                                    <div className="bg-slate-50 p-4 rounded-md mt-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm">Last password change</p>
                                            <Badge variant="outline">14 days ago</Badge>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-3">
                                    <Button className="gap-2" variant="outline">
                                        <Key className="h-4 w-4" />
                                        Change Password
                                    </Button>
                                    <Button className="gap-2" variant="outline">
                                        <Lock className="h-4 w-4" />
                                        Setup 2FA
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="system" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">System Settings</CardTitle>
                                    <CardDescription>Configure system-wide settings</CardDescription>
                                </div>
                                <Database className="h-5 w-5 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Maintenance Mode</p>
                                        <p className="text-sm text-muted-foreground">
                                            Take the system offline for maintenance
                                        </p>
                                    </div>
                                    <Switch 
                                        checked={maintenanceMode}
                                        onCheckedChange={setMaintenanceMode}
                                    />
                                </div>
                                
                                {maintenanceMode && (
                                    <Alert variant="default" className="bg-amber-50 border-amber-200">
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                        <AlertTitle className="text-amber-600">Warning</AlertTitle>
                                        <AlertDescription className="text-amber-600">
                                            Enabling maintenance mode will prevent users from accessing the system.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                
                                <Separator />
                                
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">User Registration</p>
                                        <p className="text-sm text-muted-foreground">
                                            Allow new users to register accounts
                                        </p>
                                    </div>
                                    <Switch 
                                        checked={userRegistration}
                                        onCheckedChange={setUserRegistration}
                                    />
                                </div>
                                
                                <Separator />
                                
                                <div>
                                    <Label htmlFor="backup-schedule">Backup Schedule</Label>
                                    <Select defaultValue="daily">
                                        <SelectTrigger id="backup-schedule" className="mt-1">
                                            <SelectValue placeholder="Select schedule" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hourly">Hourly</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        How often the system data is backed up
                                    </p>
                                </div>
                                
                                <Separator />
                                
                                <div className="space-y-2">
                                    <h3 className="font-medium">System Information</h3>
                                    <div className="bg-slate-50 p-4 rounded-md">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Version</span>
                                                <span className="text-sm font-medium">{version}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Last Updated</span>
                                                <span className="text-sm font-medium">{last_updated}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Environment</span>
                                                <span className="text-sm font-medium">{env?.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end border-t pt-4">
                            <Button variant="outline" className="gap-2 text-red-500 hover:text-red-700 hover:bg-red-50">
                                <RefreshCw className="h-4 w-4" />
                                Reset to Defaults
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}