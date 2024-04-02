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
import { login } from "@/app/auth/auth"
import { useState } from "react"

interface UserCredentials{
    email: string,
    password: string,
}
interface Error{
    detail: string
}
export const OneGovID: React.FC = () => {
    const FormSchema = z.object({
        email: z.string().email({
            message: 'Invalid email format',
        }),
        password: z.string()
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })
    const [response, setResponse] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [redirecting, setIsRedirecting] = useState(false);
    async function onSubmit(data: z.infer<typeof FormSchema>){
        setIsLoading(true)
        const formData = new FormData();
        
        formData.append('username', data.email);
        formData.append('password', data.password);

        const res = await login(formData);
        console.log('Json', res)
        if(!res){
            setIsRedirecting(true)
        }
        if(res){
            setResponse(res || null)
        }else{
            setResponse(null)
        }
        setIsLoading(false)
    }
    const email = form.watch('email');
    const password = form.watch('password');
    return(
        <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                    <span className="text-red-600 text-sm">{response?.detail}</span>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) =>{
                            return <FormItem>
                                <FormLabel>1Gov ID</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder=""
                                    type="email"
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
                        <Button type="submit" disabled={isLoading}>{isLoading ? (<>authenticating...</>): (<>Submit</>)}</Button>
                </div>
            </form>
        </Form>
        </>
    )
}