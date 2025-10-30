'use client'
import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  User, 
  FileText,
  Calendar,
  GraduationCap,
  Shield,
  Loader
} from 'lucide-react';
import Link from "next/link";
import { searchRecord } from '@/app/lib/actions';
import { SearchRecordResponse } from '@/app/lib/types';

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

const SAMPLE_DATA: SearchRecordResponse = {
    "national_id": "436415528",
    "reg_number": "BOT000117",
    "reg_status": "Manager-Approved",
    "work_status": "Employed",
    "endorsement_status": "Endorsement-Complete",
    "rejection_reason": null,
    "service_code": "TRLS",
    "payment_ref": "er",
    "payment_amount": "50",
    "payment_name": "name",
    "invoice_number": "INV-000118",
    "application_id": "5f6662b4-84ec-4684-983d-149c0e23f9ey",
    "submission_id": "5f6662b4149c0e23879y",
    "license_link": "https://twosixdigitalbw.com/api/v2-uat/document/AabrXzqi3mkASF4oldf6aHt92YkakH031upPFbB2/download",
    "draft_id": "cmezyuufe0000h0c4rmkoxpti",
    "submitted_via": "TRLS Portal",
    "education_bg_checks": null,
    "flags_no": "0",
    "recite": null,
    "invoice": "https://twosixdigitalbw.com/api/v2-uat/document/AabrXzqi3mkASF4oldf6aHt92YkakH031upPFbB2/download",
    "charges": null,
    "paid_at": "https://twosixdigitalbw.com/uat/payment/show/ref_68f3737439aae",
    "payment_link": "https://twosixdigitalbw.com/api/v2-uat/document/AabrXzqi3mkASF4oldf6aHt92YkakH031upPFbB2/download",
    "subscription_due_date": "2025-12-18 11:00:33",
    "license_expiry_date": "2025-12-18 11:00:33",
    "assigned_to": "Garenosi Motlalepuo",
    "institution_verification": "Verified",
    "course_verification": "Verified",
    "license_status": "Active",
    "pending_customer_action": "false",
    "registration_type": "Teacher",
    "created_at": "2025-10-18 11:00:33",
    "updated_at": "2025-10-18 11:01:07"
};

const VerifyRegistrationStatus: React.FC<{userId:string}> = ({userId}) => {
  const [registrationData, setRegistrationData] = useState<SearchRecordResponse | null>(null);
  const [draftData, setDraftData] = useState<DraftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrationData = async () => {
    try {
      setLoading(true);

      const USE_SAMPLE_DATA = false; // Set to true to use sample data for testing

      if (USE_SAMPLE_DATA) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setRegistrationData(SAMPLE_DATA);
        setError(null);
        return;
      }

      const response = await searchRecord(userId);

      if (!response) {
        throw new Error('Failed to fetch registration data');
      }
      
      const data: SearchRecordResponse = await response;
      setRegistrationData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrationData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userId]);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'manager-approved':
      case 'endorsement-complete':
      case 'verified':
      case 'active':
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
      month: 'long',
      day: 'numeric'
    });
  };

  const isVerified = (data: SearchRecordResponse): boolean => {
    return data.endorsement_status === 'Endorsement-Complete' || 
           (data.reg_status === 'Manager-Approved' && data.license_status === 'Active');
  };

  const getVerificationStatus = (data: SearchRecordResponse): { status: string; color: string; message: string } => {
    if (isVerified(data)) {
      return {
        status: 'Verified Teacher',
        color: 'bg-green-50 text-green-700 border-green-200',
        message: 'This teacher registration is verified and active.'
      };
    }
    
    if (data.reg_status === 'Manager-Approved' && data.endorsement_status === 'Pending-Endorsement') {
      return {
        status: 'Pending Verification',
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        message: 'Registration approved, verification in progress.'
      };
    }

    return {
      status: 'Under Review',
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      message: 'Registration is currently under review.'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4"/>
          <p className="text-gray-600 text-lg">Verifying registration...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we verify your teacher registration</p>
        </div>
      </div>
    );
  }

  if (error && !registrationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchRegistrationData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!registrationData) return <QuickActions draftData={draftData} />

  const verificationInfo = getVerificationStatus(registrationData);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            {/* <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Teacher Registration Verification</h1>
              <p className="text-gray-600">Ministry of Education, Botswana</p>
            </div> */}

            {/* Verification Status */}
            <div className={`p-4 border-l-4 ${verificationInfo.color.includes('green') ? 'border-green-500' : verificationInfo.color.includes('yellow') ? 'border-yellow-500' : 'border-gray-500'} mb-6`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${verificationInfo.color}`}>
                  {isVerified(registrationData) ? 
                    <CheckCircle className="h-5 w-5" /> : 
                    <AlertCircle className="h-5 w-5" />
                  }
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {verificationInfo.status}
                  </h2>
                  <p className="text-gray-600 mb-3">{verificationInfo.message}</p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${verificationInfo.color}`}>
                    Registration: {registrationData.reg_number}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Details */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Type</h3>
                <p className="text-lg font-semibold text-gray-900">{registrationData.registration_type}</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">License Status</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getStatusColor(registrationData.license_status)}`}>
                  {registrationData.license_status}
                </span>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Work Status</h3>
                <p className="text-lg font-semibold text-gray-900">{registrationData.work_status}</p>
              </div>
            </div> */}
          </div>
        </div>

        {/* License Document */}
        {registrationData.license_link && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Official Teaching License
              </h3>
              
              {/* License Viewer */}
              <div className="mb-4">
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(registrationData.license_link)}&embedded=true`}
                  width="100%"
                  height="400"
                  className="border border-gray-300 rounded-lg"
                  title="Teaching License"
                />
              </div>
              
              {/* Download Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(registrationData.license_link)}&embedded=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full License
                </Link>
                
                <a
                  href={registrationData.license_link}
                  download
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Additional Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Verification Status */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Verification Status
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Institution:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(registrationData.institution_verification)}`}>
                      {registrationData.institution_verification}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Qualifications:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(registrationData.course_verification)}`}>
                      {registrationData.course_verification}
                    </span>
                  </div>
                </div>
              </div>

              {/* Important Dates */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Important Dates
                </h4>
                <div className="space-y-2">
                  {registrationData.license_expiry_date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">License Expiry:</span>
                      <span className="text-sm text-gray-900 font-medium">
                        {formatDate(registrationData.license_expiry_date)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Registered:</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {formatDate(registrationData.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-6">
          <p>Verification performed on {new Date().toLocaleDateString()}</p>
          <p className="mt-1">For inquiries, contact the Ministry of Education, Botswana</p>
        </div>
      </div>
    </div>
  );
};

const QuickActions = ({ draftData }: { draftData: DraftData | null }) => {
    return(
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Registration Found</h3>
                    <p className="text-sm text-gray-500">There are currently no registrations to display.</p>
                </div>
            </div>
        </div>
    )
}

export default VerifyRegistrationStatus;