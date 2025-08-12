'use client'

import { useState } from "react"
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import axios from 'axios'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { AlertCircle, CheckCircle2, EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { AuthResponse, DecodedToken } from "@/app/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { storeAccessGroups, storeSession } from "../../auth/admin-auth"
import { adminAuthUrl, AdminDeTokenizeUrl } from "@/app/lib/store"
import { jwtDecode } from "jwt-decode"

// Auth endpoints
// const authUrl = "https://gateway-cus-acc.gov.bw/auth/login/sms"
// const DeTokenizeUrl = "https://gateway-cus-acc.gov.bw/auth/validate-token?token="

// Create axios instance with default config
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': 'PostmanRuntime/7.43.0'
    },
    timeout: 10000 // 10 second timeout
})

const FormSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(1, { message: 'Password is required' })
})

// Create a reusable loading component
const LoadingState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-center text-sm">{message}</p>
    </div>
)

// Store auth data
export const storeAuthData = (authData: AuthResponse): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authData', JSON.stringify(authData));
    }
  } catch (error) {
    console.error('Error storing auth data:', error);
  }
};

// Get auth data
export const getAuthData = (): AuthResponse | null => {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('authData');
      return data ? JSON.parse(data) as AuthResponse : null;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving auth data:', error);
    return null;
  }
};

export const Admin: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const router = useRouter()
    
    const [authState, setAuthState] = useState({
      isStoringSession: false,
      isDecryptingSession: false,
      isRedirecting: false
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          username: '',
          password: ''
        }
    })

    const MAX_RETRIES = 3;
    const INITIAL_DELAY = 1000; // 1 second

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        
        let retryCount = 0;
    
        const attemptLogin = async (): Promise<any> => {
            try {
                const response = await axiosInstance.post(adminAuthUrl, {
                    username: data.username,
                    password: data.password
                });
                return response;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    // Don't retry for auth errors
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        throw error;
                    }
                    
                    // Check if we should retry
                    if (retryCount < MAX_RETRIES) {
                        retryCount++;
                        const delay = INITIAL_DELAY * Math.pow(2, retryCount - 1); // Exponential backoff
                        console.log(`Retry attempt ${retryCount} after ${delay}ms`);
                        
                        // Update loading message to show retry attempt
                        setErrorMessage(`Connection failed. Retrying... (${retryCount}/${MAX_RETRIES})`);
                        
                        await new Promise(resolve => setTimeout(resolve, delay));
                        return attemptLogin();
                    }
                }
                throw error;
            }
        };
    
        try {
            const response = await attemptLogin();
            const authResponse = response.data as AuthResponse;
            
            // Show success message
            setSuccessMessage('Login successful!');
            
            // Handle auth flow
            setAuthState({
              isStoringSession: true,
              isDecryptingSession: false,
              isRedirecting: false
            });
            
            // Store auth data
            await storeSession(authResponse);
            await storeAuthData(authResponse);
            
            setAuthState({
              isStoringSession: false,
              isDecryptingSession: true,
              isRedirecting: false
            });

            const attemptDeTokenize = (): DecodedToken => {
            try {
                const decodedToken: DecodedToken = jwtDecode(authResponse.access_token);
                
                if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
                throw new Error('Token has expired');
                }
                
                return decodedToken;
            } catch (error) {
                throw new Error('Failed to decode authentication token');
            }
            };
            
            // Process token
            try {
                // const deTokenizeResponse = await axiosInstance.post(
                //   `${AdminDeTokenizeUrl}${authResponse.access_token}`
                // );
                // const profile = deTokenizeResponse.data as DecodedToken;

                const profile = await attemptDeTokenize();
                await storeAccessGroups(profile);
                
                setAuthState({
                  isStoringSession: false,
                  isDecryptingSession: false,
                  isRedirecting: true
                });
                
                // Redirect to home after successful login
                setTimeout(() => {
                    router.push('/admin/app/roles');
                }, 1000);
                
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                      error.response?.data?.message ||
                      'Failed to decrypt access token'
                    );
                } else {
                    setErrorMessage('An error occurred during token decryption.');
                }
                
                setAuthState({
                  isStoringSession: false,
                  isDecryptingSession: false,
                  isRedirecting: false
                });
            }
            
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setErrorMessage('Invalid credentials. Please check your username and password.');
                } else if (retryCount === MAX_RETRIES) {
                    setErrorMessage(`Failed to connect after ${MAX_RETRIES} attempts. Please try again later.`);
                } else {
                    setErrorMessage(error.response?.data?.message || 'Login failed. Please try again!');
                }
            } else {
                setErrorMessage('Server error. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    
    const { isStoringSession, isDecryptingSession, isRedirecting } = authState;
  
    if (isStoringSession || isDecryptingSession || isRedirecting) {
      const message = isStoringSession
        ? "Saving session..."
        : isDecryptingSession
          ? "Decrypting access token..."
          : "Redirecting to the home page...";
  
      return <LoadingState message={message} />;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                    {/* Status Messages */}
                    {errorMessage && (
                      <Alert variant="destructive" className="animate-in fade-in-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}
                    
                    {successMessage && (
                      <Alert variant="default" className="border-green-500 bg-green-50 animate-in fade-in-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-600">Success</AlertTitle>
                        <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
                      </Alert>
                    )}
                    
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Admin Username</FormLabel>
                                <FormControl>
                                    <Input 
                                    placeholder="Enter admin username" 
                                    type="text" 
                                    className="border-2 border-slate-300"
                                    {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your password"
                                            className="border-2 border-slate-300"
                                            type={showPassword ? "text" : "password"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-4 w-4" />
                                        ) : (
                                            <EyeIcon className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full mt-2 bg-red-500 hover:bg-red-400"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Authenticating...
                            </span>
                        ) : (
                            'Login to Admin Panel'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}