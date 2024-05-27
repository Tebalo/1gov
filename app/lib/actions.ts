"use server"
import axios from "axios";
import { signIn } from "../auth/signIn"
import { revalidateTag } from "next/cache"
import { apiUrl, devUrl, licUrl } from "./store";
//import jsCookie from 'js-cookie';
//import { useRouter } from "next/router";

const authUrl = 'http://localhost:8000/api';

export const logout =async () => {
  try{
    const response = await axios.post(`${authUrl}/welcome`, null, {
      withCredentials: true,
    });
    //jsCookie.remove('access_token');
    //jsCookie.remove('refresh_token');

    //const router = useRouter()
    //router.push('/welcome')
  }catch(error){
    throw error
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
    return statuses
  }
export async function getAll(){
  const res = await fetch(`${apiUrl}/teacher_registrations/`, {cache: 'no-store'})
  if(!res.ok){
    return []
  }
  return res.json()
}

export async function getRegApplications(status:string, count: string) {
  
  try{
    const res = await fetch(`${apiUrl}/GetRegistrationsByCount?reg_status=${status}&count=${count}`, {cache: 'no-store'})
    const contentType = res.headers.get('content-type');
    if(contentType && contentType.startsWith('application/json')){
      return res.json()
    }else{
      return [];
    }
  }catch(error){
    return []
  }
}

export async function getLicenseApplications(status:string, count: string) {
  
  try{
    const res = await fetch(`${licUrl}/getLicensesByCount?reg_status=${status}&count=${count}`, {cache: 'no-store'})
    const contentType = res.headers.get('content-type');
    if(contentType && contentType.startsWith('application/json')){
      return res.json()
    }else{
      return [];
    }
  }catch(error){
    return []
  }
  
}

export async function getEndorsementRecords(status:string, count: string) {
  
  try{
    const res = await fetch(`${apiUrl}/GetRegistrationsByCount?endorsement_status=${status}&count=${count}`, {cache: 'no-store'})
    const contentType = res.headers.get('content-type');
    if(contentType && contentType.startsWith('application/json')){
      return res.json()
    }else{
      return [];
    }
  }catch(error){
    return []
  }
}

export async function getLicenseEndorsementRecords(status:string, count: string) {
  
  try{
    const res = await fetch(`${licUrl}/getLicensesByCount?endorsement_status=${status}&count=${count}`, {cache: 'no-store'})
    const contentType = res.headers.get('content-type');
    if(contentType && contentType.startsWith('application/json')){
      return res.json()
    }else{
      return [];
    }
  }catch(error){
    return []
  }
}

export async function getNext(status:string){
    
    try{
        const res = await fetch(`${apiUrl}/getNext/?reg_status=${status}`, {cache:'no-cache'})
        const contentType = res.headers.get('content-type');
        if(!res.ok || res.status === 204){
          return null
        }
        if(contentType && contentType.startsWith('application/json')){
          return await res.json()
        }else{
          return [];
        }      
    }catch(error){
        if(error instanceof SyntaxError){
            return {}
        }else{
            throw new Error('Failed to fetch data')
        }
    }
}

export async function getNextLicense(status:string){
    
  try{
      const res = await fetch(`${licUrl}/getNext/?reg_status=${status}`, {cache:'no-cache'})
      const contentType = res.headers.get('content-type');
      if(!res.ok || res.status === 204){
        return null
      }
      if(contentType && contentType.startsWith('application/json')){
        return await res.json()
      }else{
        return [];
      }      
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

export async function getLicenseById(Id:string){
  const res = await fetch(`${licUrl}/license-data/${Id}`, {cache:'no-cache'})
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

export async function UpdateLicenseStatus(id: string, status: string ){

  const res = await fetch(`${licUrl}/license_applications/${id}?reg_status=${status}`,{
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  return res.status
}

export async function GetReports(){
  const res = await fetch(`${apiUrl}/StatisticalReports/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  })
  return res.json()
}

export async function getMonthlyTeacherRegistrations(){
  const res = await fetch(`${apiUrl}/Monthly-Statistics/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  })
  return res.json()
}

export async function getTeacherRegistrationsByStatus(){
  const res = await fetch(`${apiUrl}/Status-Statistics/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  })
  return res.json()
}

export async function UpdateLicenseEndorsementStatus(id: string, status: string ){

  const res = await fetch(`${licUrl}/license_applications/${id}?endorsement_status=${status}`,{
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  return res.status
}

export async function UpdateEndorsementStatus(id: string, status: string ){

  const res = await fetch(`${apiUrl}/teacher_registrations/${id}?endorsement_status=${status}`,{
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  return res.status
}

export async function BulkRegistrationUpdate(data: string){
  const jsonData = JSON.parse(data);

  const res = await fetch(`${apiUrl}/processBulkRegistrations/`,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonData) 
   })
   return res.status
}
