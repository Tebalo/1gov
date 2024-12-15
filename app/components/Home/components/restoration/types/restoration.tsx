export interface restoration {
    revocation_number: string | null,
    userid: string | null,
    sla: string | null,
    registration_number: string | null,
    current_employer: string | null,
    reason: string | null,
    reg_status: string | null,
    date_of_submission: string | null,
}

export interface RestorationListResponse {
    message?: string,
    code: number,
    applications?: restoration[]
}