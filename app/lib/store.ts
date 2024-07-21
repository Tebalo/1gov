export const apiUrl = 'http://10.0.25.164:8080/api';
export const apiUrl1 = 'http://74.208.205.44:8080/api';
export const licUrl = 'http://66.179.253.57:8081/api'
export const authUrlOLD = 'http://jwtauth.26digitaldev.com/api/';
export const authUrl = 'https://gateway-cus-acc.gov.bw/auth/login/sms';
export const iamURL = 'https://gateway-cus-acc.gov.bw';
export const otpUrl = 'https://gateway-cus-acc.gov.bw/auth/login/sms';
export const DeTokenizeUrl = 'https://gateway-cus-acc.gov.bw/auth/validate-token?token=';
export const validateUrl = 'https://gateway-cus-acc.gov.bw/auth/validate/otp';
export const cmsUrl = 'http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_001/';
export const secretKey = 'secret';
export const version = 'v1.01.99';

export interface StatusTransition {
    [key: string]: {
        prev_status: string | null;
        inv_status: string | null;
        bar_status: string | null;
        recommend: string | null,
        endorse: string | null,
        rej_status: string | null;
        next_status: string | null;
        reject_label: string | null;
        approve_label: string | null;
        recommend_label: string | null;
        endorse_label: string | null;
    };
}

export interface RoleObjects{
    [key: string]:{
        reg_application: boolean | false,
        lic_application: boolean | false,
        reg_Next_Status: string | null,
        lic_Next_Status: string | null,
        defaultWork: string | '',
    }
}

export const roleObjects: RoleObjects = {
    'registration_officer': {
        reg_application: true,
        lic_application: false,
        reg_Next_Status: 'Pending-Screening',
        lic_Next_Status: null,
        defaultWork: 'RegistrationApplication'
    },
    'license_officer': {
        reg_application: false,
        lic_application: true,
        reg_Next_Status: null,
        lic_Next_Status: 'Pending-Screening',
        defaultWork: 'licenseApplication'
    },
    'snr_registration_officer': {
        reg_application: true,
        lic_application: false,
        reg_Next_Status: 'Pending-Assessment',
        lic_Next_Status: null,
        defaultWork: 'RegistrationApplication'
    },
    'snr_license_officer': {
        reg_application: false,
        lic_application: true,
        reg_Next_Status: null,
        lic_Next_Status:'Pending-Assessment',
        defaultWork: 'licenseApplication'
    },
    'manager': {
        reg_application: true,
        lic_application: false,
        reg_Next_Status: 'Pending-Manager-Approval',
        lic_Next_Status: null,
        defaultWork: 'RegistrationApplication'
    },
    'license_manager': {
        reg_application: false,
        lic_application: true,
        reg_Next_Status: null,
        lic_Next_Status: 'Pending-Manager-Approval',
        defaultWork: 'licenseApplication'
    },
    'director': {
        reg_application: true,
        lic_application: true,
        reg_Next_Status: 'Pending-Endorsement',
        lic_Next_Status: 'Pending-Endorsement',
        defaultWork: 'RegistrationApplication'
    },
    'registrar': {
        reg_application: true,
        lic_application: true,
        reg_Next_Status: 'Endorsement-Recommendation',
        lic_Next_Status: 'Endorsement-Recommendation',
        defaultWork: 'RegistrationApplication'
    },
}
export const mgt = [
    'director', 
    'registrar'
]
export const statusTransitions: StatusTransition = {
    'Default': {
        prev_status: 'Default',
        inv_status: null,
        bar_status: null,
        rej_status: null,
        recommend: null,
        endorse: null,
        next_status: 'Default',
        reject_label: null,
        approve_label: null,
        recommend_label: null,
        endorse_label: null
    },
    'registration_officer': {
        prev_status: 'Pending-Customer-Action',
        inv_status: null,
        bar_status: null,
        rej_status: null,
        recommend: null,
        endorse: null,
        next_status: 'Pending-Assessment',
        reject_label: 'Return',
        approve_label: 'Pass-Screening',
        recommend_label: null,
        endorse_label: null
    },
    'license_officer': {
        prev_status: 'Pending-Customer-Action',
        inv_status: null,
        bar_status: null,
        rej_status: null,
        recommend: null,
        endorse: null,
        next_status: 'Pending-Assessment',
        reject_label: 'Return',
        approve_label: 'Pass-Screening',
        recommend_label: null,
        endorse_label: null
    },
    'snr_license_officer': {
        prev_status: null,
        inv_status: 'Pending-Investigation',
        bar_status: 'Barred',
        rej_status: 'Recommended-For-Rejection',
        recommend: null,
        endorse: null,
        next_status: 'Recommended-For-Approval',
        reject_label: 'Recommend For Rejection',
        approve_label: 'Recommend For Approval',
        recommend_label: null,
        endorse_label: null
    },
    'snr_registration_officer': {
        prev_status: null,
        inv_status: 'Pending-Investigation',
        bar_status: 'Barred',
        rej_status: 'Recommended-For-Rejection',
        recommend: null,
        endorse: null,
        next_status: 'Recommended-For-Approval',
        reject_label: 'Recommend For Rejection',
        approve_label: 'Recommend For Approval',
        recommend_label: null,
        endorse_label: null
    },
    'manager': {
        prev_status: 'Pending-Review',
        inv_status: null,
        bar_status: null,
        rej_status: 'Manager-Rejected',
        recommend: null,
        endorse: null,
        next_status: 'Manager-Approved',
        reject_label: 'Reject',
        approve_label: 'Approve',
        recommend_label: null,
        endorse_label: null
    },
    'license_manager': {
        prev_status: 'Pending-Review',
        inv_status: null,
        bar_status: null,
        rej_status: 'Manager-Rejected',
        recommend: null,
        endorse: null,
        next_status: 'Manager-Approved',
        reject_label: 'Reject',
        approve_label: 'Approve',
        recommend_label: null,
        endorse_label: null
    },
    'director': {
        prev_status: null,
        inv_status: null,
        bar_status: null,
        rej_status: null,
        recommend: 'Endorsement-Recommendation',
        endorse: null,
        next_status: null,
        reject_label: null,
        approve_label: null,
        recommend_label: 'Recommend',
        endorse_label: 'Endorse'
    },
    'registrar': {
        prev_status: null,
        inv_status: null,
        bar_status: null,
        rej_status: null,
        recommend: null,
        endorse: 'Endorsement-Complete',
        next_status: null,
        reject_label: null,
        approve_label: null,
        recommend_label: 'Recommend',
        endorse_label: 'Endorse'
    },
};

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
export const teacherLicenseSteps = [
    {
        id: 'Step 1',
        name: 'PRELIMINARY INFO',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 2',
        name: 'PROFILE INFO',
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
        name: 'PAYMENT',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 9',
        name: 'COMMENTS'
    },
    {
        id: 'Step 10',
        name: 'PREVIEW',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    }
]
export const teacherSteps = [
    {
        id: 'Step 1',
        name: 'PRELIMINARY INFO',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 2',
        name: 'PROFILE INFO',
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
        name: 'PAYMENT',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 9',
        name: 'COMMENTS'
    },
    {
        id: 'Step 10',
        name: 'PREVIEW',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    }
]

export const learnerSteps = [
    {
        id: 'Step 1',
        name: 'PRELIMINARY INFO',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 2',
        name: 'PERSONAL INFO',
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
        name: 'PAYMENT',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 7',
        name: 'COMMENTS'
    },
    {
        id: 'Step 8',
        name: 'PREVIEW'
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

