'use server'

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
    const res = await fetch('http://66.179.253.57/api/getNext/', {cache: 'no-store'})
    
    return res.json()
}

interface StatusProps {
    id: string;
    status: string;
}

export async function UpdateStatus(id: string, status: string ): Promise<StatusProps>{

    const res = await fetch(`http://66.179.253.57/api/teacher_registrations/${id}?registration_status=${status}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return res.json()
}