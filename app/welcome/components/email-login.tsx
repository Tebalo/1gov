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
import { toast, useToast } from '@/components/ui/use-toast';
interface UserCredentials{
    email: string,
    password: string,
}

export const Email: React.FC = () => {
    const { toast } = useToast()
    const FormSchema = z.object({
        email: z.string().email({
            message: 'Invalid email format',
        }),
        password: z.string()
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })
    function onSubmit(data: z.infer<typeof FormSchema>){
        toast({
            title: "You submitted the following values:",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">{JSON.stringify(data, null, 2)}</code>
              </pre>
            ),
          })
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
                                        type="text"
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