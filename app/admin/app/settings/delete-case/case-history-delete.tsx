"use client"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from 'zod';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { deleteCase } from '../connect-REST/api';
import { useState } from 'react';
import { useAuditTrail } from '@/lib/hooks/useAuditTrail';

const FormSchema = z.object({
    caseNumber: z.string().min(1, { message: "Case number is required" }),
    caseType: z.enum(["student-teacher", "teacher"], { errorMap: () => ({ message: "Case type is required" }) }),
    productionLevel: z.enum(["uat", "production"], { errorMap: () => ({ message: "Production level is required" }) })
});

export default function CaseHistoryDelete() {
    const [isDeleting, setIsDeleting] = useState(false);
    const  form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            caseNumber: "",
            // caseType: "student-teacher",
            // productionLevel: "uat"
        }
    });
    const { deleteAuditEntries } = useAuditTrail();
    async function onsubmit(data: z.infer<typeof FormSchema>) {
        setIsDeleting(true);
        
        try{
            const response = await deleteAuditEntries(data.caseNumber, data.caseType);;
    
            toast({
                title: "Case history deleted successfully",
                description: `Case number ${data.caseNumber} history has been deleted successfully.`,
                duration: 2000,
                variant: "default"
            })
            form.reset();
        } catch (error) {
            toast({
                title: "Error deleting case history",
                description: `An error occurred while deleting the case. Please try again later.`,
                duration: 2000,
                variant: "destructive"
            })
        } finally {
            setIsDeleting(false);
        }
        form.reset();
    }

    return(
        <Card className='border border-red-500 shadow-md p-4'>
            {/* Danger icon */}
            <div className="flex items-center text-red-500 mb-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                    />
                </svg>
                <span className="ml-2 font-semibold">Danger Zone</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 text-red-500">
            Delete a case record history from the system. 
            </p>
            <p className="text-sm text-muted-foreground mt-1 text-red-500">
                This action is irreversible. Please be certain that you want to delete this case history.
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onsubmit)} className='flex flex-col gap-4'>
                    <div className='space-y-4'>
                        <div>
                            <FormField
                            control={form.control}
                            name="caseNumber"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Record ID</FormLabel>
                                    <FormControl>
                                        <Input
                                        id="caseNumber"
                                        placeholder="Enter record ID"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className="mt-2 w-full md:max-w-md border-red-400 focus:border-red-500 focus:ring-red-500"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />
                        </div>
                        <Separator/>
                        <div className='flex flex-col sm:flex-row gap-3 w-full'>
                            <div className='border-r-2 pr-3'>
                                <FormField
                                    control={form.control}
                                    name="caseType"
                                    render={({field}) => (
                                        <FormItem className='space-y-3'>
                                            <FormLabel>Case type</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex items-center space-x-2">
                                                    <FormItem className='flex items-center space-x-3 space-y-0'>
                                                        <FormControl>
                                                            <RadioGroupItem value="student-teacher"/>
                                                        </FormControl>
                                                        <FormLabel>Student-Teacher</FormLabel>
                                                    </FormItem>
                                                    <FormItem className='flex items-center space-x-3 space-y-0'>
                                                        <FormControl>
                                                            <RadioGroupItem value="teacher"/>
                                                        </FormControl>
                                                        <FormLabel>Teacher</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='border-r-2 pr-3'>
                                <FormField
                                    control={form.control}
                                    name="productionLevel"
                                    render={({field}) => (
                                        <FormItem className='space-y-3'>
                                            <FormLabel>Environment</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex items-center space-x-2">
                                                    <FormItem className='flex items-center space-x-3 space-y-0'>
                                                        <FormControl>
                                                            <RadioGroupItem value="uat"/>
                                                        </FormControl>
                                                        <FormLabel>UAT</FormLabel>
                                                    </FormItem>
                                                    <FormItem className='flex items-center space-x-3 space-y-0'>
                                                        <FormControl>
                                                            <RadioGroupItem value="production" className='border-red-500 text-red-500'/>
                                                        </FormControl>
                                                        <FormLabel className='text-red-500'>Production</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>                
                        </div>
                        <Separator/>
                        <div className='flex flex-col sm:flex-row gap-3 w-full'>
                            <Button 
                            type="submit" 
                            variant={'outline'} 
                            disabled={isDeleting}
                            className='text-red-600 hover:text-red-700 border-2 border-red-500 w-full bold'>
                            {isDeleting ? (
                                <span className="animate-pulse">Deleting...</span>
                            ) : (
                                <span>Delete</span>
                            )}
                            </Button>
                        </div>
                    </div>  
                </form>
            </Form>
        </Card>
    )
}