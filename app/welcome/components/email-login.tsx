'use client'

import { useState } from "react"
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"

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

import { login, validateOTP, DeTokenize, storeSession } from "@/app/auth/auth"


import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { AuthResponse } from "@/app/lib/types"
import { authUrl, validateUrl } from "@/app/lib/store"

const FormSchema = z.object({
    email: z.string(),
    password: z.string().min(1, { message: 'Password is required' })
})

const InputOTPControlled: React.FC<{ username: string; password: string }> = ({ username, password }) => {
    const [value, setValue] = useState("")
    const [isOtpLoading, setIsOtpLoading] = useState(false)
    const [isResendLoading, setIsResendLoading] = useState(false)
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [isStoringSession, setIsStoringSession] = useState(false)
    
    const router = useRouter()

    const handleOtpSubmit = async () => {
        setIsOtpLoading(true)
        setErrorMessage(null)
        setSuccessMessage(null)
        try {
            const response = await fetch(`${validateUrl}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({username, otp: value})
            });
            const data = await response.json();
            
            if (response.ok) {
                setIsStoringSession(true)
                const authResponse = data as AuthResponse;
                await storeSession(authResponse);
                setIsStoringSession(false)
                setIsRedirecting(true)
                router.push('/trls/home')
            } else {
                setErrorMessage(data.message || 'OTP validation failed. Please try again')
            }
        } catch (error) {
            console.error('OTP validation error:', error)
            setErrorMessage('An error occurred during OTP validation. Please try again.')
        } finally {
            setIsOtpLoading(false)
        }
    }

    const handleResendOTP = async () => {
        setIsResendLoading(true)
        setErrorMessage(null)
        setSuccessMessage(null)
        try {
            const response = await fetch(`${authUrl}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });
            if(response.ok){
                setSuccessMessage('OTP resent successfully.')
                setValue("")
            } else{
                const data = await response.json();
                setErrorMessage(data.message || 'Failed to resend OTP. Please try again.')
            }
        } catch (error) {
            console.error('Resend OTP error:', error)
            setErrorMessage('Failed to resend OTP. Please try again.')
        } finally {
            setIsResendLoading(false)
        }
    }
    if (isStoringSession) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-center text-sm">Saving session...</p>
            </div>
        )
    }
    if (isRedirecting) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-center text-sm">Redirecting to home page...</p>
            </div>
        )
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

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setIsLoading(true)
        
        const payload = {
            username: data.email,
            password: password
        }
        try {
            const response = await fetch(`${authUrl}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if(response.ok){
                setAuthResponse(data)
            } else {
                setErrorMessage(data.message || 'Log in failed')
            }
            
        } catch (error) {
            console.error('Login error:', error)
            setErrorMessage('Server error');
        } finally {
            setIsLoading(false)
        }
    }

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
                            {errorMessage && <p className="text-red-600 text-sm">Invalid user credentials</p>}
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