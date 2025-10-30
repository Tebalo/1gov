"use client"
import { Role, getFlowActionUserDetails } from "@/app/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { StatusType } from "../types/teacher-type";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ChevronDown, GitBranch, Tags } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAuthData } from "@/app/staff/login/components/email-login";
import { updateTeacherStatus } from "../api/update-status";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ProgressIndicator from "../../student-teacher/actions/progress-indicator";
import { useAuditTrail } from "@/lib/hooks/useAuditTrail";
import { AuditActionType, UserInfo } from "@/lib/audit-trail-service";
import { getAccessGroups } from "@/app/auth/auth";
import { generateAndUploadTeacherLicenseQR } from "./generate-and-upload-QR";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
      'PENDING-ASSESSMENT': 'Pass Screening',
      'PENDING-SCREENING': 'Pass Screening',
      'MANAGER-REJECTED': 'Reject and forward to Director',
      'MANAGER-APPROVED': 'Approve and send notification to Customer',
      'RECOMMENDED-FOR-APPROVAL': 'Recommend for Approval',
      'RECOMMENDED-FOR-REJECTION': 'Recommend for Rejection',
      'PENDING-ENDORSEMENT': 'Submit for Endorsement',
      'ENDORSEMENT-COMPLETE': 'Close and send notification to Customer',
    };
    return descriptions[status];
  };
  
  // const items = [
  //   { id: "national_id_copy", label: "National ID attachment", category:""},
  //   { id: "misconduct_flag_details", label: "Misconduct flag attachment" },
  //   { id: "student_related_offence_attachments", label: "Student related offence attachment" },
  //   { id: "drug_related_offence_attachments", label: "Drug related offence attachment" },
  //   { id: "license_flag_details", label: "Licence flag attachment" },
  //   { id: "attachments", label: "Mandatory qualification attachment" },
  //   { id: "alt_attachments", label: "Additional qualification attachment" },
  // ] as const;
const items = [
  // Bio Data / Personal Information
  { id: "surname", label: "Surname", category: "bio_data" },
  { id: "forenames", label: "Forenames", category: "bio_data" },
  { id: "dob", label: "Date of Birth", category: "bio_data" },
  { id: "pob", label: "Place of Birth", category: "bio_data" },
  { id: "gender", label: "Gender", category: "bio_data" },
  { id: "nationality", label: "Nationality", category: "bio_data" },
  { id: "postal_address", label: "Postal Address", category: "bio_data" },
  { id: "physical_address", label: "Physical Address", category: "bio_data" },
  { id: "email", label: "Email Address", category: "bio_data" },
  { id: "mobile", label: "Mobile Number", category: "bio_data" },
  { id: "marital_status", label: "Marital Status", category: "bio_data" },
  // { id: "next_of_kin_name", label: "Next of Kin Name", category: "bio_data" },
  // { id: "next_of_kin_relation", label: "Next of Kin Relation", category: "bio_data" },
  // { id: "next_of_kin_contact", label: "Next of Kin Contact", category: "bio_data" },
  { id: "disability", label: "Disability Status", category: "bio_data" },
  { id: "disability_description", label: "Disability Description", category: "bio_data" },
  
  // Teacher Preliminary Information
  { id: "citizen_status", label: "Citizen Status", category: "preliminary_info" },
  { id: "practice_category", label: "Practice Category", category: "preliminary_info" },
  { id: "sub_category", label: "Sub Category", category: "preliminary_info" },
  
  // Educational Professional Qualifications
  { id: "edu_pro_level", label: "Educational Professional Level", category: "edu_pro_qualifications" },
  { id: "edu_pro_qualification", label: "Educational Professional Qualification", category: "edu_pro_qualifications" },
  { id: "edu_pro_institution", label: "Educational Professional Institution", category: "edu_pro_qualifications" },
  { id: "edu_pro_qualification_year", label: "Educational Professional Qualification Year", category: "edu_pro_qualifications" },
  { id: "edu_pro_minor_subjects", label: "Educational Professional Minor Subjects", category: "edu_pro_qualifications" },
  { id: "edu_pro_major_subjects", label: "Educational Professional Major Subjects", category: "edu_pro_qualifications" },
  { id: "edu_pro_subjects", label: "Educational Professional Subjects", category: "edu_pro_qualifications" },
  
  // Other Qualifications
  { id: "other_level", label: "Other Qualification Level", category: "other_qualifications" },
  { id: "other_qualification", label: "Other Qualification", category: "other_qualifications" },
  { id: "other_institution", label: "Other Qualification Institution", category: "other_qualifications" },
  { id: "other_qualification_year", label: "Other Qualification Year", category: "other_qualifications" },
  { id: "other_minor_subjects", label: "Other Minor Subjects", category: "other_qualifications" },
  { id: "other_major_subjects", label: "Other Major Subjects", category: "other_qualifications" },
  
  // Declarations
  { id: "agreement", label: "Agreement", category: "declarations" },
  { id: "signature", label: "Signature", category: "declarations" },
  
  // Offence Convictions
  { id: "student_related_offence", label: "Student Related Offence", category: "offence_convictions" },
  { id: "student_related_offence_details", label: "Student Related Offence Details", category: "offence_convictions" },
  { id: "drug_related_offence", label: "Drug Related Offence", category: "offence_convictions" },
  { id: "drug_related_offence_details", label: "Drug Related Offence Details", category: "offence_convictions" },
  { id: "license_flag", label: "License Flag", category: "offence_convictions" },
  { id: "license_flag_details", label: "License Flag Details", category: "offence_convictions" },
  { id: "misconduct_flag", label: "Misconduct Flag", category: "offence_convictions" },
  { id: "misconduct_flag_details", label: "Misconduct Flag Details", category: "offence_convictions" },
  
  // Employment Details
  { id: "experience_years", label: "Years of Experience", category: "employment_details" },
  { id: "current_institution", label: "Current Institution", category: "employment_details" },
  { id: "institution_type", label: "Institution Type", category: "employment_details" },
  { id: "region", label: "Region", category: "employment_details" },
  { id: "city_or_town", label: "City or Town", category: "employment_details" },
  
  // Attachments/Documents
  { id: "national_id_copy", label: "National ID Copy", category: "attachments" },
  { id: "qualification_copy", label: "Qualification Copy", category: "attachments" },
  { id: "work_permit", label: "Work Permit", category: "attachments" },
  { id: "proof_of_payment", label: "Proof of Payment", category: "attachments" },
  { id: "invoice", label: "Invoice", category: "attachments" },
  { id: "student_related_offence_attachments", label: "Student Related Offence Attachments", category: "attachments" },
  { id: "drug_related_offence_attachments", label: "Drug Related Offence Attachments", category: "attachments" },
  { id: "edu_pro_attachments", label: "Educational Professional Qualification Attachments", category: "attachments" },
  { id: "other_attachments", label: "Other Qualification Attachments", category: "attachments" },
  
  // System Fields
  { id: "national_id", label: "National ID", category: "system" },
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
    const { logStatusChange, getLatestStatusChange  } = useAuditTrail();
    const [currentUser, setCurrentUser] = useState<UserInfo>({
      name: '',
      role: '',
      id: '',
    });
    const [auditEntries, setAuditEntries] = useState<AuditTrailEntry | null>();
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
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let uploadResult
        setIsSubmitting(true);
        setProgress("Submitting...");
        try {
          const latestStatusChange = await getLatestStatusChange(recordId, 'teacher');
          setAuditEntries(latestStatusChange);
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
          if(values.status == "Endorsement-Complete"){
            setProgress("Generating QR Code...");
            // Generate QR-CODE
            // const qrResult = await generateTeacherLicenseQR(recordId)
            uploadResult = await generateAndUploadTeacherLicenseQR(recordId)
          }
    
          if(!error){
            if(values.status == "Endorsement-Complete"){
              setProgress("Generating teacher license...");
            }
            const authData = getAuthData();
            const bearer = authData?.access_token;
            const status = values.status;
            const items = values.items ? [...values.items] : [];
            const rejection_reason = values.comments || '';
            const result = await updateTeacherStatus(recordId, status, rejection_reason, items, bearer || '', uploadResult?.uploadResponse?.key);
            if (result.code === 200 || result.code === 201) {
              toast({
                title: "Success",
                description: `Status updated to: ${status}`
              });
              await logStatusChange(
                recordId,           // Case ID
                'teacher',  // Case type
                currentUser,        // User info
                current_status,     // Old status
                status,             // New status
                `Status changed from ${current_status} to ${status}` // Description
              )
              setOpen(false); // Close dialog on success
              router.push('/trls/work');
            } 
          }
        } catch (error) {
          console.error("Error updating status:", error);
          toast({
            title: "Failed to update status",
            description: `${(error as Error).message || 'An unexpected error occurred.'}`,
            variant: "destructive",
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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
              {hasPermission && isAllowedRole && nextStatus && nextStatus.length > 0 ? (
                <>
                  <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Flow Action</DialogTitle>
                    <DialogDescription>
                      Make status updates to the case here. Click submit when you&lsquo;re done.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex-1 overflow-hidden">
                    <Form {...form}>
                      <form id="flow-action-form" onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
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
                                          <FormLabel className="cursor-pointer" htmlFor={status}>
                                            {getStatusDescription(status.toLocaleUpperCase() as StatusType)}
                                          </FormLabel>
                                          <FormDescription className='flex items-center space-x-2 bg-slate-500/10 p-1 rounded-md'>   
                                            <Tags className="w-4 h-4 text-gray-500" />
                                            <p className='text-purple-500 font-semibold text-sm'>
                                              {status.replace(/-/g, ' ')}
                                            </p> 
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
                          
                          {showFields && (
                            <FormField
                              control={form.control}
                              name="items"
                              render={() => (
                                <FormItem>
                                  <div className="mb-4">
                                    <FormLabel className="text-base">Fields</FormLabel>
                                    <FormDescription>
                                      Select the fields you want the customer to edit/fix.
                                    </FormDescription>
                                  </div>
                                  
                                  {/* Scrollable container for the accordion */}
                                  <div className="max-h-[300px] overflow-y-auto border rounded-md">
                                    <Accordion type="multiple" className="w-full">
                                      {Object.entries(
                                        items.reduce((acc, item) => {
                                          const category = item.category;
                                          if (!acc[category]) {
                                            acc[category] = [];
                                          }
                                          acc[category].push(item);
                                          return acc;
                                        }, {} as Record<string, Array<typeof items[number]>>)
                                      ).map(([category, categoryItems]) => (
                                        <AccordionItem key={category} value={category} className="px-4">
                                          <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                            <div className="flex items-center justify-between w-full">
                                              <span className="capitalize">{category.replace(/_/g, ' ')}</span>
                                              <span className="ml-2 text-xs text-muted-foreground">
                                                ({categoryItems.length} fields)
                                              </span>
                                            </div>
                                          </AccordionTrigger>
                                          <AccordionContent className="pt-2 pb-4">
                                            <div className="space-y-3">
                                              {categoryItems.map((item) => (
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
                                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                                          {item.label}
                                                        </FormLabel>
                                                      </FormItem>
                                                    )
                                                  }}
                                                />
                                              ))}
                                            </div>
                                          </AccordionContent>
                                        </AccordionItem>
                                      ))}
                                    </Accordion>
                                  </div>
                                  
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                        
                        {/* Fixed footer section */}
                        <div className="flex-shrink-0 pt-4 border-t">
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
                              {isSubmitting ? progress : 'Submit'}
                            </Button>
                          </DialogFooter>
                        </div>
                      </form> 
                    </Form>
                  </div>
                </>
              ) : (
                <>
                  <Alert variant="destructive" className="my-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                      {"It looks like you don't have the necessary permissions to move this case forward or change its status. If you think this might be a mistake, reach out to your administrator who can help resolve this."}
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
    )
}

export default TeacherActions;