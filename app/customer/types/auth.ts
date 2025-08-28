export interface Payload {
    user_id: number
    exp: number
    roles: string[]
    baskets: any[] // You may want to define a specific type for basket items
    profile: {
      personal_info: {
        first_name: string
        middle_name: string | null
        last_name: string
        date_of_birth: string | null
        gender: string | null
        profile_picture: string | null
        bio: string | null
        national_id: string | null
        passport_id: string | null
        next_of_kin_name: string | null
        next_of_kin_relation: string | null
        next_of_kin_contacts: string | null
      }
      contact_info: {
        phone: string | null
        alt_phone: string | null
        email_verified: boolean
        postal_address: string | null
        physical_address: string | null
        city: string | null
        state: string | null
        country: string | null
        postal_code: string | null
      }
      account_security: {
        is_staff: boolean
        is_superuser: boolean
        is_approved: boolean
        two_factor_enabled: boolean
      }
      social_info: {
        linkedin_url: string | null
        github_url: string | null
        website_url: string | null
        job_title: string | null
        organization: string | null
      }
      preferences: {
        preferred_language: string
        timezone: string
      }
    }
}

export interface DecodedTokenResponse {
  payload: Payload
}