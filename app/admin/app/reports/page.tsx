'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { 
    BarChart3, 
    FileDown, 
    FileSpreadsheet, 
    Calendar, 
    Users, 
    Activity, 
    LineChart, 
    PieChart, 
    BarChart, 
    Loader2,
    Table,
    Filter,
    Folder
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

// Sample report data
const generateSampleData = () => {
    return [
        { id: 1, name: 'User Activity Report', date: 'Feb 25, 2025', status: 'Complete', type: 'PDF' },
        { id: 2, name: 'New User Registration', date: 'Feb 22, 2025', status: 'Complete', type: 'Excel' },
        { id: 3, name: 'System Performance', date: 'Feb 20, 2025', status: 'Complete', type: 'Excel' },
        { id: 4, name: 'Monthly Analytics', date: 'Feb 1, 2025', status: 'Complete', type: 'PDF' },
    ]
}

export default function ReportsPage() {
    const [selectedReport, setSelectedReport] = useState<string>('')
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, 1, 1), // February 1, 2025
        to: new Date() // Today
    })
    const [isGenerating, setIsGenerating] = useState(false)
    const [previousReports] = useState(generateSampleData())

    const reports = [
        { id: 'users', name: 'Users Report', description: 'User registration and activity data', icon: <Users className="h-5 w-5" /> },
        { id: 'activity', name: 'Activity Log', description: 'System activity and audit trail', icon: <Activity className="h-5 w-5" /> },
        { id: 'analytics', name: 'Analytics Report', description: 'Usage metrics and analytics', icon: <BarChart className="h-5 w-5" /> },
        { id: 'performance', name: 'Performance Report', description: 'System performance metrics', icon: <LineChart className="h-5 w-5" /> },
        { id: 'registrations', name: 'Registration Report', description: 'New user registrations', icon: <PieChart className="h-5 w-5" /> },
    ]
    
    const reportFormats = [
        { id: 'pdf', name: 'PDF', icon: <Folder className="h-4 w-4" /> },
        { id: 'excel', name: 'Excel', icon: <FileSpreadsheet className="h-4 w-4" /> },
        { id: 'csv', name: 'CSV', icon: <FileDown className="h-4 w-4" /> },
    ]
    
    const handleGenerateReport = () => {
        setIsGenerating(true)
        
        // Simulate API call delay
        setTimeout(() => {
            setIsGenerating(false)
            alert(`Generated ${selectedReport} report from ${date?.from ? format(date.from, 'PP') : ''} to ${date?.to ? format(date.to, 'PP') : ''}`)
        }, 2000)
    }

    return (
        <div className="space-y-6 md:p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground mt-1">
                        Generate and view system reports and analytics
                    </p>
                </div>
            </div>
            
            <Tabs defaultValue="generate" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-auto">
                    <TabsTrigger value="generate">Generate Reports</TabsTrigger>
                    <TabsTrigger value="history">Report History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="generate" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <CardTitle>Generate Reports</CardTitle>
                                        <CardDescription>Create custom reports based on your criteria</CardDescription>
                                    </div>
                                </div>
                                <Button
                                    className="gap-2 min-w-28"
                                    disabled={!selectedReport || isGenerating}
                                    onClick={handleGenerateReport}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FileDown className="h-4 w-4" />
                                            Generate
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="report-type">Report Type</Label>
                                    <Select
                                        value={selectedReport}
                                        onValueChange={setSelectedReport}
                                    >
                                        <SelectTrigger id="report-type" className="w-full mt-1">
                                            <SelectValue placeholder="Select a report type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {reports.map((report) => (
                                                <SelectItem key={report.id} value={report.id}>
                                                    <div className="flex items-center gap-2">
                                                        {report.icon}
                                                        <span>{report.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedReport && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {reports.find(r => r.id === selectedReport)?.description}
                                        </p>
                                    )}
                                </div>
                                
                                <div>
                                    <Label className="block mb-1">Date Range</Label>
                                    {/* <DatePickerWithRange date={date} setDate={setDate} /> */}
                                </div>
                            </div>
                            
                            {selectedReport && (
                                <>
                                    <Separator />
                                    
                                    <div>
                                        <h3 className="font-medium mb-2">Report Format</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {reportFormats.map((format) => (
                                                <Button key={format.id} variant="outline" className="gap-2">
                                                    {format.icon}
                                                    {format.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div>
                                        <h3 className="font-medium mb-3">Data to Include</h3>
                                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="data-1" defaultChecked />
                                                <label htmlFor="data-1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    User Information
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="data-2" defaultChecked />
                                                <label htmlFor="data-2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Activity Timestamps
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="data-3" defaultChecked />
                                                <label htmlFor="data-3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    IP Addresses
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="data-4" />
                                                <label htmlFor="data-4" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Browser/Device Info
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="data-5" defaultChecked />
                                                <label htmlFor="data-5" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Statistics Summary
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="data-6" />
                                                <label htmlFor="data-6" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Visualizations
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <LineChart className="h-5 w-5 text-green-600" />
                                    <CardTitle>Quick Reports</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <Button variant="outline" className="h-auto py-4 justify-start gap-3">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    <div className="flex flex-col items-start">
                                        <span>User Activity</span>
                                        <span className="text-xs text-muted-foreground">Last 7 days</span>
                                    </div>
                                </Button>
                                
                                <Button variant="outline" className="h-auto py-4 justify-start gap-3">
                                    <Activity className="h-5 w-5 text-amber-600" />
                                    <div className="flex flex-col items-start">
                                        <span>System Activity</span>
                                        <span className="text-xs text-muted-foreground">Last 30 days</span>
                                    </div>
                                </Button>
                                
                                <Button variant="outline" className="h-auto py-4 justify-start gap-3">
                                    <PieChart className="h-5 w-5 text-purple-600" />
                                    <div className="flex flex-col items-start">
                                        <span>Registration Summary</span>
                                        <span className="text-xs text-muted-foreground">This month</span>
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="history" className="space-y-4 mt-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Input 
                                className="w-full sm:w-64" 
                                placeholder="Search reports..." 
                            />
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        <Select defaultValue="recent">
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Most Recent</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="type">Report Type</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <Table className="h-5 w-5 text-blue-600" />
                                <CardTitle>Previous Reports</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <div className="flex flex-col">
                                    <div className="grid grid-cols-12 gap-2 border-b bg-slate-50 p-4 font-medium">
                                        <div className="col-span-6 md:col-span-5">Report Name</div>
                                        <div className="col-span-4 md:col-span-3 text-right md:text-left">Date</div>
                                        <div className="hidden md:block md:col-span-2">Status</div>
                                        <div className="col-span-2 text-right">Actions</div>
                                    </div>
                                    
                                    {previousReports.map((report) => (
                                        <div key={report.id} className="grid grid-cols-12 gap-2 border-b p-4 items-center">
                                            <div className="col-span-6 md:col-span-5 flex items-center gap-2">
                                                {report.type === 'PDF' ? (
                                                    <Folder className="h-4 w-4 text-red-500" />
                                                ) : (
                                                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                                )}
                                                <span className="font-medium truncate">{report.name}</span>
                                            </div>
                                            
                                            <div className="col-span-4 md:col-span-3 text-right md:text-left text-sm text-muted-foreground flex items-center gap-1 justify-end md:justify-start">
                                                <Calendar className="h-3 w-3" />
                                                <span>{report.date}</span>
                                            </div>
                                            
                                            <div className="hidden md:block md:col-span-2">
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    {report.status}
                                                </Badge>
                                            </div>
                                            
                                            <div className="col-span-2 flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <FileDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                            <div className="text-sm text-muted-foreground">
                                Showing 4 of 4 reports
                            </div>
                            <div className="flex gap-1">
                                <Button variant="outline" size="sm" disabled>Previous</Button>
                                <Button variant="outline" size="sm" disabled>Next</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}