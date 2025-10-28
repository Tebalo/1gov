export interface Profile {
  username: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  surname: string;
  date_of_birth: string;
  citizenship: string;
  primary_email: string;
  primary_phone: string;
  primary_physical: string;
  primary_postal: string;
  gender: string;
  nationality: string;
}

export interface MisconductReportResponse {
  success: boolean;
  report_id?: string;
  error?: string;
}