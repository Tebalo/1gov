export interface DeTokenizeResponse {
    exp: number;
    iat: number;
    jti: string;
    iss: string;
    aud: string;
    sub: string;
    typ: string;
    azp: string;
    session_state: string;
    name: string;
    given_name: string;
    family_name: string;
    preferred_username: string;
    email: string;
    email_verified: boolean;
    gender: string;
    acr: string;
    real_access: real_access;
    resource_access: resource_access;
    scope: string;
    sid: string;
    client_id: string;
    username: string;
    active: boolean;
    timestamp: string,
    code: number,
    message: string;
}

interface real_access {
    roles: string[]
}

interface resource_access {
    account: {
        roles: string[]
    }
}

export interface OTPResponse{
    message: string;
    access_token: string;
    expires_in: string;
    refresh_expires_in: string;
    refresh_token: string;
    token_type: string;
    id_token: string;
    session_state: string;
    scope: string;
    error: string;
    error_description: string;
    error_uri: string;
    timestamp: string;
    code: number;

}

interface field{
    fieldName: string,
    fieldLabel: string,
    valueType: string,
    fieldType: string
}

export interface Response{
    timestamp: string,
    username: string;
    name: string;
    code: number,
    api_uri: string;
    field: field;
    message: string;
}

interface OTPProps{
    username: string;
    password: string;
}