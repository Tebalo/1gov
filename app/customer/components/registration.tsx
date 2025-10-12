'use client'
import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Eye, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  User, 
  FileText,
  Calendar,
  DollarSign,
  GraduationCap,
  Shield,
  Coins,
  Loader,
  Edit
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowRight, BookOpenText} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { searchRecord } from '@/app/lib/actions';
import { ResendPayment } from './resend-payment-link';

interface RegistrationData {
  national_id: string;
  reg_number: string;
  reg_status: string;
  work_status: string | null;
  endorsement_status: string;
  rejection_reason: string | null;
  service_code: string;
  payment_ref: string | null;
  payment_amount: string | null;
  payment_name: string | null;
  application_id: string;
  submission_id: string;
  license_link: string | null;
  payment_link: string | null;
  draft_id: string | null;
  submitted_via: string;
  education_bg_checks: string | null;
  flags_no: string;
  recite: string | null;
  invoice: string | null;
  charges: string | null;
  paid_at: string | null;
  subscription_due_date: string | null;
  license_expiry_date: string | null;
  assigned_to: string | null;
  institution_verification: string;
  course_verification: string;
  license_status: string;
  pending_customer_action: string;
  registration_type: string;
  created_at: string;
  updated_at: string;
}

interface DraftData {
  id: string;
  content: any;
  formType: string;
  status: string;
  currentStep: number | null;
  userId: string;
  userName: string;
  userRole: string | null;
  caseId: string | null;
  caseType: string | null;
  createdAt: string;
  updatedAt: string;
}

// Define types
interface StatusInfo {
  display: string;
  description: string;
  action: string | null;
  color: string | null // Tailwind CSS color classes;
  icon: string;
}

type SystemStatus = 
  | 'Pending-Screening'
  | 'Pending-Assessment'
  | 'Recommended-For-Approval'
  | 'Recommended-For-Rejection'
  | 'Manager-Approved'
  | 'Manager-Rejected'
  | 'Pending-Endorsement'
  | 'Pending-Customer-Action'
  | 'Endorsement-Complete';

// Define the status map outside the function
const STATUS_MAP: Record<SystemStatus, StatusInfo> = {
  'Pending-Customer-Action': {
      display: 'Action Required',
      description: 'Please complete the required steps to proceed with your application.',
      action: null,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: 'alert-circle'
    },
  'Pending-Screening': {
    display: 'Under Evaluation',
    description: 'Your application is being reviewed by our team.',
    action: null,
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: 'clock'
  },
  'Pending-Assessment': {
    display: 'Under Evaluation',
    description: 'Your qualifications and credentials are being assessed.',
    action: null,
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: 'clipboard'
  },
  'Recommended-For-Approval': {
    display: 'Under Evaluation',
    description: 'Your application is in final review pending management approval.',
    action: null,
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: 'hourglass'
  },
  'Recommended-For-Rejection': {
    display: 'Under Evaluation',
    description: 'Your application is in final review pending management approval.',
    action: null,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: 'hourglass'
  },
  'Manager-Approved': {
    display: 'Payment Required',
    description: 'Congratulations! Your application has been approved. Please complete payment to finalize your registration.',
    action: 'Make Payment',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: 'check-circle'
  },
  'Manager-Rejected': {
    display: 'Rejected',
    description: 'We regret to inform you that your application has been rejected. Please contact support for further assistance.',
    action: 'Contact Support',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: 'alert-circle'
  },
  'Pending-Endorsement': {
    display: 'Pending Approval',
    description: 'Your payment has been received. Your registration is being finalized.',
    action: null,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: 'file-check'
  },
  'Endorsement-Complete': {
    display: 'Registration Complete',
    description: 'Your teacher registration is active and complete.',
    action: 'View Certificate',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: 'check-circle'
  }
};


function getCustomerStatus(systemStatus: string): StatusInfo {
  return STATUS_MAP[systemStatus as SystemStatus] || {
    display: 'Unknown Status',
    description: 'Please contact support for more information.',
    action: 'Contact Support',
    color: 'gray',
    icon: 'help-circle'
  };
}

const SAMPLE_DATA: RegistrationData = {
  "national_id": "436415528",
  "reg_number": "BOT000135",
  "reg_status": "Manager-Rejected",
  "work_status": "Employed",
  "endorsement_status": "Endorsement-Complete",
  "rejection_reason": null,
  "service_code": "MESD_006_08_054",
  "payment_ref": "jj",
  "payment_amount": "jj",
  "payment_name": "jj",
  "application_id": "5f6662b4-84ec-4684-983d-149c0e23f9ey",
  "submission_id": "5f6662b4149c0e23879y",
  "license_link": null,
  "draft_id": "cmezyuufe0000h0c4rmkoxpti",
  "submitted_via": "TRLS Portal",
  "education_bg_checks": null,
  "flags_no": "0",
  "recite": null,
  "invoice": null,
  "charges": null,
  "paid_at": null,
  "payment_link": null,
  "subscription_due_date": null,
  "license_expiry_date": null,
  "assigned_to": null,
  "institution_verification": "Verified",
  "course_verification": "Verified",
  "license_status": "New",
  "pending_customer_action": "false",
  "registration_type": "Teacher",
  "created_at": "2025-10-04 06:57:56",
  "updated_at": "2025-10-04 06:57:56"
};


const RegistrationStatusComponent: React.FC<{userId:string}> = ({userId}) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [draftData, setDraftData] = useState<DraftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrationData = async () => {
    try {
      setLoading(true);

      const USE_SAMPLE_DATA = false; // Set to true to use sample data for testing

      if (USE_SAMPLE_DATA) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRegistrationData(SAMPLE_DATA);
        setError(null);
        return;
      }

      const response = await searchRecord(userId);

      if (!response) {
        throw new Error('Failed to fetch registration data');
      }
      
      const data: RegistrationData = await response;
      setRegistrationData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Try to fetch draft even if there's an error
      await fetchDraftData();
    } finally {
      setLoading(false);
    }
  };

  const fetchDraftData = async () => {
    try {
      const response = await fetch(`/api/drafts/v1/recent?userId=${userId}`);
      
      if (!response.ok) {
        // No draft found, that's okay
        return;
      }
      
      const draft: DraftData = await response.json();
      setDraftData(draft);
    } catch (err) {
      console.error('Error fetching draft:', err);
      // Silently fail - draft is optional
    }
  };

  useEffect(() => {
    fetchRegistrationData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userId]);

  // Helper functions for conditional logic
  const shouldShowPaymentButton = (data: RegistrationData): boolean => {
    return (
      data.reg_status === "Manager-Approved" &&
      data.endorsement_status === "Pending-Endorsement" &&
      data.payment_ref === null &&
      data.payment_amount === null
    );
  };

  const shouldShowLicenseDownload = (data: RegistrationData): boolean => {
    return (
      data.reg_status === "Manager-Approved" &&
      data.endorsement_status === "Endorsement-Complete"
    );
  };

  const shouldShowRegeneratePaymentLinkButton = (data: RegistrationData): boolean => {
    return (
      data.reg_status === "Manager-Approved" &&
      data.endorsement_status === "Pending-Endorsement" &&
      data.payment_ref === null &&
      data.payment_amount === null 
    )
  }

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'manager-approved':
      case 'endorsement-complete':
      case 'verified':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending-endorsement':
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: string): string => {
    return `BWP ${(parseFloat(amount)/100).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500"><Loader className="w-10 h-10 animate-spin"/></div>
      </div>
    );
  }

  if (error && !registrationData) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-6">
          <QuickActions draftData={draftData} />
      </div>
    );
  }

  if (!registrationData) return <QuickActions draftData={draftData} />

  return (
    <div className="mx-auto grid">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Registration Status</h1>
              <p className="text-sm text-gray-600 mt-1">
                {registrationData.registration_type} Registration • {registrationData.reg_number}
              </p>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-lg border text-sm font-medium ${getCustomerStatus(registrationData.reg_status).color}`}>
              <CheckCircle className="h-4 w-4 mr-1.5" />
              {registrationData.reg_status=='Manager-Approved' && registrationData.payment_amount ? getCustomerStatus(registrationData.endorsement_status).display : getCustomerStatus(registrationData.reg_status).display}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {(shouldShowPaymentButton(registrationData) || shouldShowLicenseDownload(registrationData) || registrationData.invoice) && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-3">
              {shouldShowPaymentButton(registrationData) && (
                <a
                  href={registrationData.paid_at ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Make Payment ({registrationData.payment_amount ? formatCurrency(registrationData.payment_amount) : 'BWP 50.00'})
                </a>
              )}

              {shouldShowLicenseDownload(registrationData) && (
                <>
                  <a
                    href={`https://docs.google.com/viewer?url=${encodeURIComponent(registrationData.license_link ?? '')}&embedded=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View License
                  </a>
                  <a
                    href={registrationData.license_link ?? '#'}
                    download
                    className="inline-flex items-center px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </>
              )}

              {shouldShowRegeneratePaymentLinkButton(registrationData) && (
                <>
                  <ResendPayment caseId={registrationData.national_id}/>
                </>
              )}

              {registrationData.invoice && (
                <a
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(registrationData.invoice ?? '')}&embedded=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Invoice
                </a>
              )}
            </div>
          </div>
        )}

        {/* Registration Details */}
        <Accordion
          type="single"
          collapsible
          className="w-full p-6"
          defaultValue="item-1"
        >
          <AccordionItem value="registration-info">
            <AccordionTrigger>Additional Registration Information</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 flex items-center pb-2 border-b border-gray-200">
                        <User className="h-4 w-4 mr-2" />
                        Personal Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">National ID</label>
                          <p className="text-sm text-gray-900 mt-1">{registrationData.national_id}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Registration Number</label>
                          <p className="text-sm text-gray-900 font-mono mt-1">{registrationData.reg_number}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Work Status</label>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded border text-xs font-medium ${getStatusColor(registrationData.work_status ?? 'pending')}`}>
                              {registrationData.work_status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Information */}
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 flex items-center pb-2 border-b border-gray-200">
                        <Shield className="h-4 w-4 mr-2" />
                        Status Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Registration Status</label>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded border text-xs font-medium ${getStatusColor(registrationData.reg_status)}`}>
                              {registrationData.reg_status}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Endorsement Status</label>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded border text-xs font-medium ${getStatusColor(registrationData.endorsement_status)}`}>
                              {registrationData.endorsement_status}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">License Status</label>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded border text-xs font-medium ${getStatusColor(registrationData.license_status)}`}>
                              {registrationData.license_status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Information */}
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 flex items-center pb-2 border-b border-gray-200">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Verification
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Institution Verification</label>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded border text-xs font-medium ${getStatusColor(registrationData.institution_verification)}`}>
                              {registrationData.institution_verification}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Course Verification</label>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded border text-xs font-medium ${getStatusColor(registrationData.course_verification)}`}>
                              {registrationData.course_verification}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned To</label>
                          <p className="text-sm text-gray-900 mt-1">{registrationData.assigned_to}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 flex items-center pb-2 border-b border-gray-200">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Payment Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment Reference</label>
                          <p className="text-sm text-gray-900 font-mono mt-1">{registrationData.payment_ref || 'Not available'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment Amount</label>
                          <p className="text-sm text-gray-900 font-semibold mt-1">
                            {registrationData.payment_amount ? formatCurrency(registrationData.payment_amount) : 'Not available'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Application Information */}
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 flex items-center pb-2 border-b border-gray-200">
                        <FileText className="h-4 w-4 mr-2" />
                        Application Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Service Code</label>
                          <p className="text-sm text-gray-900 font-mono mt-1">{registrationData.service_code}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Submitted Via</label>
                          <p className="text-sm text-gray-900 mt-1">{registrationData.submitted_via}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Flags</label>
                          <p className="text-sm text-gray-900 mt-1">{registrationData.flags_no} flags</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 flex items-center pb-2 border-b border-gray-200">
                        <Calendar className="h-4 w-4 mr-2" />
                        Timeline
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</label>
                          <p className="text-sm text-gray-900 mt-1">{formatDate(registrationData.created_at)}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Updated</label>
                          <p className="text-sm text-gray-900 mt-1">{formatDate(registrationData.updated_at)}</p>
                        </div>
                        {registrationData.license_expiry_date && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">License Expiry</label>
                            <p className="text-sm text-gray-900 mt-1">{formatDate(registrationData.license_expiry_date)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rejection Reason (if applicable) */}
                {registrationData.rejection_reason && (
                  <div className="p-6 bg-red-50 border-t border-red-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-base font-semibold text-red-800">Rejection Reason</h4>
                        <p className="text-sm text-red-700 mt-1">{registrationData.rejection_reason}</p>
                      </div>
                    </div>
                  </div>
                )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

const QuickActions = ({ draftData }: { draftData: DraftData | null }) => {
    const hasDraft = !!draftData;
    const applicationUrl = hasDraft 
      ? `/customer/dashboard/teacher-application?draftId=${draftData.id}`
      : '/customer/dashboard/teacher-application';

    return(
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Get Started</h2>
                <p className="text-sm text-gray-600">Use the quick actions below or navigate through the menu</p>
            </div>
            
            <div className="group border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg transition-colors ${
                          hasDraft 
                            ? 'bg-blue-100 group-hover:bg-blue-200' 
                            : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                            {hasDraft ? (
                              <Edit className="w-6 h-6 text-blue-600"/>
                            ) : (
                              <BookOpenText className="w-6 h-6 text-gray-600"/>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                              {hasDraft 
                                ? 'Continue Your Application' 
                                : 'Application For Teacher Registration & Licensing'
                              }
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {hasDraft 
                                ? `You have a draft saved from ${new Date(draftData.updatedAt).toLocaleDateString()}. Continue where you left off.`
                                : 'Submit your application for teacher registration and licensing'
                              }
                            </p>
                            {hasDraft && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                  Draft Available
                                </span>
                                {draftData.currentStep && (
                                  <span className="text-xs text-gray-500">
                                    Step {draftData.currentStep}
                                  </span>
                                )}
                              </div>
                            )}
                        </div> 
                    </div>
                    
                    <Button asChild variant="ghost" size="sm" className="ml-4 hover:bg-gray-100">
                        <Link href={applicationUrl} className="flex items-center">
                            <ArrowRight className="w-4 h-4"/>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

// const QuickActions = () => {
//     return(
//         <div className="space-y-6">
//             <div>
//                 <h2 className="text-lg font-semibold text-gray-900 mb-1">Get Started</h2>
//                 <p className="text-sm text-gray-600">Use the quick actions below or navigate through the menu</p>
//             </div>
            
//             <div className="group border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-start space-x-4">
//                         <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
//                             <BookOpenText className="w-6 h-6 text-gray-600"/>
//                         </div>
//                         <div className="flex-1">
//                             <h3 className="text-base font-semibold text-gray-900 mb-1">Application For Teacher Registration & Licensing</h3>
//                             <p className="text-sm text-gray-600 leading-relaxed">Submit your application for teacher registration and licensing</p>
//                         </div> 
//                     </div>
                    
//                     <Button asChild variant="ghost" size="sm" className="ml-4 hover:bg-gray-100">
//                         <Link href="/customer/dashboard/teacher-application" className="flex items-center">
//                             <ArrowRight className="w-4 h-4"/>
//                         </Link>
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

export default RegistrationStatusComponent;