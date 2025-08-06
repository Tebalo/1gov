// Private Primary Schools in Botswana
export const privatePrimarySchools = [
  "Acacia School",
  "African International School",
  "Bright Kids Academy",
  "Cambridge International Academy",
  "Crescent International School",
  "Discovery School",
  "Excel International School",
  "Fountain Gate School",
  "Future Leaders Academy",
  "Genesis Academy",
  "Grace International School",
  "Heritage International School",
  "Hillcrest International School",
  "Holy Cross School",
  "Islamia Primary School",
  "Kgale International School",
  "Legacy International School",
  "Light Academy",
  "Livingstone Kolobeng College Primary",
  "Maru-a-Pula School Primary",
  "New Horizon International School",
  "Northside Primary School",
  "Pioneer International School",
  "Rainbow International School",
  "Regent International School",
  "Royal Oak School",
  "Sahel International School",
  "St. Joseph's College Primary",
  "Star International School",
  "Stepping Stones International School",
  "Sunny Side Primary School",
  "The Bridge International Academy",
  "Thorntree School",
  "Unity International School",
  "Westwood International School",
  "Wisdom International School"
];

// Private Secondary Schools in Botswana
export const privateSecondarySchools = [
  "African International School",
  "Cambridge International Academy",
  "Crescent International School",
  "Discovery School",
  "Excel International School",
  "Fountain Gate School",
  "Grace International School",
  "Heritage International School",
  "Hillcrest International School",
  "Holy Cross School",
  "Islamia Secondary School",
  "Kgale International School",
  "Legacy International School",
  "Light Academy",
  "Livingstone Kolobeng College",
  "Maru-a-Pula School",
  "New Horizon International School",
  "Northside Secondary School",
  "Pioneer International School",
  "Rainbow International School",
  "Regent International School",
  "Royal Oak School",
  "Sahel International School",
  "St. Joseph's College",
  "Star International School",
  "Stepping Stones International School",
  "The Bridge International Academy",
  "Thorntree School",
  "Unity International School",
  "Westwood International School",
  "Wisdom International School",
  "Gaborone International School",
  "Maun International School",
  "Francistown International School",
  "Lobatse International Academy",
  "Serowe International College"
];

// Combined list of all private schools (Primary and Secondary merged)
export const allPrivateSchools = [
  "Acacia School",
  "African International School",
  "Bright Kids Academy",
  "Cambridge International Academy",
  "Crescent International School",
  "Discovery School",
  "Excel International School",
  "Fountain Gate School",
  "Francistown International School",
  "Future Leaders Academy",
  "Gaborone International School",
  "Genesis Academy",
  "Grace International School",
  "Heritage International School",
  "Hillcrest International School",
  "Holy Cross School",
  "Islamia Primary School",
  "Islamia Secondary School",
  "Kgale International School",
  "Legacy International School",
  "Light Academy",
  "Livingstone Kolobeng College",
  "Livingstone Kolobeng College Primary",
  "Lobatse International Academy",
  "Maru-a-Pula School",
  "Maru-a-Pula School Primary",
  "Maun International School",
  "New Horizon International School",
  "Northside Primary School",
  "Northside Secondary School",
  "Pioneer International School",
  "Rainbow International School",
  "Regent International School",
  "Royal Oak School",
  "Sahel International School",
  "Serowe International College",
  "St. Joseph's College",
  "St. Joseph's College Primary",
  "Star International School",
  "Stepping Stones International School",
  "Sunny Side Primary School",
  "The Bridge International Academy",
  "Thorntree School",
  "Unity International School",
  "Westwood International School",
  "Wisdom International School",
  'Other'
];

// Formatted for Select components
export const privatePrimarySchoolsForSelect = privatePrimarySchools.map(school => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school
}));

export const privateSecondarySchoolsForSelect = privateSecondarySchools.map(school => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school
}));

export const allPrivateSchoolsForSelect = allPrivateSchools.map(school => ({
  value: school.replace(/\s+/g, '-').replace(/['']/g, ''),
  label: school
}));

// Categorized structure
export const privateSchoolsByLevel = {
  primary: privatePrimarySchools,
  secondary: privateSecondarySchools,
  all: allPrivateSchools
};