'use server'
import { formSchema } from "../lib/schema";
import axios from 'axios';
import * as z from 'zod'

export async function register(values: z.infer<typeof formSchema>){
    const registrationEndpoint = `http://66.179.253.57/api/teacher_registrations/`;
        
    try{
        const response = await axios.post(registrationEndpoint, values, {
            maxBodyLength: 200000000,
        });
    }catch (error:any){
        throw error
    }finally{
    //setIsSubmitting(false); // Change state back after submission is completed
    }
}