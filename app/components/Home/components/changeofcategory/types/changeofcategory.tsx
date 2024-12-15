export interface revocation {
    revocation_number: string | null,
    userid: string | null,
    sla: string | null,
    registration_number: string | null,
    current_employer: string | null,
    reason: string | null,
    reg_status: string | null,
    date_of_submission?: string | null,
}

export interface RevocationListResponse {
    message?: string,
    code: number,
    applications?: revocation[]
}