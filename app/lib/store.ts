export const apiUrl = 'http://74.208.205.44/api';
export const authUrl = 'http://localhost:8000/api';
export const secretKey = 'secret';


const citizenOptions = [
    {label: 'Citizen', value: 'citizen'},
    {label: 'Non-citizen', value: 'non_citizen'},
]

const institutionOptions = [
    {label: 'Private', value: 'private'},
    {label: 'Public', value: 'public'},
]

const statusOptions = [
    {label: 'Student-Teacher', value: 'student'},
    {label: 'Unemployed', value: 'unemployed'},
    {label: 'Serving', value: 'serving'},
    {label: 'Retired', value: 'retired'},
]

const areaOfPractice = [
    {label: 'Select...', value: ''},
    {label: 'Pre-primary', value: 'student'},
    {label: 'Primary', value: 'primary'},
    {label: 'Junior Secondary', value: 'junior_secondary'},
    {label: 'Secondary', value: 'secondary'},
]

const regionOptions = [
    {label: 'Select...', value: ''},
    {label: 'Chobe', value: 'Chobe'},
    {label: 'Central', value: 'Central'},
    {label: 'City of Francistown', value: 'City of Francistown'},
    {label: 'Gaborone', value: 'Gaborone'},
    {label: 'Ghanzi', value: 'Ghanzi'},
    {label: 'Jwaneng', value: 'Jwaneng'},
    {label: 'Kgalagadi', value: 'Kgalagadi'},
    {label: 'Kgatleng', value: 'Kgatleng'},
    {label: 'Kweneng', value: 'Kweneng'},
    {label: 'Lobatse', value: 'Lobatse'},
    {label: 'Ngwaketsi', value: 'Ngwaketsi'},
    {label: 'North-East', value: 'North-East'},
    {label: 'North-West', value: 'North-West'},
    {label: 'Selibe Phikwe', value: 'Selibe Phikwe'},
    {label: 'South-East', value: 'South-East'},
    {label: 'Sowa Town', value: 'Sowa Town'},
]

const districtOptions = [
    {label: 'Select...', value: ''},
    {label: 'Chobe District', value: 'Chobe District'},
    {label: 'Ghanzi District', value: 'Ghanzi District'},
    {label: 'Kgalagadi District', value: 'Kgalagadi District'},
    {label: 'Kgatleng District', value: 'Kgatleng District'},
    {label: 'Kweneng District', value: 'Kweneng District'},
    {label: 'North-East District', value: 'North-East District'},
    {label: 'Ngamiland District', value: 'Ngamiland District'},
    {label: 'South-East District', value: 'South-East District'},
    {label: 'Southern District', value: 'Southern District'},
]

const yearsOptions = [
    {value:"2024"},
    {value:"2023"},
    {value:"2022"},
    {value:"2021"},
    {value:"2020"},
    {value:"2019"},
    {value:"2018"},
    {value:"2017"},
    {value:"2016"},
    {value:"2015"},
]
const placeOptions = [
    {label: 'Select...', value: ''},
    {label: 'Gaborone', value: 'Gaborone'},
    {label: 'Maun', value: 'Maun'},
    {label: 'Orapa', value: 'Orapa'},
    {label: 'Gantsi', value: 'Lobatse'},
    {label: 'Letlhakane', value: 'Letlhakane'},
    {label: 'Mopipi', value: 'Mopipi'},
    {label: 'Jwaneng', value: 'Jwaneng'},
    {label: 'Serowe', value: 'Serowe'},
    {label: 'Palapye', value: 'Palapye'},
]

const employmentOptions = [
    {label: 'Employed', value: 'employed'},
    {label: 'Un-Employed', value: 'un-employed'},
]

const disabilityOptions = [
    {label: 'Yes', value: 'yes'},
    {label: 'No', value: 'no'},
]

const convitionOptions = [
    {label: 'Yes', value: 'yes'},
    {label: 'No', value: 'no'},
]


const registrationCategory = [
    {label: 'Select...', value: ''},
    {label: 'Teacher Aide', value: 'Teacher Aide'},
    {label: 'Early Childhood Teacher', value: 'Early Childhood Teacher'},
    {label: 'Primary School Teacher', value: 'Primary School Teacher'},
    {label: 'Junior Secondary Teacher', value: 'Junior Secondary Teacher'},
    {label: 'Senior Secondary Teacher', value: 'Senior Secondary Teacher'},
    {label: 'Special Education/Guidance and Counselling Teacher', value: 'Special Education/Guidance and Counselling Teacher'},
    {label: 'Education Administrator', value: 'Education Administrator'},
]

export const users = [
    {
        national_id: "936510813",
        surname: "Serala",
        middlename: "Masego",
        forenames: "Oaitse",
        dob: "1996-02-15",
        pob: "Mahalapye",
        gender: "Male",
        nationality: "Motswana",
        postal_address: "P O Box 7886, Mahalapye",
        physical_address: "Block 10, Gaborone",
        email: "johndoe@gmail.com",
        mobile: "26774217788",
        marital_status: "Single",
        next_of_kin_name: "Sarah Cornor",
        next_of_kin_relation: "Mother",
        next_of_kin_contact: "26776554321"
    },
    {
        national_id: "440418213",
        surname: "Bopaki",
        middlename: "",
        forenames: "Tebalo",
        dob: "1996-02-15",
        pob: "Orapa",
        gender: "Male",
        nationality: "Motswana",
        postal_address: "P O Box 48, Mopipi",
        physical_address: "Block 10, Gaborone",
        email: "btebalo@gmail.com",
        mobile: "26774217788",
        marital_status: "Single",
        next_of_kin_name: "Sarah Cornor",
        next_of_kin_relation: "Mother",
        next_of_kin_contact: "26776554321"
    }
]

export const steps = [
    {
        id: 'Step 1',
        name: 'PRELIMINARY INFO',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 2',
        name: 'BIO DATA',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 3',
        name: 'EMPLOYMENT',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 4',
        name: 'QUALIFICATIONS',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 5',
        name: 'DISABILITY',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 6',
        name: 'OFFENCE',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 7',
        name: 'ATTACHMENTS',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 8',
        name: 'DECLARATION',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 9',
        name: 'PREVIEW'
    },
    {
        id: 'Step 10',
        name: 'COMPLETE'
    },
]

export const studentSteps = [
    {
        id: 'Step 1',
        name: 'PRELIMINARY INFO',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 2',
        name: 'BIO DATA',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 3',
        name: 'STUDY PROGRAMME',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 4',
        name: 'DECLARATION',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 5',
        name: 'RECOMMENDATION',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 6',
        name: 'PREVIEW'
    },
    {
        id: 'Step 7',
        name: 'COMPLETE'
    },
]

export const hiddenSteps = [
    {
        id: 'Step 1',
        name: 'PRELIMINARY INFO',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 2',
        name: '--------------------',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 3',
        name: '--------------------',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 4',
        name: '--------------------',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 5',
        name: '--------------------'
    },
    {
        id: 'Step 6',
        name: '--------------------'
    },
]

export const Region = ["Gaborone", "Francistowm", "Palapye"] as const;
export const District = ["Chobe District", "Ghanzi District", "Ngamiland District", "Kgatleng District", "Kweneng District", "South-East District"] as const;
export const Place = ["Gaborone","Francistown","Maun","Palapye","Mahalapye","Serowe","Orapa","Gantsi","Jwaneng"] as const; 

export const institutions = [
    {
        value: "Letlhakane Senior School",
        region: "Central",
        district: "Central",
        city_or_town: "Letlhakane",
        label: "Letlhakane Senior School"
    },
    {
        value: "Maru-a-pula Senior School",
        region: "South-East",
        district: "South-East District",
        city_or_town: "Gaborone",
        label: "Maru-a-pula Senior School"
    },
    {
        value: "Maun Senior School",
        region: "South-East",
        district: "Ngamiland District",
        city_or_town: "Maun",
        label: "Maun Senior School"
    },
]

