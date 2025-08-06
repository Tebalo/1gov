// Central Region Senior Secondary Schools
export const centralSeniorSecondarySchools = [
  "Lotsane",
  "Moeng College",
  "Madiba",
  "Selibe Phikwe",
  "Matshekge",
  "Mmadinare",
  "Letlhakane",
  "Shashe",
  "Tutume Mcconnell",
  "Nata",
  "Shoshong",
  "Swaneng"
];

// Chobe Region Senior Secondary Schools
export const chobeSeniorSecondarySchools: string[] = [];

// Ghanzi Region Senior Secondary Schools
export const ghanziSeniorSecondarySchools = [
  "Gantsi"
];

// Kgalagadi Region Senior Secondary Schools
export const kgalagadiSeniorSecondarySchools = [
  "Matsha College"
];

// Kgatleng Region Senior Secondary Schools
export const kgatlengSeniorSecondarySchools = [
  "Molefi"
];

// Kweneng Region Senior Secondary Schools
export const kwenengSeniorSecondarySchools = [
  "Mogoditshane",
  "Kgari Sechele"
];

// North East Region Senior Secondary Schools
export const northEastSeniorSecondarySchools = [
  "Francistown Senior",
  "Materspei College",
  "Masunga Senior"
];

// North West Region Senior Secondary Schools
export const northWestSeniorSecondarySchools = [
  "Shakawe",
  "Maun"
];

// South East Region Senior Secondary Schools
export const southEastSeniorSecondarySchools = [
  "Gaborone",
  "Ledumang",
  "Naledi",
  "St Joseph's College",
  "Moeding College",
  "Kagiso"
];

// Southern Region Senior Secondary Schools
export const southernSeniorSecondarySchools = [
  "Moshupa",
  "Lobatse",
  "GoodHope",
  "Seepapitso"
];

// All Senior Secondary Schools (merged from all regions)
export const allSeniorSecondarySchools = [
  ...centralSeniorSecondarySchools,
  ...chobeSeniorSecondarySchools,
  ...ghanziSeniorSecondarySchools,
  ...kgalagadiSeniorSecondarySchools,
  ...kgatlengSeniorSecondarySchools,
  ...kwenengSeniorSecondarySchools,
  ...northEastSeniorSecondarySchools,
  ...northWestSeniorSecondarySchools,
  ...southEastSeniorSecondarySchools,
  ...southernSeniorSecondarySchools,
  'Other'
];

// Formatted for Select components
export const allSeniorSecondarySchoolsForSelect = allSeniorSecondarySchools.map((school) => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school,
}));

export const centralSeniorSecondarySchoolsForSelect = centralSeniorSecondarySchools.map((school) => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school,
}));

export const chobeSeniorSecondarySchoolsForSelect = chobeSeniorSecondarySchools.map((school) => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school,
}));

export const ghanziSeniorSecondarySchoolsForSelect = ghanziSeniorSecondarySchools.map((school) => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school,
}));

export const kgalagadiSeniorSecondarySchoolsForSelect = kgalagadiSeniorSecondarySchools.map((school) => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school,
}));

export const kgatlengSeniorSecondarySchoolsForSelect = kgatlengSeniorSecondarySchools.map((school) => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school,
}));

export const kwenengSeniorSecondarySchoolsForSelect = kwenengSeniorSecondarySchools.map((school) => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school,
}));

export const northEastSeniorSecondarySchoolsForSelect = northEastSeniorSecondarySchools.map((school) => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school,
}));

export const northWestSeniorSecondarySchoolsForSelect = northWestSeniorSecondarySchools.map((school) => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school,
}));

export const southEastSeniorSecondarySchoolsForSelect = southEastSeniorSecondarySchools.map((school) => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school,
}));

export const southernSeniorSecondarySchoolsForSelect = southernSeniorSecondarySchools.map((school) => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school,
}));