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

interface reporter {
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

export interface Investigation {
  reporter: reporter;
  complaint: complaint;
  offender: offender;
  investigation: investigation;
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


export interface ActivityPayload{
  activities: string;
  action_taken: string;
  record_type: string;
  record_id: number;
}

export interface TipOffResponse{
  message?: string;
  code: number;
  data?: data;
}