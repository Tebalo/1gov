'use server'

export default async function getHistory(reg_number: string){
    const statuses = [
        { newStatus: "Pending-Review", timestamp: new Date('2023-10-31T10:20:00'), changedBy: 'Oaitse Segala' },
        { newStatus: "Pending-Screening", timestamp: new Date('2023-11-02T16:05:00'), changedBy: 'Masego Sam' },
        { newStatus: "Needs Additional Info", timestamp: new Date('2023-11-05T09:12:00'), changedBy: 'System' } // Example of a system-generated change
    ]
    //const res = await fetch('') // docs: fetching-caching-and-revalidating
    return statuses
  }

export async function getNext(){
    const res = await fetch('http://66.179.253.57/api/getNext/')
    
    const response = {
        "national_id": "558714915",
        "reg_number": "$2y$10$jbzHa2pL",
        "reg_status": "Pending-Review",
        "registration_type": "teacher",
        "created_at": "2024-03-07 18:46:50",
        "updated_at": "2024-03-07 18:46:50",
        "id": 20,
        "level": "diploma",
        "qualification": "refe",
        "institution": "dffd",
        "qualification_year": "345",
        "minor_subjects": "english",
        "major_subjects": "setswana",
        "attachments": "refe-558714915-20240307.pdf",
        "surname": "MORWE",
        "forenames": "LEAPEETSWE LEAH",
        "dob": "1995-02-17T00:00:00.000Z",
        "pob": "KANYE",
        "gender": "M",
        "nationality": "Motswana",
        "postal_address": "BOX  M1585 KANYE",
        "physical_address": "SEBELE  ",
        "email": "johndoe@gmail.com",
        "mobile": "26774217788",
        "marital_status": "Single",
        "next_of_kin_name": "Sarah Cornor",
        "next_of_kin_relation": "Mother",
        "next_of_kin_contact": "26776554321",
        "disability": "yes",
        "disability_description": "visual_impairment",
        "agreement": "1",
        "signature": null,
        "citizen_status": "Citizen",
        "work_status": "educational consultant",
        "practice_category": "primary",
        "sub_cateogry": null,
        "student_related_offence": "no",
        "student_related_offence_details": null,
        "drug_related_offence": "no",
        "drug_related_offence_details": null,
        "license_flag": "no",
        "license_flag_details": null,
        "misconduct_flag": "no",
        "misconduct_flag_details": null,
        "experience_years": 0,
        "current_institution": "marua_pula",
        "institution_type": null,
        "region": "gaborone",
        "district": "chobe",
        "city_or_town": "mahalapye"
    }    
    return res.json()
  }
