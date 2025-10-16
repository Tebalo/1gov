interface FieldInfo {
  label: string;
}

type FieldName = 
  | 'national_id_copy'
  | 'student_related_offence_details'
  | 'student_related_offence_attachments'
  | 'drug_related_offence_details'
  | 'drug_related_offence_attachments'
  | 'attachments'
  | 'misconduct_flag_details'
  | 'license_flag_details'
  | 'primary_email'

const FIELD_MAP: Record<FieldName, FieldInfo> = {
  'primary_email':{
    label: 'Email'
  },
  'national_id_copy': {
    label: 'National ID attachment',
  },
  'student_related_offence_details':{
    label: 'Student related offence details'
  },
  'student_related_offence_attachments': {
    label: 'Student related offence attachment',
  },
  'drug_related_offence_details':{
    label: 'Drug related offence details'
  },
  'drug_related_offence_attachments': {
    label: 'Drug related offence attachment',
  },
  'misconduct_flag_details':{
    label: 'Misconduct flag details'
  },
  'license_flag_details':{
    label: 'License flag details'
  },
  'attachments': {
    label: 'Mandatory qualifications attachment',
  },
};

export function getFieldLabel(fieldName: string): FieldInfo {
  return FIELD_MAP[fieldName as FieldName] || {
    label: fieldName
  };
}