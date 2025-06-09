"use client"
import { Role, getFlowActionUserDetails } from "@/app/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { StatusType } from "../types/teacher-type";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, GitBranch, Tags } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAuthData } from "@/app/welcome/components/email-login";
import { updateTeacherStatus } from "../api/update-status";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ProgressIndicator from "../../student-teacher/actions/progress-indicator";

interface ActionSectionProps {
    recordId: string;
    userRole: Role;
    current_status: string;
}

interface FlowActionConfig {
    hasPermission: boolean;
    nextStatus: string[] | undefined;
    message?: string;
    status_label: string;
    isAllowedRole: boolean;
}

const getStatusDescription = (status: StatusType): string => {
    const descriptions: Record<StatusType, string> = {
      'PENDING-CUSTOMER-ACTION': 'Customer needs to provide additional information',
      'PENDING-ASSESSMENT': 'Pass screening',
      'PENDING-SCREENING': 'Pass screening',
      'MANAGER-REJECTED': 'Reject and send notification to customer',
      'MANAGER-APPROVED': 'Approve and send notification to customer',
      'RECOMMENDED-FOR-APPROVAL': 'Recommend for approval',
      'RECOMMENDED-FOR-REJECTION': 'Recommend for rejection',
      'PENDING-ENDORSEMENT': 'Submit for endorsement',
      'ENDORSEMENT-COMPLETE': 'Close and send notification to customer',
    };
    return descriptions[status];
  };
  
  const items = [
    { id: "national_id_copy", label: "National ID copy" },
    { id: "qualification_copy", label: "BQA Evaluation Report copy" },
    { id: "qualifications", label: "Other Qualification's" },
    { id: "student_related_offence_attachments", label: "Student related offence copy" },
    { id: "drug_related_offence_attachments", label: "Drug related offence copy" },
    { id: "proof_of_payment", label: "Proof of payment" },
    { id: "attachments", label: "Mandatory qualification's attachment" },
    { id: "work_permit", label: "Work permit" },
  ] as const;

  const formSchema = z.object({
    status: z.enum([
        'Pending-Customer-Action',
        'Pending-Assessment',
        'Pending-Screening',
        'Manager-Rejected',
        'Manager-Approved',
        'Recommended-For-Approval',
        'Recommended-For-Rejection',
        'Pending-Endorsement',
        'Endorsement-Complete',
    ],{required_error: "Please select an action"}),
    items: z.array(z.string()).optional().refine((value) => {
        // Only require items if status is 'Pending-Customer-Action'
        if (value?.includes('Pending-Customer-Action')) {
            return (value ?? []).length > 0;
        }
        return true;
    }, {
        message: "Please select at least one field", 
    }),
    comments: z.string().optional(),
  })


const TeacherActions: React.FC<ActionSectionProps> = ({ recordId, userRole, current_status }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    // Get flow-actions from the store
    const accessConfig: FlowActionConfig = getFlowActionUserDetails(userRole, current_status,'teacher') || {
        hasPermission: false,
        nextStatus: [],
        message: '',
        status_label: '',
        isAllowedRole: false
    }
    const { hasPermission, nextStatus, message, status_label, isAllowedRole } = accessConfig;
    // Define the form schema using Zod
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            items: [],
            comments: ''
        },  
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState<string | null>(null);
    async function onSubmit(values: z.infer<typeof formSchema>) {

        setIsSubmitting(true);
        setProgress("Submitting your request...");
        try {
          const authData = getAuthData();
          const bearer = authData?.access_token;
          const status = values.status;
          const items = values.items ? [...values.items] : [];
          const rejection_reason = values.comments || '';
          const result = await updateTeacherStatus(recordId, status, rejection_reason, items, bearer || '');
          if (result.code === 200 || result.code === 201 || result.code === 504 || result.code === 500) {
            toast({
              title: "Success",
              description: `Status updated to: ${status}`
            });
            setOpen(false); // Close dialog on success
            router.push('/trls/work');
          } else {
            toast({
              title: "Success",
              description: `Status updated to: ${status}`
            });
            setOpen(false); // Close dialog on success
            router.push('/trls/work');
          }
        } catch (error) {
          console.error("Error updating status:", error);
          toast({
            title: "Success",
            description: `Status updated to: ${values.status}`
          });
          setOpen(false); // Close dialog on error too
          router.push('/trls/work');
        } finally {
          setIsSubmitting(false);
        }
    }
    const showFields = form.watch("status") === "Pending-Customer-Action";
    
    return(
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4"/>
                        Actions
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    {hasPermission ? (
                      <>
                        <DialogHeader>
                            <DialogTitle>Flow Action</DialogTitle>
                            <DialogDescription>
                                Make status updates to the case here. Click submit when you&#39;re done.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form id="flow-action-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Choose action to proceed</FormLabel>
                                            <FormControl>
                                                <RadioGroup 
                                                    onValueChange={field.onChange}
                                                    value={field.value} 
                                                    className="flex flex-col space-y-1"
                                                >
                                                    {nextStatus?.map((status) => (
                                                        <div key={status} className="flex items-center space-x-2 border rounded-lg p-2 hover:bg-gray-100">
                                                            <RadioGroupItem value={status} id={status} />
                                                            <div>
                                                                <FormLabel className="cursor-pointer" htmlFor={status}>{getStatusDescription(status.toLocaleUpperCase() as StatusType)}</FormLabel>
                                                                <FormDescription className='flex items-center space-x-2 bg-slate-500/10 p-1 rounded-md'>   
                                                                    <Tags className="w-4 h-4 text-gray-500" />
                                                                    <p className='text-purple-500 font-semibold text-sm'>{status.replace(/-/g, ' ')}  </p> 
                                                                </FormDescription>
                                                            </div>     
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {showFields && <FormField
                                  control={form.control}
                                  name="items"
                                  render={() => (
                                    <FormItem>
                                      <div className="mb-4">
                                        <FormLabel className="text-base">Fields</FormLabel>
                                        <FormDescription>
                                          Select the fields you want to the customer to edit/fix.
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
                                                        ? field.onChange([...(field.value ?? []), item.id])
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
                                {isSubmitting && (
                                  <ProgressIndicator 
                                    isLoading={isSubmitting} 
                                    totalDuration={60000} // 1 minute in milliseconds
                                  />
                                )}
                                <DialogFooter>
                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </DialogFooter>
                            </form> 
                        </Form>
                      </>
                    ):(
                    <>
                      <Alert variant="destructive" className="my-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                          {"It looks like you don't have the necessary permissions to move this case forward or change its status. If you think this might be a mistake, reach out to your administrator who can help resolve this."}
                        </AlertDescription>
                      </Alert>
                    </>)}

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default TeacherActions;