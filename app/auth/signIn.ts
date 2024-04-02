

interface LoginCredentials {
    username: string; // Or email, adjust accordingly
    password: string;
}

interface LoginSuccessResponse {
    token?: string; // If your API returns a token
    // ... other relevant success data
}

interface LoginErrorResponse {
    message: string; // Common error property
    // ... other potential error details
}
const data = new FormData();
export async function signIn(strategy: string, formData: FormData): Promise<LoginSuccessResponse> { // Define the return type
    // console.log(JSON.stringify(Object.fromEntries(formData) as unknown))
    const response = await fetch('http://66.179.253.57/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(Object.fromEntries(formData) as unknown) // Add the type assertion
    });

    if (!response.ok) {
        const errorData: LoginErrorResponse = await response.json(); 
        throw new Error(errorData.message || 'Login failed');
    }

    const data: LoginSuccessResponse = await response.json(); // Type assertion
    return data; 
}