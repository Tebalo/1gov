// Regions array
export const regions = [
  "Central",
  "Chobe",
  "Ghanzi",
  "Kgalagadi",
  "Kgatleng",
  "Kweneng",
  "North East",
  "North West",
  "South East",
  "Southern"
];

// Sub-regions array (all merged into one)
export const subRegions = [
  // Central sub-regions
  "Shoshong",
  "Palapye",
  "Mahalapye",
  "Serowe",
  "Tonota",
  "Sefhare",
  "Boteti",
  "Bobirwa",
  "Tutume",
  "Selibe Phikwe",
  
  // Chobe sub-regions
  "Chobe",
  
  // Ghanzi sub-regions
  "Gantsi",
  "Charleshill",
  
  // Kgalagadi sub-regions
  "Tsabong",
  "Hukuntsi",
  
  // Kgatleng sub-regions
  "Kgatleng",
  
  // Kweneng sub-regions
  "Lentsweletau",
  "Molepolole",
  "Letlhakeng",
  "Mogoditshane/Thamaga",
  
  // North East sub-regions
  "Francistown",
  "Masunga",
  
  // North West sub-regions
  "Shakawe",
  "Maun",
  "Gumare",
  
  // Southern sub-regions
  "Goodhope",
  "Jwaneng/ Mabutsane",
  "Kanye",
  "Lobatse",
  "Moshupa",
  
  // South East sub-regions
  "Gaborone",
  "South East"
];

// Structured data with regions and their sub-regions
export const regionsWithSubRegions = {
  "Central": [
    "Shoshong",
    "Palapye",
    "Mahalapye",
    "Serowe",
    "Tonota",
    "Sefhare",
    "Boteti",
    "Bobirwa",
    "Tutume",
    "Selibe Phikwe"
  ],
  "Chobe": [
    "Chobe"
  ],
  "Ghanzi": [
    "Gantsi",
    "Carleshill"
  ],
  "Kgalagadi": [
    "Tsabong",
    "Hukuntsi"
  ],
  "Kgatleng": [
    "Kgatleng"
  ],
  "Kweneng": [
    "Lentsweletau",
    "Molepolole",
    "Letlhakeng",
    "Mogoditshane/Thamaga"
  ],
  "North East": [
    "Francistown",
    "Masunga"
  ],
  "North West": [
    "Shakawe",
    "Maun",
    "Gumare"
  ],
  "Southern": [
    "Goodhope",
    "Jwaneng/ Mabutsane",
    "Kanye",
    "Lobatse",
    "Moshupa"
  ],
  "South East": [
    "Gaborone",
    "South East"
  ]
};

// Alternative format with value/label structure for form components
export const regionsForSelect = regions.map(region => ({
  value: region.replace(/\s+/g, '-'),
  label: region
}));

export const subRegionsForSelect = subRegions.map(subRegion => ({
  value: subRegion.replace(/\s+/g, '-').replace(/\//g, '-'),
  label: subRegion
}));