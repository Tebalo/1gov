'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { login, validateOTP, DeTokenize } from "@/app/auth/auth"
import { useState } from "react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"

import * as React from "react"
import { redirect } from "next/dist/server/api-utils"
interface field{
    fieldName: string,
    fieldLabel: string,
    valueType: string,
    fieldType: string
}
interface Response{
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

interface OTPResponse{
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

interface real_access {
    roles: string[]
}

interface resource_access {
    account: {
        roles: string[]
    }
}

interface DeTokenizeResponse {
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

export const InputOTPControlled: React.FC<OTPProps> = ({username, password}) => {
    const [value, setValue] = React.useState("")
    const [isOtpLoading, setIsOtpLoading] = useState(false);
    const [response, setOTPResponse] = useState<OTPResponse | null>(null)
    const [access, setAccess] = useState<Response | null>(null)
    const [detokenizedAccessToken, setDetokenizedAccessToken] = useState<DeTokenizeResponse | null>(null)

    async function onOtpSubmit(otp: string){
        setIsOtpLoading(true)

        const res = await validateOTP(username, otp);

        if(res){
            await setOTPResponse(res)
            
            if(response?.access_token){
                const token = await DeTokenize(response?.access_token);
                console.log('token',token)
                await setDetokenizedAccessToken(token)
                // redirect('/trls/home')
            }
            setIsOtpLoading(false)
        }
    }
    async function onSubmit(){
        setOTPResponse(null)
        setIsOtpLoading(true)
        const formData = new FormData();
        
        formData.append('username', username);
        formData.append('password', password);

        const res = await login(formData); // json respons
        console.log(res) // print json response
        if(res){
            setAccess(res || null) // setting
            setIsOtpLoading(false)
        }
    }
    return (
      <div className="space-y-2">
        <div className="w-full flex justify-center">
            {response ? (<span className="text-red-600 text-sm">{response?.code === 400 && response.message}</span>):(<></>) }
        </div>
        <div className="w-full flex justify-center">
            <div>
                <InputOTP
                maxLength={6}
                value={value}
                onChange={(value) => setValue(value)}
                
                >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
                </InputOTP>
            </div>
        </div>
        <div className="text-center text-sm">
          {value === "" ? (
            <>Enter your one-time password.</>
          ) : (
            <>You entered: {value}</>
          )}
        </div>
        <div className="flex justify-end">
            {response?.code === undefined && <Button type="submit" className="w-full" onClick={async () => await onOtpSubmit(value)} disabled={isOtpLoading}>{isOtpLoading ? (<>validating...</>): (<>Submit</>)}</Button>}
            {response?.code === 400 && <Button type="submit" className="w-full" onClick={async () => await onSubmit()} disabled={isOtpLoading}>{isOtpLoading ? (<>validating...</>): (<>Resent OTP</>)}</Button>}
        </div>
      </div>
    )
  }

export const Email: React.FC = () => {
    const FormSchema = z.object({
        // email: z.string().email({
        //     message: 'Invalid email format',
        // }),
        email: z.string(),
        password: z.string().min(1)
    })

    const OtpSchema = z.object({
        email: z.string(),
        otp: z.string().min(1)
    })

    const otpform = useForm<z.infer<typeof OtpSchema>>({
        resolver: zodResolver(OtpSchema)
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })

    const [response, setResponse] = useState<Response | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpLoading, setIsOtpLoading] = useState(false);
    const [redirecting, setIsRedirecting] = useState(false);

    async function onSubmit(data: z.infer<typeof FormSchema>){
        setIsLoading(true)
        const formData = new FormData();
        
        formData.append('username', data.email);
        formData.append('password', data.password);

        const res = await login(formData); // json respons
        console.log(res) // print json response
        if(res){
            setResponse(res || null) // setting
            setIsLoading(false)
        }
        // if(!res){
        //     setIsRedirecting(true)
        // }
        // if(res){
        //     setResponse(res || null)
        //     console.log(response)
        // }else{
        //     setResponse(null)
        // }
        // setIsLoading(false)
    }

    const email = form.watch('email');
    const password = form.watch('password');
    const otp = otpform.watch('otp');
    return(
        <>
            {(response?.code === 401 || response === null) && 
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <span className="text-red-600 text-sm">{response?.code === 400 && 'Invalid user credentials'}</span> 
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) =>{
                                return <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                        placeholder="name@botepco.com"
                                        type="text"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            }}
                        /> 
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) =>{
                                return <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                        placeholder=""
                                        type="password"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            }}
                        /> 
                        <Button type="submit" >{isLoading ? (<>authenticating...</>): (<>Submit</>)}</Button>
                    </div>
                </form>
            </Form>}
            {response && response?.code !== 401 && 
                <InputOTPControlled username={email} password={password}/>
                // <Form {...otpform}>
                //     <form onSubmit={otpform.handleSubmit(onOtpSubmit)}>
                //         <div className="grid gap-4 py-4">
                //             {/* <FormField
                //                 control={form.control}
                //                 name="email"
                //                 render={({field}) =>{
                //                     return <FormItem>
                //                         <FormLabel>Email</FormLabel>
                //                         <FormControl>
                //                             <Input
                //                             placeholder="name@botepco.com"
                //                             type="text"
                //                             {...field}
                //                             />
                //                         </FormControl>
                //                         <FormMessage/>
                //                     </FormItem>
                //                 }}
                //             />  */}
                //             <FormField
                //                 control={otpform.control}
                //                 name="otp"
                //                 render={({ field }) => (
                //                     <FormItem>
                //                     <FormLabel>One-Time Password</FormLabel>
                //                     <FormControl>
                //                         <InputOTP maxLength={6} {...field}>
                //                         <InputOTPGroup>
                //                             <InputOTPSlot index={0} />
                //                             <InputOTPSlot index={1} />
                //                             <InputOTPSlot index={2} />
                //                             <InputOTPSlot index={3} />
                //                             <InputOTPSlot index={4} />
                //                             <InputOTPSlot index={5} />
                //                         </InputOTPGroup>
                //                         </InputOTP>
                //                     </FormControl>
                //                     <FormDescription>
                //                         Please enter the one-time password sent to your phone.
                //                     </FormDescription>
                //                     <FormMessage />
                //                     </FormItem>
                //                 )}
                //             />
                //             <Button type="submit" disabled={isOtpLoading}>{isOtpLoading ? (<>validating...</>): (<>Submit</>)}</Button>
                //         </div>
                //     </form>
                // </Form>
            }
        </>
    )
}