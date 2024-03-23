"use server"
import axios from "axios";
import { signIn } from "../auth/signIn"
import { revalidateTag } from "next/cache"
import { GSP_NO_RETURNED_VALUE } from "next/dist/lib/constants"
import { apiUrl } from "./store";
//import jsCookie from 'js-cookie';
//import { useRouter } from "next/router";


const authUrl = 'http://localhost:8000/api';
//const apiUrl = 'http://66.179.253.57/api';

export const logout =async () => {
  try{
    const response = await axios.post(`${authUrl}/welcome`, null, {
      withCredentials: true,
    });
    console.log(response.data.message);
    //jsCookie.remove('access_token');
    //jsCookie.remove('refresh_token');

    //const router = useRouter()
    //router.push('/welcome')
  }catch(error){
    console.error(error)
  }
}

export async function authenticate(_currentState: unknown, formData: FormData) {
    try {
      await signIn('credentials', formData)
    } catch (error) {
      if (error) {
        switch (error) {
          case 'CredentialsSignin':
            return 'Invalid credentials.'
          default:
            return 'Something went wrong.'
        }
      }
      throw error
    }
  }
 

//import { revalidateTag } from "next/cache"

export async function revalidate(params:string) {
    /**
     * Uses; Revalidate cache when hitting getNext, but not when refreshing the page. 
     */
    revalidateTag(params)
}

export default async function getHistory(reg_number: string){
    const statuses = [
        { newStatus: "Pending-Review", timestamp: new Date('2023-10-31T10:20:00'), changedBy: 'Oaitse Segala' },
        { newStatus: "Pending-Screening", timestamp: new Date('2023-11-02T16:05:00'), changedBy: 'Masego Sam' },
        { newStatus: "Needs Additional Info", timestamp: new Date('2023-11-05T09:12:00'), changedBy: 'System' } // Example of a system-generated change
    ]
    //const res = await fetch('') // docs: fetching-caching-and-revalidating
    return statuses
  }
export async function getAll(){
  const res = await fetch(`${apiUrl}/teacher_registrations/`, {cache: 'no-store'})
  if(!res.ok){
    return []
  }
  return res.json()
}
export async function getNext(status:string){
    const res = await fetch(`${apiUrl}/getNext/?reg_status=${status}`, {cache:'no-cache'})

    if(!res.ok){
        if(res.status === 204){
              return null
        }else{
            throw new Error('Failed to fetch data')
        }
    }
    if(res.status === 204){
        return null
    }
    try{
        return await res.json()
    }catch(error){
        if(error instanceof SyntaxError){
            return {}
        }else{
            throw new Error('Failed to fetch data')
        }
    }
}

export async function getRegById(Id:string){
  revalidateTag('work')
  const res = await fetch(`${apiUrl}/teacher_registrations/${Id}`, {next:{tags:['work']}})

  if(!res.ok){
      if(res.status === 204){
            return null
      }else{
          throw new Error('Failed to fetch data')
      }
  }
  if(res.status === 204){
      return null
  }
  try{
      return await res.json()
  }catch(error){
      if(error instanceof SyntaxError){
          return {}
      }else{
          throw new Error('Failed to fetch data')
      }
  }
}

export async function UpdateStatus(id: string, status: string ){

    const res = await fetch(`${apiUrl}/teacher_registrations/${id}?reg_status=${status}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return res.status
}