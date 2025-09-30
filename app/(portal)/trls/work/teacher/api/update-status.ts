"use server"
import { apiUrl } from "@/app/lib/store";

export async function updateTeacherStatus(
    id: string, 
    status: string,
    rejection_reason?: string,
    items?: (string | undefined)[],
    bearer?: string
   ): Promise<{code: number; message: string}> {
    try {
      if(status === 'Pending-Customer-Action'){
        // Return to customer 
        const res = await fetch(
          `${apiUrl}/customer-action/${id}?reg_status=${status}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${bearer}`
            },
            body: JSON.stringify({
              reg_status: status,
              items
            })
          }
        );
        return {code: res.status, message: 'Success'};
      }else{
        // Advance to next status
        const params = new URLSearchParams();
        let key = 'reg_status';
        if(status === 'Endorsement-Complete' || status === 'Endorsement-Recommendation') {
          //params.append('endorsement_status', status);
          key='endorsement_status'
        } 

        const response = await fetch(
          `${apiUrl}/teacher_registrations/${id}?${key}=${status}&rejection_reason=${rejection_reason}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${bearer}`
            },

            next: {
              
            }
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const data = await response.json();
    
        return {
          code: response.status,
          message: data?.message || 'Success'
        };
      }
   
    } catch (error) {
      // Log the error with more context
      console.error('Error updating status:', {
        id,
        status,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
   
      // Handle specific HTTP errors
      if (error instanceof Error && 'status' in error) {
        return {
          code: (error as any).status || 500,
          message: (error as any).message || 'Failed to update status. Please try again'
        };
      }
   
      return {
        code: 500,
        message: error instanceof Error ? error.message : 'Failed to update status. Please try again'
      };
    }
}