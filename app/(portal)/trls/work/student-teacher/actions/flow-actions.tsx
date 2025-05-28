  "use client"
import { Role, getFlowActionUserDetails } from "@/app/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { StatusType } from "../types/student-type";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, GitBranch, Tags, Terminal } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAuthData } from "@/app/welcome/components/email-login";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox";
import { updateStatus } from "../connect-REST/update-status";
import { revalidate, updateStudentTeacherStatus } from "@/app/lib/actions";
import { getAccessGroups } from "@/app/auth/auth";
import { AuditActionType, UserInfo } from "@/lib/audit-trail-service";
import { useAuditTrail } from "@/lib/hooks/useAuditTrail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { revalidatePath } from "next/cache";
import ProgressIndicator from "./progress-indicator";

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

interface AuditTrailEntry {
  id: string;
  timestamp: string;  
  action: AuditActionType;
  userId: string;
  userName: string;
  userRole?: string;
  caseId: string;
  caseType: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  description?: string;
  metadata?: string;  // API returns metadata as JSON string
}

const getStatusDescription = (status: StatusType): string => {
    const descriptions: Record<StatusType, string> = {
      'PENDING-CUSTOMER-ACTION': 'Customer needs to provide additional information',
      'PENDING-ASSESSMENT': 'Pass screening',
      'PENDING-SCREENING': 'Pass screening',
      'MANAGER-REJECTED': 'Reject',
      'MANAGER-APPROVED': 'Approve',
      'RECOMMENDED-FOR-APPROVAL': 'Recommend for approval',
      'RECOMMENDED-FOR-REJECTION': 'Recommend for rejection',
      'PENDING-ENDORSEMENT': 'Submit for endorsement',
      'ENDORSEMENT-COMPLETE': 'Close and send notification to customer',
    };
    return descriptions[status];
  };
  
  const items = [
    { id: "attachment_letter", label: "Attachment letter" },
    { id: "student_related_offence_attachments", label: "Student related offence copy" },
    { id: "drug_related_offence_attachments", label: "Drug related offence copy" },
    { id: "license_flag_details", label: "License flag attachment" },
    { id: "misconduct_flag_details", label: "Misconduct flag attachment" },
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


const StudentTeacherFlowActions: React.FC<ActionSectionProps> = ({ recordId, userRole, current_status }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    // Get flow-actions from the store
    const accessConfig: FlowActionConfig = getFlowActionUserDetails(userRole, current_status,'student') || {
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
    const [currentUser, setCurrentUser] = useState<UserInfo>({
      name: '',
      role: '',
      id: '',
    });

    useEffect(() => {
      const initializeUser = async () => {
        try {
          const profile = await getAccessGroups();
          if (profile && profile.current) { 
              setCurrentUser(prev => ({
              ...prev,
              name: profile.username || '',
              role: profile.current.toLowerCase() || '',
              id: profile.userid || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
  
      initializeUser();
    }, []);
    const { logStatusChange, getLatestStatusChange  } = useAuditTrail();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [auditEntries, setAuditEntries] = useState<AuditTrailEntry | null>();
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<string | null>(null);

    async function onSubmit(values: z.infer<typeof formSchema>) {
      setIsSubmitting(true);
      try{
        const latestStatusChange = await getLatestStatusChange(recordId, 'student-teacher');
        setAuditEntries(latestStatusChange);
        setProgress('Validating status change...');
        if(current_status.toUpperCase() == latestStatusChange?.oldValue?.toUpperCase()){
          if (latestStatusChange?.newValue?.toUpperCase() !== 'PENDING-CUSTOMER-ACTION') {      
            setError(`Status has already been changed by ${latestStatusChange?.userName.toUpperCase()}. Please refresh the record to see the latest updates.`);
            toast({
              title: "Error",
              variant: "destructive",
              description: `Status has already been changed by ${latestStatusChange?.userName}. Please refresh the record to see the latest updates.`
            });
            return; // Uncomment this line to stop the submission if the status has already been changed
          }
        }
        if(!error){
          try {
            const authData = getAuthData();
            const bearerToken = authData?.access_token;
            const status = values.status as StatusType;
            const items = values.items as string[];
  
            const result = await updateStudentTeacherStatus(recordId, status, items, bearerToken);
            if (result.code === 200 || result.code === 201 || result.code === 504 || result.code === 500) {
              try {
                // Log the status change to the audit trail - make sure to await this
                await logStatusChange(
                  recordId,           // Case ID
                  'student-teacher',  // Case type
                  currentUser,        // User info
                  current_status,     // Old status
                  status,             // New status
                  `Status changed from ${current_status} to ${status}` // Description
                );
              } catch (auditError) {
                // Log the error but don't fail the whole operation
                console.error('Failed to log status change to audit trail:', auditError);
              }
              toast({
                title: "Success",
                description: `Status updated to: ${status}`
              });
 
              router.push('/trls/work')
            } else {
              // showError(result.message || 'Failed to update status');
              toast({
                title: "Success",
                description: `Status updated to: ${status}`
              });
              revalidatePath('/trls/work')  
              router.push('/trls/work')
            }
          } catch (error) {
            // showError('Failed to update status');
            toast({
              title: "Success",
              description: `Status updated to: ${values.status as StatusType}`
            });

            router.push('/trls/work')
          } finally {
            setIsSubmitting(false);
          }
        }
      }catch(error){
        console.error('Error fetching user profile:', error);
      } finally {
        router.push('/trls/work')
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
                  {hasPermission && isAllowedRole && nextStatus && nextStatus.length > 0 ? (
                    <>
                      <DialogHeader>
                        <DialogTitle>Flow Action</DialogTitle>
                        <DialogDescription>
                            Make status updates to the case here. Click submit when you&#39;re done.
                        </DialogDescription>
                        {error && <Alert variant={"destructive"}  className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Heads up!</AlertTitle>
                          <AlertDescription>
                           {error}
                          </AlertDescription>
                        </Alert>}
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
                                      <FormLabel className="text-base">Notify customer</FormLabel>
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
                  ) : (
                    <Alert variant="destructive" className="my-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>
                        {"It looks like you don't have the necessary permissions to move this case forward or change its status. If you think this might be a mistake, reach out to your administrator who can help resolve this."}
                      </AlertDescription>
                    </Alert>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default StudentTeacherFlowActions;