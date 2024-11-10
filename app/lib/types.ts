export type AuthenticateResult =
  | { status: 'success' }
  | { status: 'failed'; message: string };

export type UserRole = 'MANAGER' | 'REGISTRATION_OFFICER' | 'SNR_REGISTRATION_OFFICER' | 'DIRECTOR' | 'REGISTRAR' | 'LICENSE_OFFICER' | 'SNR_LICENSE_OFFICER' | 'LICENSE_MANAGER'|'INVESTIGATIONS_OFFICER'| 'INVESTIGATIONS_MANAGER'| 'SENIOR_INVESTIGATIONS_OFFICER' | 'ADMIN';


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
  passport_no: string | null;
  occupation: string | null;
  sex: string | null;
  nationality: string | null;
  address: string | null;
  reg_status: string | null;
  inquiry_number: string | null;
  case_number: string | null;
  anonymous: string | null;
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
  bif_number: string | null;
  case_number: string | null;
  fir_number: string | null;
  outcome: string | null;
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
  occupation: string | null;
  place_of_work: string | null;
  id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

interface investigation {
  investigating_officer: string | null;
  police_station: string | null;
  cr_number: string | null;
  offence: string | null;
  outcome: string | null;
  id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

interface preliminary_investigation {
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
  full_name: string;
  phone: string;
  identity_No: string;
  email: string;
  nature_of_crime: string;
  description: string;
  crime_location: string;
  tipoff_number: string;
  id: number;
}

export interface TipOffListResponse{
  code: number;
  data?: data[];
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