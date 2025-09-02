"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image';
// import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { SignInInput, signInSchema } from "../validations/auth"
import { toast, useToast } from "@/components/ui/use-toast"
import { DecodedTokenResponse } from "../types/auth"
import { storeAccessGroups, storeSession } from "@/app/auth/auth"
import { AuthResponse, DecodedToken } from "@/app/lib/types"
import { storeAuthData } from "@/app/staff/login/components/email-login"
import { ToastAction } from "@/components/ui/toast"

// Auth API configuration
const AUTH_API_URL = "https://twosixdigitalbw.com/v1/api/auth_microservice/login/"
const DECODE_API_URL = "https://twosixdigitalbw.com/v1/api/auth_microservice/decode-token/"

interface LocalAuthResponse {
  access: string
  refresh: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState(String)
  const router = useRouter()
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true)

    try {
      // Step 1: Authenticate with external service
      const localAuthResponse = await fetch(AUTH_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.email,
          password: data.password,
        }),
      })

      if (!localAuthResponse.ok) {
        // toast.error("Login Failed", {
        //   description: "Invalid email or password. Please try again."
        // })
        setFieldErrors("Invalid email or password");
        console.error
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          action: (
            <ToastAction altText="Ok">Ok</ToastAction>
          ),
        });
        return
      }

      const authData: LocalAuthResponse = await localAuthResponse.json()

      const authResponse: AuthResponse = {
        message: "Login successful",
        access_token: authData.access,
        expires_in: "3600", // Assuming 1 hour expiration;
        refresh_expires_in: "604800", // Assuming 7 days expiration;
        refresh_token: authData.refresh,
        token_type: "Bearer",
        id_token: "", // Assuming no ID token is returned;
        session_state: "session-state-id", // Assuming a session state ID is returned;
        scope: "openid profile email", // Assuming scopes are returned;
        error: "",
        error_description: null,
        error_uri: null,
        code: null,
        'not-before-policy': ""
      }

      await storeSession(authResponse);
      await storeAuthData(authResponse);

      // Step 2: Decode the token to get user info
      const decodeResponse = await fetch(DECODE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: authData.access,
        }),
      })

      if (!decodeResponse.ok) {
        // toast.error("Login Failed", {
        //   description: "Invalid email or password. Please try again."
        // })
        toast({
          title: "Login Failed",
          description: "Server error. Please try again later.",
          action: (
            <ToastAction altText="Ok">Ok</ToastAction>
          ),
        });
        
        return
      }

      const decodedData: DecodedTokenResponse = await decodeResponse.json()
      const sessionData = decodedData.payload

      // Step 3: Create user data object
      const userData = {
        id: sessionData.user_id,
        email: sessionData.profile.contact_info.email_verified, 
              // sessionData.profile.contact_info.email : null, // Email might not be in contact_info
        name: sessionData.profile.personal_info.first_name + " " + sessionData.profile.personal_info.last_name,
        role: sessionData.roles[0] || "customer", // Default to first role
        roles: sessionData.roles,
        externalUserId: sessionData.user_id.toString(),
        expires: sessionData.exp,
        sessionToken: authData.access,
        profile: {
          personal_info: {
            first_name: sessionData.profile.personal_info.first_name,
            middle_name: sessionData.profile.personal_info.middle_name,
            last_name: sessionData.profile.personal_info.last_name,
            date_of_birth: sessionData.profile.personal_info.date_of_birth,
            gender: sessionData.profile.personal_info.gender,
            profile_picture: sessionData.profile.personal_info.profile_picture,
            bio: sessionData.profile.personal_info.bio,
            national_id: sessionData.profile.personal_info.national_id,
            passport_id: sessionData.profile.personal_info.passport_id,
            next_of_kin_name: sessionData.profile.personal_info.next_of_kin_name,
            next_of_kin_relation: sessionData.profile.personal_info.next_of_kin_relation,
            next_of_kin_contacts: sessionData.profile.personal_info.next_of_kin_contacts
          },
          contact_info: {
            phone: sessionData.profile.contact_info.phone,
            alt_phone: sessionData.profile.contact_info.alt_phone,
            email_verified: sessionData.profile.contact_info.email_verified,
            postal_address: sessionData.profile.contact_info.postal_address,
            physical_address: sessionData.profile.contact_info.physical_address,
            city: sessionData.profile.contact_info.city,
            state: sessionData.profile.contact_info.state,
            country: sessionData.profile.contact_info.country,
            postal_code: sessionData.profile.contact_info.postal_code
          },
          account_security: {
            is_staff: sessionData.profile.account_security.is_staff,
            is_superuser: sessionData.profile.account_security.is_superuser,
            is_approved: sessionData.profile.account_security.is_approved,
            two_factor_enabled: sessionData.profile.account_security.two_factor_enabled
          },
          social_info: {
            linkedin_url: sessionData.profile.social_info.linkedin_url,
            github_url: sessionData.profile.social_info.github_url,
            website_url: sessionData.profile.social_info.website_url,
            job_title: sessionData.profile.social_info.job_title,
            organization: sessionData.profile.social_info.organization
          },
          preferences: {
            preferred_language: sessionData.profile.preferences.preferred_language,
            timezone: sessionData.profile.preferences.timezone
          }
        },
        baskets: sessionData.baskets
      }
      const profile:DecodedToken = {
        exp: Date.now() + 60 * 60 * 1000, // 1 hour expiration
        iat: Date.now(),
        jti: "unique-jti", // Generate a unique JTI;
        iss: "https://twosixdigitalbw.com/v1/api/auth_microservice",
        aud: "1gov1citizen",
        sub: sessionData.user_id.toString(), 
        typ: "Bearer",
        azp: "1gov1citizen",
        session_state: "session-state-id",
        name: sessionData.profile.personal_info.first_name + " " + sessionData.profile.personal_info.last_name,
        given_name: sessionData.profile.personal_info.first_name,
        family_name: sessionData.profile.personal_info.last_name,
        preferred_username: String(sessionData.profile.contact_info.email_verified || ""), // Use email_verified as username;
        email: String(sessionData.profile.contact_info.email_verified ?? ""), // Use email_verified as email;
        email_verified: sessionData.profile.contact_info.email_verified ?? false, // Ensure email_verified is boolean;
        gender: sessionData.profile.personal_info.gender ?? "not specified", // Default to "not;
        acr: "1",
        realm_access: {
          roles: ["CUSTOMER"], 
        },
        resource_access: {
          account: {
            roles: ["CUSTOMER"], 
          }
        },
        scope: "openid profile email",
        sid: "session-id", 
        client_id: String(sessionData.user_id || 1), // Use client_id from sessionData
        username: String(sessionData.profile.contact_info.email_verified || ""), // Use email_verified as username;
        active: true, // Assuming the user is active;
      }
      // await storeSession(authResponse);
      // await storeAuthData(authResponse);
      await storeAccessGroups(profile);

      // Step 4: Store tokens and user data
      sessionStorage.setItem('access_token', authData.access)
      sessionStorage.setItem('refresh_token', authData.refresh)
      sessionStorage.setItem('user_data', JSON.stringify(userData))

      // Step 5: Set cookies for server-side access
      const cookieOptions = {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const
      }

      // Set access token cookie
      document.cookie = `access_token=${authData.access}; path=/; max-age=${cookieOptions.maxAge}; ${cookieOptions.secure ? 'secure;' : ''} samesite=${cookieOptions.sameSite}`
      
      // Set user data cookie 
      document.cookie = `user_data=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=${cookieOptions.maxAge}; ${cookieOptions.secure ? 'secure;' : ''} samesite=${cookieOptions.sameSite}`

      // Step 6: 🔥 SYNC USER BEFORE REDIRECT
      console.log('🚀 Starting user sync...')
      // console.log('User data to sync:', {
      //   externalUserId: userData.externalUserId,
      //   role: userData.role,
      //   email: userData.email,
      //   name: userData.name
      // })

      try {
        // const syncResponse = await fetch('/api/v1/auth/sync-user', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'x-user-id': userData.externalUserId,
        //     'x-user-role': userData.role,
        //     'x-user-email': userData.email || '',
        //     'x-user-name': userData.profile.personal_info.first_name + ' ' + userData.profile.personal_info.last_name,
        //     'x-access-token': authData.access
        //   } as HeadersInit
        // })

        // console.log('📡 Sync response status:', syncResponse.status)
        
        // if (syncResponse.ok) {
        //   const syncData = await syncResponse.json()
        //   // console.log('✅ User synced successfully:', syncData.user)
          
        //   // Update userData with synced information
        //   const updatedUserData = {
        //     ...userData,
        //     workBaskets: syncData.user.workBaskets,
        //     availableRoles: syncData.user.roles,
        //     localUserId: syncData.user.id
        //   }
          
        //   // console.log('📝 Updated user data:', updatedUserData)
          
        //   // Update sessionStorage with synced data
        //   sessionStorage.setItem('user_data', JSON.stringify(updatedUserData))
          
        //   // Also update cookie
        //   document.cookie = `user_data=${encodeURIComponent(JSON.stringify(updatedUserData))}; path=/; max-age=${cookieOptions.maxAge}; ${cookieOptions.secure ? 'secure;' : ''} samesite=${cookieOptions.sameSite}`
          
        // } else {
        //   const errorData = await syncResponse.json()
        //   console.error('❌ User sync failed:', syncResponse.status, errorData)
        // }
      } catch (syncError) {
        console.error('💥 User sync error:', syncError)
      }

      // Step 7: Success notification
      // toast.success("Login Successful", {
      //   description: `Welcome back, ${sessionData.profile.personal_info.first_name}!`,
      // })

      // Step 8: 🔥 FIXED - Role-based redirect with fallbacks
      const userRoles = sessionData.roles || []
      let redirectPath = "/customer/dashboard" // Default fallback
      
      console.log('🚀 Redirecting to:', redirectPath)
      router.push(redirectPath)
      router.refresh()

    } catch (error) {
      console.error("Login error:", error)
      // toast.error("Login Failed", {
      //   description: error instanceof Error ? error.message : "Invalid email or password. Please try again."
      // })
        toast({
          title: "Login Failed",
          description: "Server error. Please try again later.",
          action: (
            <ToastAction altText="Ok">Ok</ToastAction>
          ),
        });
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <p className="text-sm text-center text-destructive">{fieldErrors}</p>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="...@mail.com"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
              onClick={(e) => {
                e.preventDefault()
                toast({
                  title: "Password Reset",
                  description: "Password reset functionality will be available in the next version.",
                  action: (
                    <ToastAction altText="Ok">Ok</ToastAction>
                  ),
                });
              }}
            >
              Forgot your password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              className={errors.password ? "border-destructive pr-10" : "pr-10"}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
        {/* Login button */}
        <Button 
        // type="submit" 
        onClick={handleSubmit(onSubmit)} 
        className="w-full" 
        disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

         {/* Login with 1Gov1Citizen */}
        <Button variant="outline" className="w-full">
          <div className="w-6 h-6 items-center justify-center flex mr-2">
            <Image
                src="/gov_icon.png"
                alt='Coat-of-arms'
                width={24}
                height={24}
                className="w-full h-full object-contain"
                priority
                />
            </div>
          Login with 1Gov
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/customer/signup" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
