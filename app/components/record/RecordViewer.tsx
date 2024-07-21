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
import { UpdateEndorsementStatus, UpdateStatus } from '@/app/lib/actions';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface TeacherRegistration {
    national_id: string;
    reg_number: string;
    reg_status: string;
    endorsement_status: string;
    rejection_reason: string | null;
    payment_ref: string;
    payment_amount: string;
    payment_name: string;
    application_id: string;
    license_link: string;
    license_status: string;
    pending_customer_action: string;
    registration_type: string;
    created_at: string;
    updated_at: string;
}
  
interface TeacherPreliminaryInfo {
    id: number;
    national_id: string;
    citizen_status: string;
    work_status: string | null;
    practice_category: string;
    sub_category: string;
    created_at: string;
    updated_at: string;
    minor_subjects: string;
    major_subjects: string;
}
  
interface EduProQualification {
    id: number;
    national_id: string;
    level: string;
    qualification: string;
    institution: string;
    attachments: string;
    qualification_year: string;
    minor_subjects: string;
    major_subjects: string;
    created_at: string;
    updated_at: string;
}
  
interface BioData {
    id: number;
    national_id: string;
    surname: string;
    forenames: string;
    dob: string;
    pob: string | null;
    gender: string;
    nationality: string;
    postal_address: string;
    physical_address: string;
    email: string;
    mobile: string;
    marital_status: string | null;
    next_of_kin_name: string;
    next_of_kin_relation: string;
    next_of_kin_contact: string;
    disability: string;
    disability_description: string;
    created_at: string;
    updated_at: string;
}
  
interface Declaration {
    id: number;
    national_id: string;
    agreement: string;
    signature: string | null;
    created_at: string;
    updated_at: string;
}
  
interface OffenceConviction {
    id: number;
    national_id: string;
    student_related_offence: string;
    student_related_offence_details: string | null;
    drug_related_offence: string;
    drug_related_offence_details: string | null;
    license_flag: string;
    license_flag_details: string | null;
    misconduct_flag: string;
    misconduct_flag_details: string | null;
    created_at: string;
    updated_at: string;
}

interface EmploymentDetail {
    id: number;
    national_id: string;
    experience_years: number;
    current_institution: string;
    institution_type: string;
    region: string;
    district: string;
    city_or_town: string;
    created_at: string;
    updated_at: string;
}

interface Attachment {
    national_id: string;
    national_id_copy: string;
    qualification_copy: string | null;
    proof_of_payment: string | null;
    created_at: string;
    updated_at: string;
}
  
interface TeacherRegistrationData {
    teacher_registrations: TeacherRegistration;
    teacher_preliminary_infos: TeacherPreliminaryInfo;
    edu_pro_qualifications: EduProQualification[];
    bio_datas: BioData;
    declarations: Declaration;
    offence_convictions: OffenceConviction;
    employment_details: EmploymentDetail;
    attachments: Attachment;
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
    { id: "national_id_copy", label: "National ID" },
    { id: "qualification_copy", label: "Qualification copy" },
    { id: "proof_of_payment", label: "Proof of payment" },
    { id: "attachments", label: "Qualifications attachment" },
    { id: "attachment", label: "Recommendation attachment" },
  ] as const;
  
  const FormSchema = z.object({
    status: z.string({
      required_error: 'Please select rejection type.',
    }),
    evidence: z.any().optional(),
    items: z.array(z.string().optional())
  });
  const TeacherRegistrationView: React.FC<TeacherRegistrationViewProps> = ({ data, userRole }) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();
  
    const { prev_status, next_status, rej_status, bar_status, inv_status, recommend, endorse, approve_label, reject_label, recommend_label, endorse_label } = getNextStatus(userRole);
  
    const handleStatusChange = async (id: string, status: string) => {
      if (status) {
        const res = await UpdateStatus(id, status);
  
        router.prefetch('/trls/home');
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
          router.push('/trls/home');
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

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [],
        }
      });
    const status = form.watch("status"); // watch status changes, for validations and ...
    const evidence = form.watch('evidence')
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
          }
        const res = await UpdateStatus(data.teacher_registrations.national_id, record.status);
        if(!res){
          toast({
            title: "Failed!!!",
            description: "Something went wrong",
            action: <ToastAction altText="Ok">Ok</ToastAction>,
          });
        } else {
          toast({
            title: "Routed successfully",
            description: "The record has been routed with the status: " + record.status,
            action: <ToastAction altText="Ok">Ok</ToastAction>,
          });
          router.push('/trls/work');
        }
      };

    const handleEndorsementStatusUpdate = async (id: string, status: string) => {
      if (status) {
        const res = await UpdateEndorsementStatus(id, status);
        console.log("status",res)
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
  
    const renderSection = (title: string, content: React.ReactNode) => (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        {content}
      </div>
    );
  
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Applicants ID: {data.teacher_preliminary_infos.national_id}</h1>
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {renderSection("Case Details", renderCaseDetails(data))}
          <Separator/>
          {renderSection("Personal Information", renderPersonalInfo(data))}
          <Separator/>
          {renderSection("Qualifications", renderQualifications(data, setPdfUrl))}
          <Separator/>
          {renderSection("Employment", renderEmployment(data))}
          <Separator/>
          {renderSection("Documents/Licenses", renderDocuments(data, setPdfUrl))}
          <Separator/>
          {renderSection("Offences", renderOffences(data, setPdfUrl))}
          <Separator/>
          {renderSection("Declaration", renderDeclaration(data))}
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
                    onClick={() => handleStatusChange(data.teacher_registrations.national_id, next_status)}
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
                    onClick={() => handleEndorsementStatusUpdate(data.teacher_registrations.national_id, recommend)}
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
                    onClick={() => handleEndorsementStatusUpdate(data.teacher_registrations.national_id, endorse)}
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
  
  
  const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className=" flex items-center justify-normal space-x-2">
      <Label className="font-semibold text-gray-700">{label}:</Label> 
      <span className="text-sm text-gray-600">{value}</span>
    </div>
  );
  
  const DocumentItem: React.FC<{ label: string; url: string | null; onView: (url: string) => void }> = ({ label, url, onView }) => (
    <div className="flex items-center mb-2">
      <FaFilePdf className="text-red-500 mr-2" />
      <span className="font-medium mr-2">{label}:</span>
      {url ? (
        <>
          <button onClick={() => onView(url)} className="text-blue-500 hover:underline mr-2">View</button>
          <a href={url} download className="text-green-500 hover:underline">Download</a>
        </>
      ) : (
        <span className="text-gray-500">Not provided</span>
      )}
    </div>
  );
  
  const OffenceItem: React.FC<{label: string; value: string; details: string | null; onView?: (url: string) => void}> = ({ label, value, details, onView }) => {
    const isDocument = details?.startsWith('http');
  
    return (
      <div className="mb-4">
        <h4 className="text-lg font-medium">{label}</h4>
        <p className={`text-lg ${value === 'Yes' ? 'text-red-600' : 'text-green-600'}`}>
          {value === 'Yes' ? <FaExclamationTriangle className="inline mr-2" /> : <FaCheckCircle className="inline mr-2" />}
          {value}
        </p>
        {value === 'Yes' && details && (
          isDocument ? (
            <div className="flex items-center mt-2">
              <FaFilePdf className="text-red-500 mr-2" />
              <span className="font-medium mr-2">Supporting Document:</span>
              <button onClick={() => onView && onView(details)} className="text-blue-500 hover:underline mr-2">View</button>
              <a href={details} download className="text-green-500 hover:underline">Download</a>
            </div>
          ) : (
            <p className="mt-2">{details}</p>
          )
        )}
      </div>
    );
  };
  
  
  const renderPersonalInfo = (data: TeacherRegistrationData) => (
    <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-4 gap-4">
      <InfoItem label="Name" value={`${data.bio_datas.forenames} ${data.bio_datas.surname}`} />
      <InfoItem label="National ID" value={data.bio_datas.national_id} />
      <InfoItem label="Date of Birth" value={new Date(data.bio_datas.dob).toLocaleDateString()} />
      <InfoItem label="Gender" value={data.bio_datas.gender} />
      <InfoItem label="Nationality" value={data.bio_datas.nationality} />
      <InfoItem label="Email" value={data.bio_datas.email} />
      <InfoItem label="Mobile" value={data.bio_datas.mobile} />
      <InfoItem label="Postal Address" value={data.bio_datas.postal_address} />
    </div>
  );
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC"
};

function ConvertTime(time: string){
    return new Intl.DateTimeFormat("en-US", options).format(new Date(time))
}

function getRelativeTime(updateTime: string) {
    const now = new Date();
    const updated = new Date(updateTime);
    const diffSeconds = Math.floor((now.getTime() - updated.getTime()) / 1000);
    
    if (diffSeconds < 60) {
        return "Updated seconds ago";
    } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        return `Updated ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffSeconds < 86400) {
        const hours = Math.floor(diffSeconds / 3600);
        return `Updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffSeconds < 604800) {
        const days = Math.floor(diffSeconds / 86400);
        if (days === 1) {
            return "Updated a day ago";
        } else {
            return `Updated ${days} days ago`;
        }
    } else if (diffSeconds < 2592000) {
        const weeks = Math.floor(diffSeconds / 604800);
        if (weeks === 1) {
            return "Updated a week ago";
        } else {
            return `Updated ${weeks} weeks ago`;
        }
    } else if (diffSeconds < 31536000) {
        const months = Math.floor(diffSeconds / 2592000);
        if (months === 1) {
            return "Updated a month ago";
        } else {
            return `Updated ${months} months ago`;
        }
    } else {
        const years = Math.floor(diffSeconds / 31536000);
        if (years === 1) {
            return "Updated a year ago";
        } else {
            return `Updated ${years} years ago`;
        }
    }
  }

  function getSLAStatus(createdAt: string) {
    const created = new Date(createdAt);
    const today = new Date();
    const diffTime = today.getTime() - created.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const remainingDays = 30 - diffDays;

    let badgeColor = "bg-green-100 text-green-800";
    let displayText = `${remainingDays} days left`;

    if (remainingDays <= 5 && remainingDays > 0) {
        badgeColor = "bg-yellow-100 text-yellow-800";
    } else if (remainingDays <= 0) {
        badgeColor = "bg-red-100 text-red-800";
        const overdueDays = Math.abs(remainingDays);
        displayText = `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`;
    }

    return { badgeColor, displayText };
}
  const renderCaseDetails = (data: TeacherRegistrationData) => (
    <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-4 gap-4">
      <InfoItem label="Registration Type" value={`${data.teacher_registrations.registration_type}`} />
      <InfoItem label="Application ID" value={`59c0f722-5c06-46ab-9875-430bd3a236ca`} />
      <InfoItem label="Registration Status" value={`${data.teacher_registrations.reg_status}`} />
      <InfoItem label="Endorsement Status" value={`${data.teacher_registrations.endorsement_status}`} />
      <InfoItem label="Payment Name" value={`${data.teacher_registrations.payment_name}`} />
      <InfoItem label="Payment Ref" value={`${data.teacher_registrations.payment_ref}`} />
      <InfoItem label="Payment Amount" value={`${data.teacher_registrations.payment_amount}`} />
      <div className="flex justify-start space-x-2 items-center">
          <Label className="font-semibold text-gray-700">SLA Status:</Label>
          <Badge className={`${getSLAStatus(data.teacher_registrations.updated_at).badgeColor} font-semibold px-3 py-1`}>
              {getSLAStatus(data.teacher_registrations.updated_at).displayText}
          </Badge>
      </div>
      <InfoItem label="Created" value={ConvertTime(data.teacher_registrations.created_at)} />
      <InfoItem label="Updated" value={getRelativeTime(data.teacher_registrations.updated_at)} />
    </div>
  );
  
  const renderQualifications = (data: TeacherRegistrationData, onView: (url: string) => void) => (
    <div>
      {data.edu_pro_qualifications.map((qual, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="text-lg font-medium">{qual.qualification}</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <InfoItem label="Level" value={qual.level} />
            <InfoItem label="Institution" value={qual.institution} />
            <InfoItem label="Year" value={qual.qualification_year} />
            <InfoItem label="Major Subjects" value={qual.major_subjects} />
            <DocumentItem label="Qualification Attachment" url={qual.attachments} onView={onView} />
          </div>
        </div>
      ))}
    </div>
  );
  
  const renderEmployment = (data: TeacherRegistrationData) => (
    <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-4 gap-4">
      <InfoItem label="Current Institution" value={data.employment_details.current_institution} />
      <InfoItem label="Institution Type" value={data.employment_details.institution_type} />
      <InfoItem label="Region" value={data.employment_details.region} />
      <InfoItem label="District" value={data.employment_details.district} />
      <InfoItem label="City/Town" value={data.employment_details.city_or_town} />
      <InfoItem label="Years of Experience" value={data.employment_details.experience_years.toString()} />
    </div>
  );
  
  const renderDocuments = (data: TeacherRegistrationData, onView: (url: string) => void) => (
    <div className='bg-gray-100 rounded-lg p-4'>
      <DocumentItem label="National ID Copy" url={data.attachments.national_id_copy} onView={onView} />
      <DocumentItem label="Qualification Copy" url={data.attachments.qualification_copy} onView={onView} />
      {data.teacher_registrations.endorsement_status.toLocaleLowerCase() == 'endorsement-complete' && data.teacher_registrations.reg_status.toLocaleLowerCase() == 'manager-approved' && <DocumentItem label="License" url={data.teacher_registrations.license_link} onView={onView} />}
      {data.teacher_registrations.endorsement_status.toLocaleLowerCase() == 'endorsement-complete' && data.teacher_registrations.reg_status.toLocaleLowerCase() == 'manager-rejected' && <DocumentItem label="Notice" url={data.teacher_registrations.license_link} onView={onView} />}
    </div>
  );
  
  const renderOffences = (data: TeacherRegistrationData, onView: (url: string) => void) => (
    <div className='bg-gray-100 rounded-lg p-4'>
      <OffenceItem 
        label="Student Related Offence" 
        value={data.offence_convictions.student_related_offence} 
        details={data.offence_convictions.student_related_offence_details}
      />
      <OffenceItem 
        label="Drug Related Offence" 
        value={data.offence_convictions.drug_related_offence} 
        details={data.offence_convictions.drug_related_offence_details}
      />
      <OffenceItem 
        label="License Flag" 
        value={data.offence_convictions.license_flag} 
        details={data.offence_convictions.license_flag_details}
        onView={onView}
      />
      <OffenceItem 
        label="Misconduct Flag" 
        value={data.offence_convictions.misconduct_flag} 
        details={data.offence_convictions.misconduct_flag_details}
        onView={onView}
      />
    </div>
  );
  
  const renderDeclaration = (data: TeacherRegistrationData) => (
    <div className="p-4 bg-gray-100 rounded-lg">
      <p className="text-lg">
        {data.declarations.agreement === 'Yes' 
          ? <span className="text-green-600"><FaCheckCircle className="inline mr-2" />Applicant has agreed to the declaration.</span>
          : <span className="text-red-600"><FaExclamationTriangle className="inline mr-2" />Applicant has not agreed to the declaration.</span>
        }
      </p>
    </div>
  );
  
  export default TeacherRegistrationView;