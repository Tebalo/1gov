'use client'
import { useState } from "react";
import { getAuthData } from "./1gov-login";
import { updateTeacherStatus } from "@/app/(portal)/trls/work/teacher/api/update-status";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

export const ResendPayment: React.FC<{caseId: string}> = ({ 
  caseId
}) => {
  const [submitting, setSubmission] = useState(false)
  const { toast } = useToast();
  async function onSubmit(){
    try{
      setSubmission(true)
      const authData = getAuthData();
      const bearer = authData?.access_token;
      const result = await updateTeacherStatus(caseId, "Manager-Approved", "N/A", [], bearer || '');
      if (result.code === 200 || result.code === 201 || result.code === 504 || result.code === 500) {
        toast({
          title: "Payment link sent",
          variant: "default",
          description: "Payment link has been regenerated"
        });
      }
      setSubmission(false)
    }catch(error){
      toast({
        title: "Failed to send",
        variant: "destructive",
        description: `Failed to resend invoice link ${error}`
      });
      
      setSubmission(false)
    }finally{
      setSubmission(false)
    }
  }
  return(
    <div>
      <Button variant={"outline"} onClick={onSubmit} className="py-5 rounded-lg">
        <Coins 
          className={`mr-2 ${submitting ? 'animate-spin text-green-400' : ''}`} 
          size={16} 
        />
        {submitting ? "Sending Link.." : "Resend Payment Link"}
      </Button>
    </div>
  )
}