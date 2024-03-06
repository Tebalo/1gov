'use server'
import { formSchema } from "../lib/schema";
import axios from 'axios';
import * as z from 'zod'

export async function register(values: z.infer<typeof formSchema>){
    const registrationEndpoint = `http://66.179.253.57/api/teacher_registrations/`;
        
    try{
        console.log('Hello there',values)
        const response = await axios.post(registrationEndpoint, values, {
            maxBodyLength: 200000000,
        });
    }catch (error:any){
    //console.error('Error registering', error.message);
    //setIsErrorAlert(true);
    //setCurrentStep(step => step + 1)
    }finally{
    //setIsSubmitting(false); // Change state back after submission is completed
    }
}