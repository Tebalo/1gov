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
import { FileText, AlertTriangle, Calendar, Scale, CheckCircle, Shield,  Building2, GraduationCap as Course } from "lucide-react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  userRole?: string
}

interface ChangeOfCategoryDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  record: {
    national_id: string;
    reg_number: string;
    reg_status: string;
    registration_number: string | null;
    work_status: string | null;
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

const ChangeOfCategoryDetailsDialog: React.FC<ChangeOfCategoryDetailsDialogProps> = ({
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
                    <Badge variant={
                      record.reg_status === "Approved" ? "default" :
                      record.reg_status === "Rejected" ? "destructive" :
                      "secondary"
                    }>
                      {record.reg_status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Endorsement:</span>
                    <Badge variant={
                      record.endorsement_status === "Endorsed" ? "default" :
                      record.endorsement_status === "Rejected" ? "destructive" :
                      "secondary"
                    }>
                      {record.endorsement_status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  {/* <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Application ID:</span>
                    <span className="text-xs">{record.application_id}</span>
                  </div> */}
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
                </div>
              </div>
              <div className="space-y-2">
                <span className="font-medium">Verifications:</span>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Institution: </span>
                    <Badge variant={record.institution_verification === "Verified" ? "default" : "destructive"}>
                      {record.institution_verification}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Course className="h-4 w-4 text-muted-foreground" />
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
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction onClick={onOpen}>View Full Details</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function ChangeOfCategoryTableRowActions<TData>({
  row,
  userRole
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const record = row.original as {
    national_id: string;
    reg_number: string;
    reg_status: string;
    registration_number: string | null;
    work_status: string | null;
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
    router.push(`/trls/work/changeofcategory/${record.national_id}`)
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
      <ChangeOfCategoryDetailsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        record={record}
        onOpen={handleOpen}
      />
    </>
  )
}

export default ChangeOfCategoryDetailsDialog