
interface profile {
    id: number ,
    userid: string | null,
    first_name: string | null,
    middle_name: string | null,
    surname: string | null,
    primary_email: string | null,
    primary_phone: string | null,
    primary_physical: string | null,
    primary_postal: string | null,
    gender: string | null,
    nationality: string | null,
    created_at: string | null,
    updated_at: string | null,
}

export interface revocation {
    id: number | null,
    revocation_number: string | null,
    userid: string | null,
    sla: string | null,
    registration_number: string | null,
    current_employer: string | null,
    application_id: string | null,
    employer_contact: string | null,
    declaration: string | null,
    profile_data_consent: boolean,
    reason: string | null,
    reg_status: string | null,
    created_at: string | null,
    updated_at: string | null,
}

export interface RevocationResponse {
    code: number,
    message?: string,
    revocation?: revocation,
    profile?: profile
}