export interface revocation {
    id: number | null,
    revocation_number: string | null,
    userid: string | null,
    sla: string | null,
    registration_number: string | null,
    current_employer: string | null,
    employer_contact: string | null;
    declaration: string | null;
    application_id: string | null;
    profile_data_consent: boolean;
    reason: string | null,
    reg_status: string | null,
    date_of_submission?: string | null,
    created_at: string | null;
    updated_at: string | null;
}

export interface RevocationListResponse {
    message?: string,
    code: number,
    applications?: revocation[]
}