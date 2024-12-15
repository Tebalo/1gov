"use client"

import React, { useState } from 'react';
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertTriangle, Calendar, Scale, Clock, CheckCircle, Shield, GraduationCap } from "lucide-react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  userRole?: string
}

interface RenewalDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  record: {
    national_id: string;
    reg_number: string;
    reg_status: string;
    endorsement_status: string;
    rejection_reason: string | null;
    service_code: string;
    payment_ref: string | null;
    payment_amount: string | null;
    payment_name: string | null;
    application_id: string;
    license_link: string | null;
    education_bg_checks: string | null;
    flags_no: string;
    institution_verification: string;
    course_verification: string;
    license_status: string;
    pending_customer_action: string;
    registration_type: string;
    created_at: string;
    updated_at: string;
  }
  onOpen: () => void
}

const RenewalDetailsDialog: React.FC<RenewalDetailsDialogProps> = ({
  isOpen,
  onClose,
  record,
  onOpen
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            <span>Registration Details</span>
            <Badge variant="outline">{record.reg_number}</Badge>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Card className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Registration Type:</span>
                    <span>{record.registration_type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Status:</span>
                    <span>{record.reg_status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Endorsement:</span>
                    <span>{record.endorsement_status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">License Status:</span>
                    <span>{record.license_status}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Application:</span>
                    <span>{record.application_id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Flags:</span>
                    <span>{record.flags_no}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Created:</span>
                    <span>{new Date(record.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Updated:</span>
                    <span>{new Date(record.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <span className="font-medium">Verifications:</span>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Institution: </span>
                    <Badge variant={record.institution_verification === "Verified" ? "default" : "destructive"}>
                      {record.institution_verification}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Course: </span>
                    <Badge variant={record.course_verification === "Verified" ? "default" : "destructive"}>
                      {record.course_verification}
                    </Badge>
                  </div>
                </div>
              </div>
              {record.rejection_reason && (
                <div className="space-y-2">
                  <span className="font-medium">Rejection Reason:</span>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {record.rejection_reason}
                  </p>
                </div>
              )}
            </Card>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onOpen}>View Full Details</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RenewalDetailsDialog

export function RenewalTableRowActions<TData>({
  row,
  userRole
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const record = row.original as {
    national_id: string;
    reg_number: string;
    reg_status: string;
    endorsement_status: string;
    rejection_reason: string | null;
    service_code: string;
    payment_ref: string | null;
    payment_amount: string | null;
    payment_name: string | null;
    application_id: string;
    license_link: string | null;
    education_bg_checks: string | null;
    flags_no: string;
    institution_verification: string;
    course_verification: string;
    license_status: string;
    pending_customer_action: string;
    registration_type: string;
    created_at: string;
    updated_at: string;
  }

  function handleOpen() {
    router.push(`/trls/work/renewal/${record.national_id}`)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            Quick View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpen}>
            View Full Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenewalDetailsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        record={record}
        onOpen={handleOpen}
      />
    </>
  )
}