interface FieldInfo {
  label: string;
}

type FieldName = 
  // Bio Data / Personal Information
  | 'surname'
  | 'forenames'
  | 'dob'
  | 'pob'
  | 'gender'
  | 'nationality'
  | 'postal_address'
  | 'physical_address'
  | 'email'
  | 'mobile'
  | 'marital_status'
  | 'disability'
  | 'disability_description'
  
  // Teacher Preliminary Information
  | 'citizen_status'
  | 'practice_category'
  | 'sub_category'
  
  // Educational Professional Qualifications
  | 'edu_pro_level'
  | 'edu_pro_qualification'
  | 'edu_pro_institution'
  | 'edu_pro_qualification_year'
  | 'edu_pro_minor_subjects'
  | 'edu_pro_major_subjects'
  | 'edu_pro_subjects'
  
  // Other Qualifications
  | 'other_level'
  | 'other_qualification'
  | 'other_institution'
  | 'other_qualification_year'
  | 'other_minor_subjects'
  | 'other_major_subjects'
  
  // Declarations
  | 'agreement'
  | 'signature'
  
  // Offence Convictions
  | 'student_related_offence'
  | 'student_related_offence_details'
  | 'student_related_offence_attachments'
  | 'drug_related_offence'
  | 'drug_related_offence_details'
  | 'drug_related_offence_attachments'
  | 'license_flag'
  | 'license_flag_details'
  | 'misconduct_flag'
  | 'misconduct_flag_details'
  
  // Employment Details
  | 'experience_years'
  | 'current_institution'
  | 'institution_type'
  | 'region'
  | 'city_or_town'
  
  // Attachments/Documents
  | 'national_id_copy'
  | 'qualification_copy'
  | 'work_permit'
  | 'proof_of_payment'
  | 'invoice'
  | 'edu_pro_attachments'
  | 'other_attachments'
  | 'attachments'
  
  // System Fields
  | 'national_id'
  
  // Legacy fields
  | 'primary_email'

const FIELD_MAP: Record<FieldName, FieldInfo> = {
  // Bio Data / Personal Information
  'surname': {
    label: 'Surname'
  },
  'forenames': {
    label: 'Forenames'
  },
  'dob': {
    label: 'Date of Birth'
  },
  'pob': {
    label: 'Place of Birth'
  },
  'gender': {
    label: 'Gender'
  },
  'nationality': {
    label: 'Nationality'
  },
  'postal_address': {
    label: 'Postal Address'
  },
  'physical_address': {
    label: 'Physical Address'
  },
  'email': {
    label: 'Email Address'
  },
  'mobile': {
    label: 'Mobile Number'
  },
  'marital_status': {
    label: 'Marital Status'
  },
  'disability': {
    label: 'Disability Status'
  },
  'disability_description': {
    label: 'Disability Description'
  },
  
  // Teacher Preliminary Information
  'citizen_status': {
    label: 'Citizen Status'
  },
  'practice_category': {
    label: 'Practice Category'
  },
  'sub_category': {
    label: 'Sub Category'
  },
  
  // Educational Professional Qualifications
  'edu_pro_level': {
    label: 'Educational Professional Level'
  },
  'edu_pro_qualification': {
    label: 'Educational Professional Qualification'
  },
  'edu_pro_institution': {
    label: 'Educational Professional Institution'
  },
  'edu_pro_qualification_year': {
    label: 'Educational Professional Qualification Year'
  },
  'edu_pro_minor_subjects': {
    label: 'Educational Professional Minor Subjects'
  },
  'edu_pro_major_subjects': {
    label: 'Educational Professional Major Subjects'
  },
  'edu_pro_subjects': {
    label: 'Educational Professional Subjects'
  },
  
  // Other Qualifications
  'other_level': {
    label: 'Other Qualification Level'
  },
  'other_qualification': {
    label: 'Other Qualification'
  },
  'other_institution': {
    label: 'Other Qualification Institution'
  },
  'other_qualification_year': {
    label: 'Other Qualification Year'
  },
  'other_minor_subjects': {
    label: 'Other Minor Subjects'
  },
  'other_major_subjects': {
    label: 'Other Major Subjects'
  },
  
  // Declarations
  'agreement': {
    label: 'Agreement'
  },
  'signature': {
    label: 'Signature'
  },
  
  // Offence Convictions
  'student_related_offence': {
    label: 'Student Related Offence'
  },
  'student_related_offence_details': {
    label: 'Student Related Offence Details'
  },
  'student_related_offence_attachments': {
    label: 'Student Related Offence Attachments'
  },
  'drug_related_offence': {
    label: 'Drug Related Offence'
  },
  'drug_related_offence_details': {
    label: 'Drug Related Offence Details'
  },
  'drug_related_offence_attachments': {
    label: 'Drug Related Offence Attachments'
  },
  'license_flag': {
    label: 'License Flag'
  },
  'license_flag_details': {
    label: 'License Flag Details'
  },
  'misconduct_flag': {
    label: 'Misconduct Flag'
  },
  'misconduct_flag_details': {
    label: 'Misconduct Flag Details'
  },
  
  // Employment Details
  'experience_years': {
    label: 'Years of Experience'
  },
  'current_institution': {
    label: 'Current Institution'
  },
  'institution_type': {
    label: 'Institution Type'
  },
  'region': {
    label: 'Region'
  },
  'city_or_town': {
    label: 'City or Town'
  },
  
  // Attachments/Documents
  'national_id_copy': {
    label: 'National ID Copy'
  },
  'qualification_copy': {
    label: 'Qualification Copy'
  },
  'work_permit': {
    label: 'Work Permit'
  },
  'proof_of_payment': {
    label: 'Proof of Payment'
  },
  'invoice': {
    label: 'Invoice'
  },
  'edu_pro_attachments': {
    label: 'Educational Professional Qualification Attachments'
  },
  'other_attachments': {
    label: 'Other Qualification Attachments'
  },
  'attachments': {
    label: 'Mandatory Qualifications Attachment'
  },
  
  // System Fields
  'national_id': {
    label: 'National ID'
  },
  
  // Legacy fields
  'primary_email': {
    label: 'Email'
  },
};

export function getFieldLabel(fieldName: string): FieldInfo {
  return FIELD_MAP[fieldName as FieldName] || {
    label: fieldName
  };
}