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
import {useRouter} from 'next/navigation'

interface UserCredentials{
    email: string,
    password: string,
}

export const Email: React.FC = () => {
    const router = useRouter()
    const FormSchema = z.object({
        email: z.string().email({
            message: 'Invalid email format',
        }),
        password: z.string()
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })
    async function onSubmit(data: z.infer<typeof FormSchema>){
        const formData = new FormData();
        formData.append('username', data.email);
        formData.append('password', data.password);

        const response = await login(formData)
        if(response?.ok){
            router.push('/trls/home')
        }
    }
    const email = form.watch('email');
    const password = form.watch('password');
    return(
        <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) =>{
                            return <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="name@botepco.com"
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
                        <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
        </>
    )
}