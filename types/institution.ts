const institutions = [
    "Molepolole College of Education",
    "Serowe College of Education",
    "Tlokweng College of Education",
    "Tonota College of Education",
    "Institute of Development Management (IDM)",
    "University of Botswana",
    "BA ISAGO University",
    "Botswana Open University",
    "BOTHO University",
    "Botswana University of Agriculture and Natural Resources (BUAN)",
    "Other"
]

export const institutionForSelect = institutions.map((institution) => ({
  value: institution.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
  label: institution
}));