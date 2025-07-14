// Primary Education Qualifications
export const primaryQualifications = [
  "Standard 7 Certificate",
  "Primary School Leaving Certificate (PSLC)"
];

// Junior Secondary Education Qualifications
export const juniorSecondaryQualifications = [
  "Junior Certificate (JC)",
  "Form 3 Certificate"
];

// Senior Secondary Education Qualifications
export const seniorSecondaryQualifications = [
  "Botswana General Certificate of Secondary Education (BGCSE)",
  "International General Certificate of Secondary Education (IGCSE)",
  "Cambridge International Examinations (CIE)",
  "Advanced Subsidiary Level (AS Level)",
  "Advanced Level (A Level)",
  "International Baccalaureate (IB) Diploma"
];

// Technical and Vocational Education and Training (TVET) Qualifications
export const tvetQualifications = [
  "National Certificate Level 1",
  "National Certificate Level 2", 
  "National Certificate Level 3",
  "National Certificate Level 4",
  "National Certificate Level 5",
  "National Diploma",
  "Higher National Diploma (HND)",
  "Botswana Technical Education Programme (BTEP) Certificate",
  "City & Guilds Certificate",
  "Automotive Engineering Certificate",
  "Building and Construction Certificate",
  "Business Studies Certificate",
  "Electrical Engineering Certificate",
  "Hospitality and Tourism Certificate",
  "Information Technology Certificate",
  "Mechanical Engineering Certificate",
  "Plumbing Certificate",
  "Welding and Fabrication Certificate"
];

// University of Botswana Qualifications
export const universityOfBotswanaQualifications = [
  "Certificate in Education",
  "Diploma in Education",
  "Diploma in Primary Education",
  "Diploma in Secondary Education",
  "Diploma in Agricultural Extension",
  "Diploma in Business Administration",
  "Diploma in Computer Science",
  "Diploma in Engineering",
  "Diploma in Environmental Science",
  "Diploma in Nursing",
  "Diploma in Social Work",
  "Bachelor of Arts (BA)",
  "Bachelor of Science (BSc)",
  "Bachelor of Education (BEd)",
  "Bachelor of Commerce (BCom)",
  "Bachelor of Engineering (BEng)",
  "Bachelor of Laws (LLB)",
  "Bachelor of Medicine and Surgery (MBChB)",
  "Bachelor of Nursing Science",
  "Bachelor of Social Work",
  "Bachelor of Theology",
  "Postgraduate Diploma in Education (PGDE)",
  "Master of Arts (MA)",
  "Master of Science (MSc)",
  "Master of Education (MEd)",
  "Master of Business Administration (MBA)",
  "Master of Engineering (MEng)",
  "Master of Laws (LLM)",
  "Master of Philosophy (MPhil)",
  "Doctor of Philosophy (PhD)",
  "Doctor of Medicine (MD)"
];

// Botswana International University of Science and Technology (BIUST) Qualifications
export const biustQualifications = [
  "Certificate in Engineering",
  "Diploma in Engineering",
  "Bachelor of Engineering (BEng) - Chemical Engineering",
  "Bachelor of Engineering (BEng) - Civil Engineering", 
  "Bachelor of Engineering (BEng) - Computer Engineering",
  "Bachelor of Engineering (BEng) - Electrical Engineering",
  "Bachelor of Engineering (BEng) - Industrial Engineering",
  "Bachelor of Engineering (BEng) - Mechanical Engineering",
  "Bachelor of Science (BSc) - Applied Mathematics and Statistics",
  "Bachelor of Science (BSc) - Computer Science",
  "Bachelor of Science (BSc) - Geology",
  "Bachelor of Science (BSc) - Physics",
  "Master of Engineering (MEng)",
  "Master of Science (MSc)",
  "Doctor of Philosophy (PhD)"
];

// Botswana University of Agriculture and Natural Resources (BUAN) Qualifications
export const buanQualifications = [
  "Certificate in Agriculture",
  "Diploma in Agriculture",
  "Diploma in Animal Science",
  "Diploma in Environmental Science",
  "Diploma in Natural Resources Management",
  "Bachelor of Science in Agriculture (BSc Agric)",
  "Bachelor of Science in Animal Science",
  "Bachelor of Science in Environmental Science",
  "Bachelor of Science in Forestry",
  "Bachelor of Science in Natural Resources Management",
  "Bachelor of Science in Wildlife Management",
  "Master of Science in Agriculture (MSc Agric)",
  "Master of Science in Natural Resources Management",
  "Doctor of Philosophy (PhD)"
];

// Limkokwing University Qualifications
export const limkokwingQualifications = [
  "Diploma in Graphic Design",
  "Diploma in Interior Architecture",
  "Diploma in Fashion Design",
  "Diploma in Digital Media Design",
  "Diploma in Business Administration",
  "Bachelor of Arts in Creative Multimedia",
  "Bachelor of Arts in Fashion Design",
  "Bachelor of Arts in Interior Architecture",
  "Bachelor of Business Administration",
  "Bachelor of Computer Science",
  "Master of Business Administration (MBA)",
  "Master of Arts"
];

// Teaching Qualifications (Education Specific)
export const teachingQualifications = [
  "Primary Teachers Certificate (PTC)",
  "Secondary Teachers Certificate (STC)", 
  "Diploma in Primary Education",
  "Diploma in Secondary Education",
  "Bachelor of Education (Primary)",
  "Bachelor of Education (Secondary)",
  "Postgraduate Diploma in Education (PGDE)",
  "Master of Education (MEd)",
  "Doctor of Education (EdD)"
];

// Professional Qualifications
export const professionalQualifications = [
  "Certified Public Accountant (CPA) Botswana",
  "Association of Chartered Certified Accountants (ACCA)",
  "Chartered Institute of Management Accountants (CIMA)",
  "Law Society of Botswana Certificate",
  "Institute of Engineers Botswana Certificate",
  "Botswana Institute of Chartered Accountants (BICA)",
  "Project Management Professional (PMP)",
  "Certified Information Systems Auditor (CISA)"
];

// All Qualifications (merged from all categories)
export const allBotswanaQualifications = [
  ...primaryQualifications,
  ...juniorSecondaryQualifications,
  ...seniorSecondaryQualifications,
  ...tvetQualifications,
  ...universityOfBotswanaQualifications,
  ...biustQualifications,
  ...buanQualifications,
  ...limkokwingQualifications,
  ...teachingQualifications,
  ...professionalQualifications
];

// Formatted for Select components
export const allBotswanaQualificationsForSelect = allBotswanaQualifications.map((qualification) => ({
  value: qualification.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  label: qualification,
}));

export const primaryQualificationsForSelect = primaryQualifications.map((qualification) => ({
  value: qualification.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  label: qualification,
}));

export const juniorSecondaryQualificationsForSelect = juniorSecondaryQualifications.map((qualification) => ({
  value: qualification.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  label: qualification,
}));

export const seniorSecondaryQualificationsForSelect = seniorSecondaryQualifications.map((qualification) => ({
  value: qualification.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  label: qualification,
}));

export const tvetQualificationsForSelect = tvetQualifications.map((qualification) => ({
  value: qualification.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  label: qualification,
}));

export const universityOfBotswanaQualificationsForSelect = universityOfBotswanaQualifications.map((qualification) => ({
  value: qualification.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  label: qualification,
}));

export const biustQualificationsForSelect = biustQualifications.map((qualification) => ({
  value: qualification.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  label: qualification,
}));

export const buanQualificationsForSelect = buanQualifications.map((qualification) => ({
  value: qualification.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  label: qualification,
}));

export const limkokwingQualificationsForSelect = limkokwingQualifications.map((qualification) => ({
  value: qualification.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  label: qualification,
}));

export const teachingQualificationsForSelect = teachingQualifications.map((qualification) => ({
  value: qualification.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  label: qualification,
}));

export const professionalQualificationsForSelect = professionalQualifications.map((qualification) => ({
  value: qualification.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  label: qualification,
}));