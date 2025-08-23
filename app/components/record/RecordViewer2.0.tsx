'use client'
import React, { useState } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaFilePdf } from 'react-icons/fa';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { statusTransitions } from '@/app/lib/store';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from 'next/navigation';
import { ReturnToCustomer, UpdateEndorsementStatus, UpdateStatus } from '@/app/lib/actions';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from '@/components/ui/textarea';

import { Info, FileCheck,  File, Briefcase, School, AlertTriangle, UserCircle, GraduationCap } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import InfoCard from '../InfoCard';
import InfoItem from '../InfoItem';
import { getAuthData } from '@/app/staff/login/components/email-login';


interface TeacherRegistration {
    national_id?: string | null;
    reg_number?: string | null;
    reg_status?: string | null;
    endorsement_status?: string;
    rejection_reason?: string | null;
    service_code?: string | null;
    payment_ref?: string | null;
    payment_amount?: string | null;
    payment_name?: string | null;
    application_id?: string | null;
    license_link?: string | null;
    education_bg_checks?: string | null;
    flags_no?: string | null;
    institution_verification?: string | null;
    course_verification?: string | null;
    license_status?: string | null;
    pending_customer_action?: string | null;
    registration_type?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}
  
interface TeacherPreliminaryInfo {
    id?: number | null;
    national_id?: string | null;
    citizen_status?: string | null;
    work_status?: string | null;
    practice_category?: string | null;
    sub_category?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    minor_subjects?: string | null;
    major_subjects?: string | null;
}
  
interface EduProQualification {
    id?: number | null;
    national_id?: string | null;
    level?: string | null;
    qualification?: string | null;
    institution?: string | null;
    attachments?: string | null;
    qualification_year?: string | null;
    minor_subjects?: string | null;
    major_subjects?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}
  
interface BioData {
    id?: number | null;
    national_id?: string | null;
    surname?: string | null;
    forenames?: string | null;
    dob?: string | null;
    pob?: string | null;
    gender?: string | null;
    nationality?: string | null;
    postal_address?: string | null;
    physical_address?: string | null;
    email?: string | null;
    mobile?: string;
    marital_status?: string | null;
    next_of_kin_name?: string | null;
    next_of_kin_relation?: string | null;
    next_of_kin_contact?: string | null;
    disability?: string | null;
    disability_description?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}
  
interface Declaration {
    id?: number | null;
    national_id?: string | null;
    agreement?: string | null;
    signature?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}
  
interface OffenceConviction {
    id?: number | null;
    national_id?: string | null;
    student_related_offence?: string | null;
    student_related_offence_details?: string | null;
    drug_related_offence?: string | null;
    drug_related_offence_details?: string | null;
    license_flag?: string | null;
    license_flag_details?: string | null;
    misconduct_flag?: string | null;
    misconduct_flag_details?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

interface EmploymentDetail {
    id: number | null;
    national_id: string | null;
    experience_years: number | null;
    experience_months: number | null;
    current_institution: string | null;
    institution_type: string | null;
    region: string | null;
    district: string | null;
    city_or_town: string | null;
    created_at: string | null;
    updated_at: string | null;
}

interface BackgroundChecks{
      id?: number | null,
      national_id?: string | null,
      name?: string | null,
      description?: string | null,
      checked_by?: string | null,
      created_at?: string | null,
      updated_at?: string | null
}

interface Attachment {
    national_id?: string | null;
    national_id_copy?: string | null;
    qualification_copy?: string | null;
    proof_of_payment?: string | null;
    created_at?: string | null
    updated_at?: string | null;
}
  
export interface TeacherRegistrationData {
    teacher_registrations?: TeacherRegistration;
    teacher_preliminary_infos?: TeacherPreliminaryInfo;
    edu_pro_qualifications?: EduProQualification;
    other_qualifications?: EduProQualification[];
    bio_datas?: BioData;
    background_checks?: BackgroundChecks[];
    declarations?: Declaration;
    offence_convictions?: OffenceConviction;
    employment_details?: EmploymentDetail;
    attachments?: Attachment;
}

interface TeacherRegistrationViewProps {
  data: TeacherRegistrationData;
}

const PDFViewer: React.FC<{ url: string }> = ({ url }) => (
    <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`} width="100%" height="500px" />
);
  
export const getNextStatus = (userRole: string): { prev_status: string | null; inv_status: string | null; bar_status: string | null; rej_status: string | null; next_status: string | null; recommend: string | null; endorse: string | null;        reject_label: string | null;
    approve_label: string | null;
    recommend_label: string | null;
    endorse_label: string | null; } => {
    const statusTransition = statusTransitions[userRole.toLowerCase()] || statusTransitions['Default'];
    return statusTransition;
};

interface TeacherRegistrationViewProps {
    data: TeacherRegistrationData;
    userRole: string;
  }
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
  
  const FormSchema = z.object({
    status: z.string({
      required_error: 'Please select rejection type.',
    }),
    evidence: z.any().optional(),
    items: z.array(z.string().optional()),
    rejection_reason: z.string().optional()
  });
  const TeacherRegistrationViewer: React.FC<TeacherRegistrationViewProps> = ({ data, userRole }) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();
  
    const { prev_status, next_status, rej_status, bar_status, inv_status, recommend, endorse, approve_label, reject_label, recommend_label, endorse_label } = getNextStatus(userRole);

    const handleStatusChange = async (id: string, status: string, rejection_reason: string) => {
      const authData = getAuthData();
      const bearerToken = authData?.access_token;
      if (status) {
        const res = await UpdateStatus(id, status, rejection_reason, bearerToken || '');
  
        router.prefetch('/trls/registration');
        if (res === 200 || res === 201 || res=== 504 || res === 500) {
          toast({
            title: "Success",
            description: `Status updated to: ${status}`
          });
          router.push('/trls/work')
        } else {
          toast({
            title: "Success",
            description: `Status updated to: ${status}`
          });
          router.push('/trls/work')
        }
        // if (res !== 201) {
        //   toast({
        //     title: "Failed!!!",
        //     description: "Something went wrong",
        //     action: (
        //       <ToastAction altText="Ok">Ok</ToastAction>
        //     ),
        //   });
        // } else {
        //   toast({
        //     title: "Routed successfully",
        //     description: "The record has been routed with the status: " + status,
        //     action: (
        //       <ToastAction altText="Ok">Ok</ToastAction>
        //     ),
        //   });
        //   router.push('/trls/registration');
        // }
      } else {
        toast({
          title: "Failed!!!",
          description: "Next status cannot be undefined/null",
          action: (
            <ToastAction altText="Ok">Ok</ToastAction>
          ),
        });
      }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [],
        }
      });
    const status = form.watch("status"); // watch status changes, for validations and ...
    const evidence = form.watch('evidence')
    const rejection_reason = form.watch('rejection_reason')

    const onSubmit = async (record: z.infer<typeof FormSchema>) => {
        if (record.status === prev_status && prev_status === 'Pending-Customer-Action') {
          // Only validate items if returning to customer
          if (record.items.length === 0) {
            form.setError('items', {
              type: 'manual',
              message: 'You have to select at least one item when returning to customer.'
            });
            return;
          }

        const authData = getAuthData();
        const bearerToken = authData?.access_token;
        if(data?.teacher_registrations?.national_id && record.items){
            const res = await ReturnToCustomer(data.teacher_registrations.national_id, record.status, record.items, bearerToken || '');

            if(res == 200 || res == 201){ // (200 || 201) test this next time, backend keeps changing the codes
              toast({
                title: "Routed successfully",
                description: "The record has been routed with the status: " + record.status,
                action: <ToastAction altText="Ok">Ok</ToastAction>,
              });
              router.push('/trls/work');
            } else {
              toast({
                title: "Failed!!!",
                description: "Something went wrong",
                action: <ToastAction altText="Ok">Ok</ToastAction>,
              });
            }
          }
        }else if(data?.teacher_registrations?.national_id){
          if(record.status === rej_status && (rej_status === 'Recommended-For-Rejection') || (rej_status === 'Manager-Rejected')){
            // Only validate items if rejecting
            if (record?.rejection_reason === undefined) {
              form.setError('rejection_reason', {
                type: 'manual',
                message: 'Reason is required.'
              });
              return;
            }
          }
          const authData = getAuthData();
          const bearerToken = authData?.access_token;
          const res = await UpdateStatus(data.teacher_registrations.national_id, record.status, record?.rejection_reason || '', bearerToken || '');
      
          if(res == 201 || res == 200){
            toast({
              title: "Routed successfully",
              description: "The record has been routed with the status: " + record.status,
              action: <ToastAction altText="Ok">Ok</ToastAction>,
            });
            router.push('/trls/work');
          } else {
            toast({
              title: "Failed!!!",
              description: "Something went wrong",
              action: <ToastAction altText="Ok">Ok</ToastAction>,
            });
          }
        }
    };

    const handleEndorsementStatusUpdate = async (id: string, status: string) => {
      if (status) {
        const authData = getAuthData();
        const bearerToken = authData?.access_token;
        const res = await UpdateEndorsementStatus(id, status, bearerToken || '');
        
        router.prefetch('/trls/work');
        if (res !== 201) {
          toast({
            title: "Failed!!!",
            description: "Something went wrong",
            action: (
              <ToastAction altText="Ok">Ok</ToastAction>
            ),
          });
        } else {
          toast({
            title: "Routed successfully",
            description: "The record has been routed with the status: " + status,
            action: (
              <ToastAction altText="Ok">Ok</ToastAction>
            ),
          });
          router.push('/trls/work');
        }
      } else {
        toast({
          title: "Failed!!!",
          description: "Next status cannot be undefined/null",
          action: (
            <ToastAction altText="Ok">Ok</ToastAction>
          ),
        });
      }
    };
  
    const renderPersonalInfo = () => (
      <InfoCard title='Personal Information' icon={<UserCircle className="w-6 h-6 text-blue-500"/>}>
        <InfoItem label="Name" value={`${data?.bio_datas?.forenames} ${data?.bio_datas?.surname}`} />
        <InfoItem label="National ID" value={data?.bio_datas?.national_id ?? ''} />
        <InfoItem label="Date of Birth" isDate value={data?.bio_datas?.dob} />
        <InfoItem label="Gender" value={data?.bio_datas?.gender ?? ''} />
        <InfoItem label="Nationality" value={data?.bio_datas?.nationality ?? ''} />
        <InfoItem label="Email" value={data?.bio_datas?.email ?? ''} />
        <InfoItem label="Mobile" value={data?.bio_datas?.mobile ?? ''} />
      </InfoCard>
    );

    const getLicenseStatus = () => {
        const isManagerApproved = data?.teacher_registrations?.reg_status === 'Manager-Approved';
        const isEndorsementComplete = data.teacher_registrations?.endorsement_status === 'Endorsement-Complete'
        const hasPayment = data.teacher_registrations?.payment_amount != null;

        return isManagerApproved && isEndorsementComplete && hasPayment ? 'Valid' : 'Invalid';
    }

    const isEndorsementComplete = () => {
      return data.teacher_registrations?.endorsement_status === 'Endorsement-Complete';
    }
  
    const renderCaseDetails = () => ( 
      <InfoCard title='Case Information' icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
        <InfoItem label="Registration Type" value={data?.teacher_registrations?.registration_type ?? ''} />
        <InfoItem label="Application ID" value={data?.teacher_registrations?.application_id ?? ''} />
        <InfoItem label="Registration Status" value={data?.teacher_registrations?.reg_status ?? ''} />
        <InfoItem label="Payment" value={data?.teacher_registrations?.payment_name ?? ''} />
        <InfoItem label="Amount" value={data?.teacher_registrations?.payment_amount ?? ''} />
        <InfoItem label="Payment Reference" value={data?.teacher_registrations?.payment_ref ?? ''} />
        <InfoItem label="Service Code" value={data?.teacher_registrations?.service_code ?? ''} />
        <InfoItem label="Endorsement Status" value={data?.teacher_registrations?.endorsement_status ?? ''} />
        <InfoItem label='SLA' value={data?.teacher_registrations?.created_at} isSLA/>
        <InfoItem label="Institution Verification" value={data?.teacher_registrations?.institution_verification ?? ''} />
        <InfoItem label="Course Verification" value={data?.teacher_registrations?.course_verification ?? ''} />
        {isEndorsementComplete() && <InfoItem label='License Status' value={getLicenseStatus()} isLicenseStatus/>}
      </InfoCard>
    );
  
    const renderQualifications = () => (
    <InfoCard title='Qualifications' icon={<School className="w-6 h-6 text-blue-500"/>} columns={1}>
        {data?.other_qualifications && data.other_qualifications.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Attachment</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Subjects</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.other_qualifications.map((qual, index) => (
                <TableRow key={index}>
                  <TableCell>{qual.level ?? '-'}</TableCell>
                  <TableCell>{qual.qualification ?? '-'}</TableCell>
                  <TableCell>
                    {qual.attachments ? (
                      <InfoItem label="" value={qual.attachments}/>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{qual.institution ?? '-'}</TableCell>
                  <TableCell>{qual.qualification_year ?? '-'}</TableCell>
                  <TableCell>{qual.major_subjects ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          No qualifications data available
        </div>
      )}
    </InfoCard>
    );

    const renderMandatoryQualifications = () => (
      <InfoCard 
        title='Mandatory Qualification' 
        icon={<GraduationCap className="w-6 h-6 text-blue-500"/>}
        columns={1}
      >
        {data?.edu_pro_qualifications ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Major Subjects</TableHead>
                <TableHead>Attachment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{data.edu_pro_qualifications.level ?? '-'}</TableCell>
                <TableCell>{data.edu_pro_qualifications.qualification ?? '-'}</TableCell>
                <TableCell>{data.edu_pro_qualifications.institution ?? '-'}</TableCell>
                <TableCell>{data.edu_pro_qualifications.qualification_year ?? '-'}</TableCell>
                <TableCell>{data.edu_pro_qualifications.major_subjects ?? '-'}</TableCell>
                <TableCell>
                  <InfoItem label='' value={data.edu_pro_qualifications?.attachments ?? ''}/>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center p-4 text-muted-foreground">
            No mandatory qualification data available
          </div>
        )}
      </InfoCard>
    );
    const renderEmployment = () => (
      <InfoCard title='Employment Information' icon={<Briefcase className="w-6 h-6 text-blue-500"/>}>
        <InfoItem label="Current Institution" value={data?.employment_details?.current_institution ?? ''} />
        <InfoItem label="Institution Type" value={data?.employment_details?.institution_type ?? ''} />
        <InfoItem label="Region" value={data?.employment_details?.region ?? ''} />
        <InfoItem label="District" value={data?.employment_details?.district ?? ''} />
        <InfoItem label="City/Town" value={data?.employment_details?.city_or_town ?? ''} />
        <InfoItem label="Years of Experience" value={data?.employment_details?.experience_years?.toString() ?? ''} />
      </InfoCard>
    );
  
    const renderBackgroundChecks = () => (
      <InfoCard title='Background Checks' icon={<AlertTriangle className="w-6 h-6 text-blue-500"/>} columns={1}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Checked By</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.background_checks?.map((check, index) => (
              <TableRow key={index}>
                <TableCell>{check.name}</TableCell>
                <TableCell>{check.description}</TableCell>
                <TableCell>{check.checked_by}</TableCell>
                <TableCell>{new Date(check.created_at || '').toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </InfoCard>
    );
    const renderDocuments = () => (
      <InfoCard title='Attachments' icon={<File className="w-6 h-6 text-blue-500"/>} columns={2}>
        <InfoItem label="National ID Copy" value={data.attachments?.national_id_copy ?? ''}/>
        <InfoItem label="Qualification Documents" value={data.attachments?.qualification_copy ?? ''}/>
        <InfoItem label="Proof of Payment" value={data.attachments?.proof_of_payment ?? ''}/>
      </InfoCard>
    );
  
    return (
      <div className="container mx-auto px-4 py-8">
          <div className="mb-4 flex-shrink-0 shadow-md">
            <h1 className="text-3xl font-bold mb-8">Teacher Registration Request</h1>
            <div className="mt-2 h-1 w-full bg-blue-400 rounded-full"></div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
            {renderCaseDetails()}
            {renderPersonalInfo()}
            {renderMandatoryQualifications()}
            {renderQualifications()}
            {renderEmployment()}
            {renderBackgroundChecks()}
            {renderDocuments()}
          <div className="mt-8 space-x-4 flex justify-end">
          {(prev_status || inv_status || bar_status || rej_status) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">{reject_label}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              </AlertDialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                              {prev_status && (
                                <SelectItem value={prev_status}>
                                  {prev_status === 'Pending-Screening' ? 'Return to reg-officer' : 'Return to customer'}
                                </SelectItem>
                              )}
                              {inv_status && <SelectItem value={inv_status}>Investigations</SelectItem>}
                              {rej_status && <SelectItem value={rej_status}>Rejected</SelectItem>}
                              {bar_status && <SelectItem value={bar_status}>Barred</SelectItem>}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {status === rej_status && (
                    <FormField
                      control={form.control}
                      name="rejection_reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Enter rejection reason'
                              className='resize-none'
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                              You can <span>@mention</span> other users and organizations.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {status === bar_status && (
                    <FormField
                      control={form.control}
                      name="evidence"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Attach supporting evidence</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="application/pdf"
                              placeholder="Attach a file"
                              onChange={(event) => field.onChange(event.target?.files?.[0] ?? undefined)}
                            />
                          </FormControl>
                          <FormDescription>
                            Max File Size: 5MB Accepted File Types: .pdf
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {status === prev_status && prev_status !== 'Pending-Screening' && (
                    <FormField
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
                                            checked={field.value?.includes(item.id) ?? false}
                                            onCheckedChange={(checked) => {
                                            const updatedValue = field.value ?? [];
                                            if (checked) {
                                                field.onChange([...updatedValue, item.id]);
                                            } else {
                                                field.onChange(updatedValue.filter((value) => value !== item.id));
                                            }
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
                    />
                  )}
                  {status === prev_status && prev_status !== 'Pending-Screening' && (
                    <FormField
                      control={form.control}
                      name="rejection_reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Enter rejection reason'
                              className='resize-none'
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                              You can <span>@mention</span> other users and organizations.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <AlertDialogFooter className='w-full items-end justify-end'>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button type='submit'>Submit</Button>
                  </AlertDialogFooter>
                </form>
              </Form>
            </AlertDialogContent>
            </AlertDialog>
          )}
          {next_status && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default">{approve_label}</Button>
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
                    onClick={() => handleStatusChange(data?.teacher_registrations?.national_id || '', next_status, rejection_reason || '')}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {recommend && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">{recommend_label}</Button>
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
                    onClick={() => handleEndorsementStatusUpdate(data?.teacher_registrations?.national_id || '', recommend)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {endorse && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default">{endorse_label}</Button>
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
                    onClick={() => handleEndorsementStatusUpdate(data?.teacher_registrations?.national_id || '', endorse)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
  
        <Dialog open={!!pdfUrl} onOpenChange={() => setPdfUrl(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Document Viewer</DialogTitle>
            </DialogHeader>
            <div className="mt-4 h-[70vh]">
              <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl || '')}&embedded=true`} width="100%" height="100%" />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </div>
    );
  };
  
export default TeacherRegistrationViewer;