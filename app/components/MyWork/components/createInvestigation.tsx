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
import { User, Phone, CreditCard, Briefcase, Users, Flag, Calendar, Clock, Home, MapPin, FileText } from 'lucide-react';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import { createComplaint } from '@/app/lib/actions';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

const formSchema = z.object({
    name_of_reporter: z.string().min(2, {message: "Name must be at least 2 characters."}),
    contact_number: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Contact must be a valid number." }),
    ID_Passport: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Contact must be a valid number." }),
    occupation: z.string().min(2, {message: "Occupation must be at least 2 characters."}),
    sex: z.string().optional(),
    nationality: z.string().optional(),
    date: z.date({required_error: "Please select a date and time", invalid_type_error: "That's not a date!"}),
    address: z.string().optional(),
})

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
                                        <CardTitle className="text-lg font-semibold text-sky-600">Personal Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            
                                            <div className="flex items-center space-x-2">
                                                <User className="text-gray-500" />
                                                <div className="grid w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name='name_of_reporter'
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormLabel>Name</FormLabel>
                                                                <FormControl>
                                                                    
                                                                </FormControl>
                                                            </FormItem>
                                                        )}                                                  
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="text-gray-500" />
                                                <div className="grid w-full">
                                                    <Label htmlFor="contact">Contact</Label>
                                                    <Input id="contact" />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <CreditCard className="text-gray-500" />
                                                <div className="grid w-full">
                                                    <Label htmlFor="id">ID/Passport</Label>
                                                    <Input id="id" />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Briefcase className="text-gray-500" />
                                                <div className="grid w-full">
                                                    <Label htmlFor="occupation">Occupation</Label>
                                                    <Input id="occupation" />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Users className="text-gray-500" />
                                                <div className="grid w-full">
                                                    <Label htmlFor="sex">Sex</Label>
                                                    <Input id="sex" />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Flag className="text-gray-500" />
                                                <div className="grid w-full">
                                                    <Label htmlFor="nationality">Nationality</Label>
                                                    <Input id="nationality" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-sky-600">Incident Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="text-gray-500" />
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
                                                <Calendar className="text-gray-500" />
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