"use client"
import React, {Suspense, useState} from 'react';
import StatusHistory from './StatusHistory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { ToastAction } from '@/components/ui/toast';
import { toast, useToast } from '@/components/ui/use-toast';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    } from "@/components/ui/alert-dialog"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { UpdateEndorsementStatus, UpdateStatus } from '@/app/lib/actions';
import Link from 'next/link';
import { roundToNearestMinutes } from 'date-fns';
import { apiUrl, mgt, statusTransitions } from '@/app/lib/store';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"


  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  
import Props from './components/types';
import { Employment } from './components/employment';
import { Preliminary } from './components/preliminary';
import { Bio } from './components/bio';
import { Attachments } from './components/attachments';
import { Disability } from './components/disability';
import { Offence } from './components/offence';
import { Declaration } from './components/declaration';
import { Qualifications } from './components/qualifications';
import { StudentPreliminary } from './components/student-preliminary';
import { StudyProgramme } from './components/study-programme';
import { Recommendation } from './components/recommendation';
interface Work{
    data: Props,
    userRole: string
}

export const getNextStatus = (userRole: string): { prev_status: string | null; inv_status: string | null; bar_status: string | null; rej_status: string | null; next_status: string | null; recommend: string | null; endorse: string | null; } => {
    const statusTransition = statusTransitions[userRole] || statusTransitions['Default'];
    return statusTransition;
};

const items = [
    {
      id: "national_id_copy",
      label: "National ID",
    },
    {
      id: "qualification_copy",
      label: "Qualification copy",
    },
    {
      id: "proof_of_payment",
      label: "Proof of payment",
    },
    {
      id: "attachments",
      label: "Qualifications attachment",
    },
    {
      id: "attachment",
      label: "Recommendation attachment",
    },
  ] as const

const WorkArea: React.FC<Work> = (data, userRole) => {
    const { prev_status, next_status, rej_status, bar_status, inv_status, recommend, endorse } = getNextStatus(data?.userRole);
    const router = useRouter()
    const { toast } = useToast()
    const handleStatusChange=async (id:string, status:string)=>{
        if(status){
            const res = await UpdateStatus(data?.data?.teacher_registrations?.national_id, status)
    
            router.prefetch('/trls/home')
            if(res !== 201){
                toast({
                    title: "Failed!!!",
                    description: "Something went wrong",
                    action: (
                    <ToastAction altText="Ok">Ok</ToastAction>
                    ),
                })
            }else{
                toast({
                    title: "Routed successfully",
                    description: "The record has been routed with the status: "+status,
                    action: (
                    <ToastAction altText="Ok">Ok</ToastAction>
                    ),
                })
                router.push('/trls/home')
            }
        }else{
            toast({
                title: "Failed!!!",
                description: "Next status cannot be undefined/null",
                action: (
                <ToastAction altText="Ok">Ok</ToastAction>
                ),
            })
        }
    }

    const handleEndorsementStatusUpdate=async (id:string, status:string)=>{
        if(status){
            const res = await UpdateEndorsementStatus(data?.data?.teacher_registrations?.national_id, status)
            router.prefetch('/trls/home')
            if(res !== 201){
                toast({
                    title: "Failed!!!",
                    description: "Something went wrong",
                    action: (
                    <ToastAction altText="Ok">Ok</ToastAction>
                    ),
                })
            }else{
                toast({
                    title: "Routed successfully",
                    description: "The record has been routed with the status: "+status,
                    action: (
                    <ToastAction altText="Ok">Ok</ToastAction>
                    ),
                })
                router.push('/trls/home')
            }
        }else{
            toast({
                title: "Failed!!!",
                description: "Next status cannot be undefined/null",
                action: (
                <ToastAction altText="Ok">Ok</ToastAction>
                ),
            })
        }
    }

    const FormSchema = z.object({
        status: z
          .string({
            required_error: 'Please select rejection type.',
            // path: ['status']
          }),
        evidence: z
          .any()
          .optional(),
        // items: z.array(z.string()).optional().refine((value) => value ? value.some((item) => item) : true, {
        //     message: "You have to select at least one item.",
        // }),
        items: z.array(z.string()).refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: ['attachment'],
        }
      })
      async function onSubmit(record: z.infer<typeof FormSchema>) {
        const res = await UpdateStatus(data?.data?.teacher_registrations?.national_id, record.status);
        if(!res){
            toast({
                title: "Failed!!!",
                description: "Something went wrong",
                action: (
                  <ToastAction altText="Ok">Ok</ToastAction>
                ),
            })
        }else{
            toast({
                title: "Routed successfully",
                description: "The record has been routed with the status: "+record.status,
                action: (
                <ToastAction altText="Ok">Ok</ToastAction>
                ),
            })
            router.push('/trls/home')
        }
      }
      const status = form.watch("status"); // watch status changes, for validations and ...
      const evidence = form.watch('evidence')
    return (                    
        <div className="flex-row w-full font-sans items-start h-lvh rounded bg-gray-50">
            <Tabs defaultValue='bio' className='w-full'>
                <TabsList className='flex'>
                    {data?.data?.teacher_preliminary_infos && <TabsTrigger value='preliminary'>Preliminary</TabsTrigger>}
                    {data?.data?.student_preliminary_infos && <TabsTrigger value='student-preliminary'>Preliminary</TabsTrigger>}
                    {data?.data?.bio_datas && <TabsTrigger value='bio'>Bio</TabsTrigger>}
                    {data?.data?.employment_details && <TabsTrigger value='employment'>Employment</TabsTrigger>}
                    {data?.data?.student_study_programmes && <TabsTrigger value='study-programme'>Study Programmes</TabsTrigger>}
                    {data?.data?.edu_pro_qualifications && <TabsTrigger value='qualifications'>Qualifications</TabsTrigger>}
                    {data?.data?.bio_datas.disability && <TabsTrigger value='disability'>Disability</TabsTrigger>}
                    {data?.data?.offence_convictions && <TabsTrigger value='offence'>Offence</TabsTrigger>}
                    {data?.data?.institution_recommendations && <TabsTrigger value='recommendation'>Recommendations</TabsTrigger>}
                    {data?.data?.attachments && <TabsTrigger value='attachments'>Attachments</TabsTrigger>}
                    {data?.data?.declarations && <TabsTrigger value='declaration'>Declaration</TabsTrigger>}
                </TabsList>
                <ScrollArea className='h-lvh'>
                    <Card className='mx-8 my-2'>    
                        <TabsContent value='preliminary'>
                            <Preliminary {...data?.data}/>
                        </TabsContent>
                        <TabsContent value='student-preliminary'>
                            <StudentPreliminary {...data?.data}/>
                        </TabsContent>
                        <TabsContent value='bio'>
                            <Bio {...data?.data}/>
                        </TabsContent>
                        <TabsContent value='employment'>
                            <Employment {...data?.data}/>
                        </TabsContent>
                        <TabsContent value='study-programme'>
                            <StudyProgramme {...data?.data}/>
                        </TabsContent>
                        <TabsContent value='qualifications'>
                            <Qualifications {...data?.data}/>
                        </TabsContent>
                        <TabsContent value='recommendation'>
                            <Recommendation {...data?.data}/>
                        </TabsContent>
                        <TabsContent value='disability'>
                            <Disability {...data?.data}/>
                        </TabsContent>
                        <TabsContent value='offence'>
                            <Offence {...data?.data}/>
                        </TabsContent>
                        <TabsContent value='attachments'>
                            {/* <Attachments/> */}
                        </TabsContent>
                        <TabsContent value='declaration'>
                            <Declaration {...data?.data}/>
                        </TabsContent>
                        <div className='p-1 mx-8 mb-2'>
                            <div className='flex space-x-2 justify-end'>
                                {(prev_status || inv_status || bar_status || rej_status) &&
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline">Reject</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        {/* <AlertDialogDescription>
                                            This action will change the status to <span className='italic font-medium'>{prev_status}</span>, and this will route the application to the previous level.
                                        </AlertDialogDescription> */}
                                        </AlertDialogHeader>
                                        {/* <Label className="font-light"></Label> */}
                                        <Form  {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                                                    <FormField
                                                    control={form.control}
                                                    name="status"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                        <FormLabel>Rejection type</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <SelectTrigger className="w-[200px]">
                                                                    <SelectValue placeholder="Select a rejection type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>Rejections</SelectLabel>
                                                                        {prev_status &&(<SelectItem value={prev_status}>{prev_status === 'Pending-Review' ? (<>Return to reg-officer</>):(<>Return to customer</>)}</SelectItem>)}
                                                                        {inv_status && (<SelectItem value={inv_status}>Route to investigations</SelectItem>)}
                                                                        {rej_status && (<SelectItem value={rej_status}>Send to rejected</SelectItem>)}
                                                                        {bar_status && (<SelectItem value={bar_status}>Send to barred</SelectItem>)}
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        {/* <FormDescription>
                                                            You can manage email addresses in your{" "}
                                                            <Link href="/examples/forms">email settings</Link>.
                                                        </FormDescription> */}
                                                        <FormMessage />
                                                </FormItem>
                                                )}
                                                />
                                                {status === bar_status && (
                                                <FormField
                                                control={form.control}
                                                name="evidence"
                                                render={({ field }) => {
                                                    return (
                                                    <FormItem>
                                                        <FormLabel>Attach supporting evidence</FormLabel>
                                                        <FormControl>
                                                        <Input
                                                        type="file"
                                                        accept="application/pdf"
                                                        placeholder="Attach a file"
                                                        {...evidence}
                                                        onChange={(event) => {
                                                            field.onChange(event.target?.files?.[0] ?? undefined);
                                                        }}
                                                        />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Max File Size: 5MB Accepted File Types: .pdf
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                    );
                                                }}
                                                />)}
                                                {status === prev_status && prev_status !== 'Pending-Review' && <FormField
                                                    control={form.control}
                                                    name="items"
                                                    render={() => (
                                                        <FormItem>
                                                        <div className="mb-4">
                                                            <FormLabel className="text-base">Attachments</FormLabel>
                                                            <FormDescription>
                                                            Select the items you want the customer to update.
                                                            </FormDescription>
                                                        </div>
                                                        {items.map((item) => (
                                                            <FormField
                                                            key={item.id}
                                                            control={form.control}
                                                            name="items"
                                                            render={({ field }) => {
                                                                return (
                                                                <FormItem
                                                                    key={item.id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, item.id])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                (value) => value !== item.id
                                                                                )
                                                                            )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-sm font-normal">
                                                                {item.label}
                                                                </FormLabel>
                                                            </FormItem>
                                                            )
                                                        }}
                                                        />
                                                    ))}
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                                />}
                                                <AlertDialogFooter className='w-full items-end justify-end'>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <Button
                                                    className=''
                                                    type='submit'
                                                    // onClick={async () => await handleStatusChange(data?.data?.teacher_preliminary_infos.national_id, status)}
                                                    >Submit</Button>
                                                </AlertDialogFooter>
                                                </form>
                                            </Form>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        }
                                        {next_status && 
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="default" className=''>Approve</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>                                
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action will change the status to <span className='italic font-medium'>{next_status}</span>, and this will route the application to the next level.
                                                </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className='bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
                                                        onClick={async () => await handleStatusChange(data?.data?.teacher_registrations?.national_id, next_status!)}
                                                        >Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    }
                                    {recommend &&
                                    <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" className=''>Recommend</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>                                
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action will change the status to <span className='italic font-medium'>{recommend}</span>, and this will route the application to the next level.
                                                </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className='bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
                                                        onClick={async () => await handleEndorsementStatusUpdate(data?.data?.teacher_registrations?.national_id, recommend!)}
                                                        >Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    }
                                    {endorse &&
                                    <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="default" className=''>Endorse</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>                                
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action will change the status to <span className='italic font-medium'>{endorse}</span>, and this will complete the application process.
                                                </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className='bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
                                                        onClick={async () => await handleEndorsementStatusUpdate(data?.data?.teacher_registrations?.national_id, endorse!)}
                                                        >Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    }
                                </div>
                            </div>
                            </Card>
                            <Card className='mx-8 mb-2'>
                                <ScrollArea className="h-72">
                                    <Suspense fallback={<LoadingSkeleton/>}>
                                        <StatusHistory reg_number=""/>
                                    </Suspense>
                                </ScrollArea>
                            </Card>
                    </ScrollArea>
            </Tabs>
        </div>
    );
}
export default WorkArea;