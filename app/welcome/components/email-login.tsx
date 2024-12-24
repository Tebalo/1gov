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
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import { storeSession, storeAccessGroups } from "@/app/auth/auth"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { AuthResponse, DecodedToken } from "@/app/lib/types"
import { authUrl, DeTokenizeUrl, validateUrl } from "@/app/lib/store"

// Create axios instance with default config
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Connection':'keep-alive',
        'Accept':'*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent':'PostmanRuntime/7.43.0'
    },
    timeout: 10000 // 10 second timeout
})

const FormSchema = z.object({
    email: z.string(),
    password: z.string().min(1, { message: 'Password is required' })
})

// Create a reusable loading component
const LoadingState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-center text-sm">{message}</p>
    </div>
)

const InputOTPControlled: React.FC<{ username: string; password: string }> = ({ username, password }) => {
    const [value, setValue] = useState("")
    const [isOtpLoading, setIsOtpLoading] = useState(false)
    const [isResendLoading, setIsResendLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const router = useRouter()

    const [authState, setAuthState] = useState({
        isStoringSession: false,
        isDecryptingSession: false,
        isRedirecting: false
    })

    const handleOtpSubmit = async () => {
        setIsOtpLoading(true)
        setErrorMessage(null)
        setSuccessMessage(null)

        try {
            const validateResponse = await axiosInstance.post(validateUrl, {
                username,
                otp: value
            })

            setAuthState({
                isStoringSession: true,
                isDecryptingSession: false,
                isRedirecting: false
            })

            const authResponse = validateResponse.data as AuthResponse
            await storeSession(authResponse)

            setAuthState({
                isStoringSession: false,
                isDecryptingSession: true,
                isRedirecting: false
            })

            const MAX_RETRIES = 3;
            const INITIAL_DELAY = 1000; // 1 second
            let retryCount = 0;
            // Define the function type before the implementation
            const attemptDeTokenize: () => Promise<DecodedToken> = async () => {
                try {
                    const deTokenizeResponse = await axiosInstance.post(
                        `${DeTokenizeUrl}${authResponse.access_token}`,
                        { username, otp: value }
                    );
                    return deTokenizeResponse.data;
                } catch (error) {
                    if (retryCount < MAX_RETRIES) {
                        retryCount++;
                        const backoffDelay = INITIAL_DELAY * Math.pow(2, retryCount - 1);
                        console.log(`Retry attempt ${retryCount} after ${backoffDelay}ms`);
                        setErrorMessage(`Decryption failed. Retrying... (${retryCount}/${MAX_RETRIES})`);
                        await new Promise(resolve => setTimeout(resolve, backoffDelay));
                        return attemptDeTokenize();
                    }
                    throw error;
                }
            };
            
            try {
                const profile = await attemptDeTokenize();
                await storeAccessGroups(profile);
            
                setAuthState({
                    isStoringSession: false,
                    isDecryptingSession: false,
                    isRedirecting: true
                });
            
                router.push('/trls/home');
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.data?.message || 
                        `Failed to decrypt access token after ${MAX_RETRIES} attempts`
                    );
                } else {
                    setErrorMessage('An error occurred during token decryption.');
                }
            }
            
            try {
                const profile = await attemptDeTokenize();
                await storeAccessGroups(profile);
            
                setAuthState({
                    isStoringSession: false,
                    isDecryptingSession: false,
                    isRedirecting: true
                });
            
                router.push('/trls/home');
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.data?.message || 
                        `Failed to decrypt access token after ${MAX_RETRIES} attempts`
                    );
                } else {
                    setErrorMessage('An error occurred during token decryption.');
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || 'OTP validation failed. Please try again')
            } else {
                setErrorMessage('An error occurred during OTP validation. Please try again.')
            }
        } finally {
            setIsOtpLoading(false)
        }
    }

    const MAX_RETRIES = 3;
    const INITIAL_DELAY = 1000; // 1 second
    
    const handleResendOTP = async () => {
        setIsResendLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        
        let retryCount = 0;
    
        const attemptResend = async (): Promise<any> => {
            try {
                const response = await axiosInstance.post(authUrl, {
                    username,
                    password
                });
                return response;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    // Don't retry for authentication errors
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        throw error;
                    }
                    
                    // Check if we should retry
                    if (retryCount < MAX_RETRIES) {
                        retryCount++;
                        const delay = INITIAL_DELAY * Math.pow(2, retryCount - 1);
                        console.log(`Retry attempt ${retryCount} after ${delay}ms`);
                        
                        // Update error message to show retry attempt
                        setErrorMessage(`Connection failed. Retrying to resend OTP... (${retryCount}/${MAX_RETRIES})`);
                        
                        await new Promise(resolve => setTimeout(resolve, delay));
                        return attemptResend();
                    }
                }
                throw error;
            }
        };
    
        try {
            const response = await attemptResend();
            setValue("");
            setErrorMessage(null)
            setSuccessMessage('OTP resent successfully.');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setErrorMessage('Session expired. Please log in again.');
                } else if (retryCount === MAX_RETRIES) {
                    setErrorMessage(`Failed to resend OTP after ${MAX_RETRIES} attempts. Please try again later.`);
                } else {
                    setErrorMessage(error.response?.data?.message || 'Failed to resend OTP. Please try again!');
                }
            } else {
                setErrorMessage('Server error. Please try again later.');
            }
        } finally {
            setIsResendLoading(false);
        }
    };
    const { isStoringSession, isDecryptingSession, isRedirecting } = authState

    if (isStoringSession || isDecryptingSession || isRedirecting) {
        const message = isStoringSession
            ? "Saving session..."
            : isDecryptingSession
                ? "Decrypting access token..."
                : "Redirecting to the home page..."

        return <LoadingState message={message} />
    }

    return (
        <div className="space-y-4">
            {errorMessage && (
                <p className="text-sm text-center text-red-600">{errorMessage}</p>
            )}
            {successMessage && (
                <p className="text-sm text-center text-green-600">{successMessage}</p>
            )}
            <div className="w-full flex justify-center">
                <InputOTP maxLength={6} value={value} onChange={setValue}>
                    <InputOTPGroup>
                        {[...Array(6)].map((_, index) => (
                            <InputOTPSlot key={index} index={index} />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
            </div>
            <p className="text-center text-sm">
                Enter your one-time password.
            </p>
            <div className="space-y-2">
                <Button
                    type="submit"
                    className="w-full"
                    onClick={handleOtpSubmit}
                    disabled={isOtpLoading || value.length !== 6}
                >
                    {isOtpLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Validating...
                        </>
                    ) : 'Submit OTP'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResendOTP}
                    disabled={isResendLoading}
                >
                    {isResendLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resending...
                        </>
                    ) : 'Resend OTP'}
                </Button>
            </div>
        </div>
    )
}

export const Email: React.FC = () => {
    const [authResponse, setAuthResponse] = useState<AuthResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })

    const MAX_RETRIES = 3;
    const INITIAL_DELAY = 1000; // 1 second

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setIsLoading(true);
        setErrorMessage(null);
        
        let retryCount = 0;
        let lastError = null;
    
        const attemptLogin = async (): Promise<any> => {
            try {
                const response = await axiosInstance.post(authUrl, {
                    username: data.email,
                    password: data.password
                });
                return response;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    // Don't retry for certain error status codes
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
            setAuthResponse(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.response?.data?.message);
                if (error.response?.status === 401) {
                    setErrorMessage('Invalid credentials. Please check your email and password.');
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

    const { email, password } = form.watch()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <>
            {(!authResponse || authResponse.error) ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>1Gov ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your 1gov ID" type="text" {...field} />
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
                                                    placeholder="Enter password"
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
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Authenticating...' : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </Form>
            ) : (
                <InputOTPControlled username={email} password={password} />
            )}
        </>
    )
}