export type AuthenticateResult =
  | { status: 'success' }
  | { status: 'failed'; message: string };

export type UserRole = 'MANAGER' | 
'REGISTRATION_OFFICER' | 
'SNR_REGISTRATION_OFFICER' | 
'DIRECTOR' | 
'REGISTRAR' | 
'LICENSE_OFFICER' | 
'SNR_LICENSE_OFFICER' |
'LICENSE_MANAGER'|
'INVESTIGATIONS_OFFICER'| 
'INVESTIGATIONS_MANAGER'| 
'SENIOR_INVESTIGATIONS_OFFICER' | 
'ADMIN' | 
'DISCIPLINARY_COMMITTEE' | 
'INVESTIGATIONS_DIRECTOR' |
'TEACHER_DEVELOPMENT_OFFICER' |
'TEACHER_DEVELOPMENT_MANAGER' |
'SENIOR_DEVELOPMENT_OFFICER' |
'APPEALS_OFFICER' |
'SENIOR_APPEALS_OFFICER' |
'APPEALS_MANAGER' |
'APPEALS_DIRECTOR';


export interface InvestigationStatuses {
  label: string;
  value: string;
  access: string[];
}

export interface AuthResponse {
  message: string;
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string | null;
  session_state: string;
  scope: string;
  error: string | null;
  error_description: string | null;
  error_uri: string | null;
  code: number | null;
}

export interface ComplaintPayload {
  
}

export interface DecodedToken {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  name: string;
  given_name: string;
  family_name: string;
  preferred_username: string;
  email: string;
  email_verified: boolean;
  gender: string;
  acr: string;
  realm_access: {
    roles: string[];
  };
  resource_access: {
    account: {
      roles: string[];
    };
  };
  scope: string;
  sid: string;
  client_id: string;
  username: string;
  active: boolean;
}

export interface Session {
  auth: AuthResponse;
  user?: DecodedToken;
  expires?: string;
}

export interface AccessGroup {
  persona: string[],
  current: string;
  username: string;
  userid: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface OTPPayload {
  username: string;
  otp: string;
}

export interface Registration {
  national_id: string;
  reg_number: string;
  reg_status: string;
  registration_type: string;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  crime_location: string;
  nature_of_crime: string;
  date: string;
  time: string;
  status: string;
  bif_number: string;
  case_number: string;
  fir_number: string;
  outcome: string;
}

export interface reporter {
  name: string | null;
  contact_number: string | null;
  Omang_id: string | null;
  occupation: string | null;
  sex: string | null;
  nationality: string | null;
  address: string | null;
  inquiry_number: string | null;
  case_number: string | null;
  anonymous: boolean | null;
  submission_type: string | null;
  id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

interface complaint {
  crime_location: string | null;
  nature_of_crime: string | null;
  date: string | null;
  time: string | null;
  reg_status: string | null;
  bif_number: string | null;
  inquiry_number: string | null;
  case_number: string | null;
  fir_number: string | null;
  id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

interface offender {
  name: string | null;
  sex: string | null;
  nationality: string | null;
  dob: string | null;
  age: number | null;
  contact_number: string | null;
  id_passport_number: string | null;
  address: string | null;
  ward: string | null;
  inquiry_number: string | null;
  occupation: string | null;
  place_of_work: string | null;
  id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface investigation {
  investigating_officer: string | null;
  police_station: string | null;
  cr_number: string | null;
  offence: string | null;
  inquiry_number: string | null;
  outcome: string | null;
  id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface preliminary_investigation {
  id: number | null;
  inquiry_number: string | null;
  investigation_details: string | null;
  investigation_outcome: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Investigation {
  reporter: reporter;
  complaint: complaint;
  offender: offender;
  investigation: investigation;
  preliminary_investigation: preliminary_investigation;
}

export interface InvestigationResponse{
  success: boolean;
  data?: Investigation;
  message?: string;
}

export interface ComplaintSearchResponse{
  code: number;
  reporter?: reporter
}

export interface TipOffPayload{
  full_name: string;
  phone: string;
  identity_No: string;
  email: string;
  nature_of_crime: string;
  description: string;
  crime_location: string;
}

export interface data {
  tipoff_number: string;
  id: number;
  application_id: string,
  user_id: string,
  first_name: string,
  middle_name: string,
  surname: string,
  primary_email: string,
  primary_phone: string,
  primary_postal: string,
  gender: string,
  nationality: string,
  breach_nature: string,
  breach_description: string,
  breach_location: string,
  breach_date: string,
  reg_status: string,
  profile_data_consent: boolean,
  service_id: string,
  service_name: string,
  service_version: string,
  created_at: string,
  updated_at: string
}

export interface cpd {
  application_id: string
  user_id: string
  reg_status: string
  first_name: string
  middle_name: string
  surname: string
  primary_email: string
  primary_phone: string
  primary_postal: string
  gender: string
  nationality: string
  breach_nature: string
  breach_description: string
  breach_location: string
  breach_date: string
  profile_data_consent: true
  service_id: string
  service_name: string
  service_version: string
}

export interface TipOffListResponse{
  code: number;
  data?: data[];
}

export interface CPDListResponse{
  code: number;
  data?: cpd[];
}

interface dataactivity {
  activity_number: string;
  success: boolean;
}

export interface Activity{
  activities: string;
  full_name: string;
  role: string;
  record_type: string;
  record_id: string;
  activity_number: string;
  submission_type: string;
  date_of_submission: string;
  anonymous: string;

  action_taken?: string | null;
  userid?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityList{
  activities: string;
  full_name: string;
  role: string;
  record_type: string;
  record_id: string;
  activity_number: string;
  submission_type: string;
  date_of_submission: string;
  anonymous: string;
}

export interface ActivityListResponse{
  code: number;
  activity?: Activity[];
}
interface objectac {
  data: Activity;
}

export interface ActivityObject{
  code: number;
  data?: objectac;
}

interface cpd_activity {
  id: number;
  user_id: string;
  cumulative_points: string;
  cpd_number: string;
  reg_status: string;
  sla: string;
  cpd_activity: string;
  other: string;
  activity_name: string;
  cpd_points: string;
  cpd_activity_description: string;
  service_provider: string;
  duration: string;
  declaration: string;
  profile_data_consent: number;
  created_at: string;
  updated_at: string;
}

interface cpd_profile {
  id: number;
  cpd_number: string;
  first_name: string;
  middle_name: string;
  surname: string;
  created_at: string;
  updated_at: string;
}

interface service {
  id: number;
  cpd_number: string;
  service_id: string;
  service_name: string;
  service_version: string;
  created_at: string;
  updated_at: string;
}

interface attachment {
  id: 2,
  cpd_number: string;
  cpd_evidence_key: string | null;
  other_attachments_key: string | null;
  created_at: string;
  updated_at: string;
}

interface CPD {
  cpd_activity: cpd_activity;
  profile: cpd_profile;
  service: service;
  attachment: attachment;
}

export interface CPDResponseGet{
  code: number;
  data?: CPD;
}

export interface ActivityResponse{
  code: number;
  message: string;
  data?: dataactivity;
}


interface response_data_activity {
    id: 1,
    activity_numbe: string;
    activities: string;
    action_taken: string;
    record_type: string;
    record_id: string;
    created_at: string;
    updated_at: string;
}

export interface ActivityListResponse{
  code: number;
  data?: response_data_activity;
}


export interface ActivityPayload {
  full_name: string;
  role: string;
  activities: string;
  action_taken: string;
  record_type: string;
  anonymous: string;
  submission_type: string;
  userid: string;
  record_id: string | number;
}

export interface ReportPayload {
  investigation_details: string;
  investigation_outcome: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvestigationReportPayload {
  investigating_officer: string | null;
  police_station: string | null;
  cr_number: string | null;
  offence: string | null;
  outcome: string | null;
}



export interface GETReportResponse {
  message: string;
  success: boolean;
  data: {
      id: number;
      inquiry_number: string;
      investigation_details: string | null,
      investigation_outcome: string | null,
      created_at: string;
      updated_at: string;
  }
}

export interface ReportResponse {
  message?: string;
  code: number;
}

export interface TipOffResponse{
  message?: string;
  code: number;
  data?: data;
}

export interface Appeals_list{
  message?: string;
  code: number;
  data?: appeals_application[]
}

export interface appeal {
  message?: string;
  code: number;
  profile?: profile;
  appeals_application?: appeals_application
}

interface profile {
  user_id: string;
  appeals_number: string;
  first_name: string;
  middle_name: string;
  surname: string;
  primary_email: string;
  primary_postal: string;
  created_at: string;
  updated_at: string;
}

interface appeals_application {
      id: number;
      user_id: string;
      application: string;
      appeals_number: string;
      reg_status: string;
      sla: string;
      appeal_decision: string;
      appeal_reason: string;
      supporting_document_key: string;
      declaration: string;
      profile_data_consent: number;
      created_at: string;
      updated_at: string;
}

interface bio_datas {
  id: number | null;
  national_id: string | null;
  surname: string | null;
  forenames: string | null;
  dob: string | null;
  pob: string | null;
  gender: string | null;
  nationality: string | null;
  postal_address: string | null;
  physical_address: string | null;
  email: string | null;
  mobile: string;
  marital_status: string | null;
  next_of_kin_name: string | null;
  next_of_kin_relation: string | null;
  next_of_kin_contact: string | null;
  disability: string | null;
  disability_description: string | null;
  created_at: string | null;
  updated_at: string | null;
}
interface attachments{
  national_id: string | null;
  national_id_copy: string | null;
  qualification_copy: string | null;
  work_permit: string | null;
  proof_of_payment: string | null;
  created_at: string | null
  updated_at: string | null;
}

interface employment_details {
  id: number | null;
  national_id: string | null;
  experience_years: string | null;
  current_institution: string | null;
  institution_type: string | null;
  region: string | null;
  district: string | null;
  city_or_town: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface teacher_registrations {
  national_id: string | null;
  reg_number: string | null;
  reg_status: string | null;
  endorsement_status: string;
  rejection_reason: string | null;
  service_code: string | null;
  payment_ref: string | null;
  payment_amount: string | null;
  payment_name: string | null;
  application_id: string | null;
  license_link: string | null;
  education_bg_checks: string | null;
  flags_no: string | null;
  institution_verification: string | null;
  course_verification: string | null;
  license_status: string | null;
  pending_customer_action: string | null;
  registration_type: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface declarations {
  id: number | null;
  national_id: string | null;
  agreement: string | null;
  signature: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface offence_convictions {
  id: number | null;
  national_id: string | null;
  student_related_offence: string | null;
  student_related_offence_attachments: string | null;
  student_related_offence_details: string | null;
  drug_related_offence: string | null;
  drug_related_offence_attachments: string | null;
  drug_related_offence_details: string | null;
  license_flag: string | null;
  license_flag_details: string | null;
  misconduct_flag: string | null;
  misconduct_flag_details: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface edu_pro_qualifications{
  id: number | null;
  national_id: string | null;
  level: string | null;
  qualification: string | null;
  institution: string | null;
  attachments: string | null;
  qualification_year: string | null;
  minor_subjects: string | null;
  subjects?: string | null;
  major_subjects: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface teacher_preliminary_infos {
  id: number | null;
  national_id: string | null;
  citizen_status: string | null;
  work_status: string | null;
  practice_category: string | null;
  sub_category: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface background_checks{
  id: number | null,
  national_id: string | null,
  name: string | null,
  description: string | null,
  checked_by: string | null,
  created_at: string | null,
  updated_at: string | null
}

export interface TeacherRegistrationResponse {
  code: number;
  message: string;
  teacher_registrations?: teacher_registrations;
  teacher_preliminary_infos?: teacher_preliminary_infos;
  edu_pro_qualifications?: edu_pro_qualifications;
  other_qualifications?: edu_pro_qualifications[];
  bio_datas?: bio_datas;
  background_checks?: background_checks[];
  declarations?: declarations;
  offence_convictions?: offence_convictions;
  employment_details?: employment_details;
  attachments?: attachments;
}