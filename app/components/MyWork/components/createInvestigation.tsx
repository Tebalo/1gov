'use client'

import {useState} from 'react';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Phone, CreditCard, Briefcase, Users, Flag, Clock, Home, MapPin, FileText } from 'lucide-react';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import { createComplaint } from '@/app/lib/actions';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

const reporter =  z.object({
    name: z.string().optional(),
    contact_number: z.string().optional(),
    Omang_id: z.string().optional(),
    passport_no: z.string().optional(),
    occupation: z.string().optional(),
    sex: z.string().optional(),
    nationality: z.string().optional(),
    address: z.string().optional()
})

const complaint = z.object({
    crime_location: z.string().optional(),
    mature_of_crime: z.string().optional(),
    date: z.date().optional(),
    time: z.string().optional(),
    bif_number: z.string().optional(),
    case_number: z.string().optional(),
    fir_number: z.string().optional(),
    outcome: z.string().optional()
})

const offender = z.object({
    name: z.string().optional(),
    sex: z.string().optional(),
    nationality: z.string().optional(),
    dob: z.string().optional(),
    age: z.string().optional(),
    contact_number: z.string().optional(),
    id_passport_number: z.string().optional(),
    address: z.string().optional(),
    ward: z.string().optional(),
    place_of_work: z.string().optional()
})

const investigation = z.object({
    investigating_officer: z.string().optional(),
    police_station: z.string().optional(),
    cr_number: z.string().optional(),
    offence: z.string().optional(),
    outcome: z.string().optional()
})

const formSchema = z.object({
    reporter: reporter,
    complaint: complaint,
    offender: offender,
    investigation: investigation
})

const nationals = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
] as const;

export const CreateInvestigation: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>){
        setIsSubmitting(true);
        try{
            const payload = {
                ...values
            }
            await createComplaint(payload)
        }catch (error){
            console.error('Failed to create complaint', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Complaint</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4">
                    <DialogTitle className="text-2xl font-bold text-sky-700">Complaint Form</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-grow px-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        
                            <div className="grid gap-6 pb-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-sky-600">Reporter Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">                                            
                                                <div className="grid w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name='reporter.name'
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <div className='flex items-center space-x-2'>
                                                                <User className="text-gray-500" />
                                                                    <FormLabel>Name</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}                                                  
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="grid w-full">
                                                    <FormField
                                                            control={form.control}
                                                            name='reporter.contact_number'
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <div className='flex items-center space-x-2'>
                                                                        <Phone className="text-gray-500" />
                                                                        <FormLabel>Contact</FormLabel>
                                                                    </div>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}                                                  
                                                        />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="grid w-full">
                                                <FormField
                                                        control={form.control}
                                                        name='reporter.Omang_id'
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <div className='flex items-center space-x-2'>
                                                                    <CreditCard className="text-gray-500" />
                                                                    <FormLabel>Omang</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}                                                  
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="grid w-full">
                                                <FormField
                                                        control={form.control}
                                                        name='reporter.passport_no'
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <div className='flex items-center space-x-2'>
                                                                    <CreditCard className="text-gray-500" />
                                                                    <FormLabel>Passport</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}                                                  
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="grid w-full">
                                                <FormField
                                                        control={form.control}
                                                        name='reporter.occupation'
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <div className='flex items-center space-x-2'>
                                                                    <Briefcase className="text-gray-500" />
                                                                    <FormLabel>Occupation</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}                                                  
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="grid w-full">
                                                <FormField
                                                        control={form.control}
                                                        name='reporter.sex'
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <div className='flex items-center space-x-2'>
                                                                    <Users className="text-gray-500" />
                                                                    <FormLabel>Sex</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}                                                  
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="grid w-full">
                                                <FormField
                                                        control={form.control}
                                                        name='reporter.nationality'
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <div className='flex items-center space-x-2'>
                                                                <Flag className="text-gray-500" />
                                                                    <FormLabel>Nationality</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    className={cn(
                                                                        "w-[200px] justify-between",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                    >
                                                                    {field.value
                                                                        ? nationals.find(
                                                                            (national) => national.value === field.value
                                                                        )?.label
                                                                        : "Select nationality"}
                                                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}                                                  
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-sky-600">Complaint Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">                                            
                                                <div className="grid w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name='complaint.crime_location'
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <div className='flex items-center space-x-2'>
                                                                    <MapPin className="text-gray-500" />
                                                                    <FormLabel>Crime location</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}                                                  
                                                    />
                                                </div>
                                            </div>
                                                
                                            <div className="flex items-center space-x-2">                                            
                                                <div className="grid w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name="complaint.date"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col">
                                                                <div className='flex items-center space-x-2'>
                                                                    <CalendarIcon className="h-5 w-5 opacity-50" />
                                                                    <FormLabel>Date of birth</FormLabel>
                                                                </div>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "w-[240px] pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                            >
                                                                            {field.value ? (
                                                                                format(field.value, "PPP")
                                                                            ) : (
                                                                                <span>Pick a date</span>
                                                                            )}
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value}
                                                                        onSelect={field.onChange}
                                                                        disabled={(date) =>
                                                                        date > new Date() || date < new Date("1900-01-01")
                                                                        }
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* <div className="flex items-center space-x-2">
                                                <Calendar className="text-gray-500" />
                                                <div className="grid w-full">
                                                    <Label htmlFor="date">Date</Label>
                                                    <Input id="date" type="date" />
                                                </div>
                                            </div> */}

                                            <div className="flex items-center space-x-2">
                                                <Clock className="text-gray-500" />
                                                <div className="grid w-full">
                                                    <Label htmlFor="time">Time</Label>
                                                    <Input id="time" type="time" />
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Home className="text-gray-500" />
                                                <div className="grid w-full">
                                                    <Label htmlFor="address">Address</Label>
                                                    <Input id="address" />
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 col-span-2">                                            
                                                <div className="grid w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name='complaint.mature_of_crime'
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <div className='flex items-center space-x-2'>
                                                                    <MapPin className="text-gray-500" />
                                                                    <FormLabel>Nature of Crime</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                    <Textarea
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}                                                  
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-sky-600">Offenders Particulars</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <User className="text-gray-500" />
                                                <div className="grid w-full">
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input id="name" />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {/* <Calendar className="text-gray-500" /> */}
                                                <div className="grid w-full">
                                                    <Label htmlFor="date">Date</Label>
                                                    <Input id="date" type="date" />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="text-gray-500" />
                                                <div className="grid w-full">
                                                    <Label htmlFor="time">Time</Label>
                                                    <Input id="time" type="time" />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Home className="text-gray-500" />
                                                <div className="grid w-full">
                                                    <Label htmlFor="address">Address</Label>
                                                    <Input id="address" />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="text-gray-500" />
                                                <div className="grid w-full">
                                                    <Label htmlFor="crimeLocation">Crime Location</Label>
                                                    <Input id="crimeLocation" />
                                                </div>
                                            </div>
                                            <div className="col-span-2 flex items-start space-x-2">
                                                <FileText className="text-gray-500 mt-1" />
                                                <div className="grid w-full">
                                                    <Label htmlFor="crimeNature">Nature of Crime</Label>
                                                    <Textarea id="crimeNature" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-sky-600">Investigation Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">                                            
                                                <div className="grid w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name='investigation.investigating_officer'
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <div className='flex items-center space-x-2'>
                                                                <User className="text-gray-500" />
                                                                    <FormLabel>Investigating Officer</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}                                                  
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="grid w-full">
                                                    <FormField
                                                            control={form.control}
                                                            name='investigation.police_station'
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <div className='flex items-center space-x-2'>
                                                                        <Phone className="text-gray-500" />
                                                                        <FormLabel>Police Station</FormLabel>
                                                                    </div>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}                                                  
                                                        />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="grid w-full">
                                                <FormField
                                                        control={form.control}
                                                        name='investigation.cr_number'
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <div className='flex items-center space-x-2'>
                                                                    <CreditCard className="text-gray-500" />
                                                                    <FormLabel>CR Number</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}                                                  
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="grid w-full">
                                                <FormField
                                                        control={form.control}
                                                        name='investigation.offence'
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <div className='flex items-center space-x-2'>
                                                                    <CreditCard className="text-gray-500" />
                                                                    <FormLabel>Offence</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}                                                  
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="grid w-full">
                                                <FormField
                                                        control={form.control}
                                                        name='investigation.outcome'
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <div className='flex items-center space-x-2'>
                                                                    <Briefcase className="text-gray-500" />
                                                                    <FormLabel>Outcome</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}                                                  
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        
                    </form>
                </Form>
                </ScrollArea>
                <div className="p-6 pt-0">
                    <Button type="submit" className="w-full">Submit Complaint</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}