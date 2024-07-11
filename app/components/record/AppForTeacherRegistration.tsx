'use client'
import { teacherSteps } from "@/app/lib/store";
import Props from "./components/types";
import {motion} from 'framer-motion';
import { useState } from "react";
import { Stepper } from "../Stepper";
import { Preliminary } from "./components/preliminary";
import { Button } from "@/components/ui/button";
import { Bio } from "./components/bio";
import { Employment } from "./components/employment";
import { Qualifications } from "./components/qualifications";
import { Disability } from "./components/disability";
import { Offence } from "./components/offence";
import { Attachments } from "./components/attachments";
import { Declaration } from "./components/declaration";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { statusTransitions } from '@/app/lib/store';
import { UpdateEndorsementStatus, UpdateStatus } from '@/app/lib/actions';
import { useRouter } from 'next/navigation'
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Payment } from "./components/payments";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Work{
    data: Props,
    userRole: string | '',
}

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

export const getNextStatus = (userRole: string): { prev_status: string | null; inv_status: string | null; bar_status: string | null; rej_status: string | null; next_status: string | null; recommend: string | null; endorse: string | null;        reject_label: string | null;
    approve_label: string | null;
    recommend_label: string | null;
    endorse_label: string | null; } => {
    const statusTransition = statusTransitions[userRole.toLowerCase()] || statusTransitions['Default'];
    return statusTransition;
};

export const ApplicationForTeacherRegistration: React.FC<Work> = (data, userRole) => {
    const { prev_status, next_status, rej_status, bar_status, inv_status, recommend, endorse, approve_label, reject_label, recommend_label, endorse_label } = getNextStatus(data?.userRole);
    const [previousStep, setPreviousStep] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const delta = currentStep - previousStep
    const router = useRouter()
    const { toast } = useToast()

    const next = async () => {
        const fields = teacherSteps[currentStep].fields

        if (currentStep < teacherSteps.length - 1){
            if(currentStep === teacherSteps.length - 2){

            }
            setPreviousStep(currentStep)
            setCurrentStep(step => step + 1)
        }
    } 

    const prev = () => {
        if (currentStep > 0){
            setPreviousStep(step => step + 1)
            setCurrentStep(step => step - 1)
        }
    }

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

    return (
        <div className="rounded-lg py-2 px-5 my-2 mr-2 shadow-lg w-full bg-white">
            <div className="w-full">
                <div className="flex w-full">
                    <div className="flex justify-center mb-2 w-full">
                        <span className="font-bold text-3xl text-gray-700">Application For Teacher Registration</span>
                    </div>
                </div>
                <div className="bg-sky-300 w-full h-1 px-20 rounded-lg mb-2"/>
                <div className="flex md:m-5 w-full space-x-1 md:h-full">
                    {/* steps */}
                    <nav aria-label="Progress" className="w-48 hidden md:block">
                        <Stepper currentStep={currentStep} steps={teacherSteps}/>
                    </nav>
                    {/* content area */}
                    <div className="w-[calc(100%)] pr-2">
                        {currentStep === 0 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-96 h-96 w-full p-3 rounded-lg mb-2 mr-1">
                                    <Preliminary {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 1 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-96 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <Bio {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 2 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-96 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <Employment {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 3 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-96 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <Qualifications {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 4 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-96 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <Disability {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 5 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-96 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <Offence {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 6 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-96 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <Attachments {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 7 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-96 h-96 p-3 rounded-lg mb-2 mr-1">
                                <Declaration {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 8 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-96 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <Payment {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 9 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-96 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <span>Add comment</span>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 10 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-96 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <ScrollArea className="h-full">
                                        <div className="px-5">
                                            <Accordion type="single" collapsible>
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger>PRELIMINARY INFORMATION</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Preliminary {...data?.data}/>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-2">
                                                    <AccordionTrigger>PROFILE INFO</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Bio {...data?.data}/>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-3">
                                                    <AccordionTrigger>EMPLOYMENT DETAILS</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Employment {...data?.data}/>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-4">
                                                    <AccordionTrigger>QUALIFICATIONS</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Qualifications {...data?.data}/>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-5">
                                                    <AccordionTrigger>DISABILITY</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Disability {...data?.data}/>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-6">
                                                    <AccordionTrigger>OFFENCE</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Offence {...data?.data}/>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-7">
                                                    <AccordionTrigger>ATTACHMENTS</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Attachments {...data?.data}/>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-8">
                                                    <AccordionTrigger>DECLARATION</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Declaration {...data?.data}/>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-9">
                                                    <AccordionTrigger>PAYMENT</AccordionTrigger>
                                                    <AccordionContent>
                                                        <Payment {...data?.data}/>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-10">
                                                    <AccordionTrigger>COMMENTS</AccordionTrigger>
                                                    <AccordionContent>
                                                        <span>Add comment</span>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    </ScrollArea>
                                </div>
                            </motion.div>
                        )}
                        {/* Navigation buttons */}
                        <div className="flex float-end space-x-2 mx-5">
                            <button 
                                type="button" 
                                onClick={prev}
                                hidden={currentStep === 0}
                                className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                                >Prev
                            </button>
                            <button 
                            type="button" 
                            onClick={next}
                            hidden={currentStep === teacherSteps.length - 1}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                            >Next
                            </button>
                            {(prev_status || inv_status || bar_status || rej_status) && (currentStep === teacherSteps.length - 1) &&
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline">{reject_label}</Button>
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
                                                        <FormLabel>Send to</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <SelectTrigger className="w-[200px]">
                                                                    <SelectValue placeholder="Select..." />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>Selections</SelectLabel>
                                                                        {prev_status &&(<SelectItem value={prev_status}>{prev_status === 'Pending-Review' ? (<>Return to reg-officer</>):(<>Return to customer</>)}</SelectItem>)}
                                                                        {inv_status && (<SelectItem value={inv_status}>Investigations</SelectItem>)}
                                                                        {rej_status && (<SelectItem value={rej_status}>Rejected</SelectItem>)}
                                                                        {bar_status && (<SelectItem value={bar_status}>Barred</SelectItem>)}
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
                            {next_status && (currentStep === teacherSteps.length - 1) &&
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="default" className=''>{approve_label}</Button>
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
                            {recommend && (currentStep === teacherSteps.length - 1) &&
                                <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" className=''>{recommend_label}</Button>
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
                            {endorse && (currentStep === teacherSteps.length - 1) &&
                                <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="default" className=''>{endorse_label}</Button>
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
                </div>
            </div>
        </div>
    )
}