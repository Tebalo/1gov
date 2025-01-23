'use client'

import { useEffect, useState } from "react"
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

import { storeSession, storeAccessGroups, getAccessGroups, getSession } from "@/app/auth/auth"
import { AlertCircle, CheckCircle2, Clock, EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { AuthResponse, DecodedToken } from "@/app/lib/types"
import { authUrl, DeTokenizeUrl, validateUrl } from "@/app/lib/store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

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
interface InputOTPControlledProps {
    username: string;
    password: string;
  }
  
const InputOTPControlled: React.FC<InputOTPControlledProps> = ({ username, password }) => {
    const [value, setValue] = useState("");
    const [isOtpLoading, setIsOtpLoading] = useState(false);
    const [isResendLoading, setIsResendLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(0);
    const router = useRouter();
  
    const [authState, setAuthState] = useState({
      isStoringSession: false,
      isDecryptingSession: false,
      isRedirecting: false
    });
  
    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      }
      return () => clearTimeout(timer);
    }, [countdown]);
  
    const handleOtpSubmit = async () => {
      setIsOtpLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
  
      try {
        const validateResponse = await axiosInstance.post(validateUrl, {
          username,
          otp: value
        });
  
        setAuthState({
          isStoringSession: true,
          isDecryptingSession: false,
          isRedirecting: false
        });
  
        const authResponse = await validateResponse.data as AuthResponse;

        await storeSession(authResponse);

        setAuthState({
          isStoringSession: false,
          isDecryptingSession: true,
          isRedirecting: false
        });
  
        const MAX_RETRIES = 3;
        const INITIAL_DELAY = 1000;
        let retryCount = 0;
  
        const attemptDeTokenize = async (): Promise<DecodedToken> => {
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
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(error.response?.data?.message || 'OTP validation failed. Please try again');
        } else {
          setErrorMessage('An error occurred during OTP validation. Please try again.');
        }
      } finally {
        setIsOtpLoading(false);
      }
    };
  
    const handleResendOTP = async () => {
      setIsResendLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
  
      let retryCount = 0;
      const MAX_RETRIES = 3;
      const INITIAL_DELAY = 1000;
  
      const attemptResend = async (): Promise<any> => {
        try {
          const response = await axiosInstance.post(authUrl, {
            username,
            password
          });
          return response;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 401 || error.response?.status === 403) {
              throw error;
            }
            
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              const delay = INITIAL_DELAY * Math.pow(2, retryCount - 1);
              setErrorMessage(`Connection failed. Retrying... (${retryCount}/${MAX_RETRIES})`);
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
        setErrorMessage(null);
        setSuccessMessage('OTP resent successfully.');
        setCountdown(60); // Start 60-second countdown
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
      <div className="space-y-6">
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
  
        {/* OTP Input */}
        <div className="space-y-4">
          <div className="w-full flex flex-col items-center gap-4">
            <InputOTP
              maxLength={6}
              value={value}
              onChange={setValue}
              className="gap-2"
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className={cn(
                      "w-10 h-12 text-center text-lg border-2 transition-all duration-200",
                      value[index] && "border-sky-500 ring-sky-500",
                      errorMessage && "border-red-500 ring-red-500"
                    )}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
              Enter first 6 digit of your cellphone number registered with 1gov
              </p>
              {countdown > 0 && (
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" />
                  Resend available in {countdown} seconds
                </p>
              )}
            </div>
          </div>
  
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full"
              onClick={handleOtpSubmit}
              disabled={isOtpLoading || value.length !== 6}
            >
              {isOtpLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying code...
                </span>
              ) : (
                'Verify Code'
              )}
            </Button>
  
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendOTP}
              disabled={isResendLoading || countdown > 0}
            >
              {isResendLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending new code...
                </span>
              ) : (
                'Resend Code'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

export const Email: React.FC = () => {
    const [authResponse, setAuthResponse] = useState<AuthResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues:{
          email: '',
          password: ''
        }
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
                                        {/* <FormLabel>1Gov ID</FormLabel> */}
                                        <FormControl>
                                            <Input 
                                            placeholder="Enter your 1gov ID" 
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
                                        {/* <FormLabel>Password</FormLabel> */}
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
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Authenticating...' : 'Submit'}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <span>Don&lsquo;t have an account?</span>{" "}
                        <a 
                        href="https://1gov.gov.bw/welcome" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:text-primary/90">
                            Sign up
                        </a>
                    </div>
                </Form>
            ) : (
                <InputOTPControlled 
                username={email} 
                password={password} />
            )}
        </>
    )
}