"use server"
import { signIn } from "../auth/signIn"

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
  'use server'

  import { revalidateTag } from "next/cache"
  import { GSP_NO_RETURNED_VALUE } from "next/dist/lib/constants"
  
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
  
  export async function getNext(){
      revalidateTag('work')
      const res = await fetch('http://66.179.253.57/api/getNext/', {next:{tags:['work']}})
  
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
  
      const res = await fetch(`http://66.179.253.57/api/teacher_registrations/${id}?reg_status=${status}`,{
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      return res.status
  }