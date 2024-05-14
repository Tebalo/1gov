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
import { login, validateOTP } from "@/app/auth/auth"
import { useState } from "react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"

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
    async function onOtpSubmit(data: z.infer<typeof OtpSchema>){
        console.log('clicked..')
        setIsOtpLoading(true)
        const formData = new FormData();
        formData.append('username', data.email);
        formData.append('otp', data.otp);
        const res = await validateOTP(formData);
        console.log(res) // print json response
        if(res){
            setResponse(res || null) // setting
        }
    }
    const email = form.watch('email');
    const password = form.watch('password');
    const otp = otpform.watch('otp');
    return(
        <>
            {(response?.code === 401 || response === null) && <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <span className="text-red-600 text-sm">{response?.code === 401 && 'Invalid user credentials'}</span> 
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
            <Form {...otpform}>
                <form onSubmit={otpform.handleSubmit(onOtpSubmit)}>
                    <div className="grid gap-4 py-4">
                        {/* <FormField
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
                        />  */}
                        <FormField
                            control={otpform.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>One-Time Password</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription>
                                    Please enter the one-time password sent to your phone.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isOtpLoading}>{isOtpLoading ? (<>validating...</>): (<>Submit</>)}</Button>
                    </div>
                </form>
            </Form>}
        </>
    )
}