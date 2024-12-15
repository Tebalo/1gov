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
import { FileText, AlertTriangle, Calendar, User, Building, Clock } from "lucide-react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  userRole?: string
}

interface RestorationDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  record: {
    revocation_number: string;
    userid: string;
    registration_number: string;
    current_employer: string;
    reason: string;
    reg_status: string;
    date_of_submission: string;
    application_id: string;
  }
  onOpen: () => void
}

const RestorationDetailsDialog: React.FC<RestorationDetailsDialogProps> = ({
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
            <span>Revocation Details</span>
            <Badge variant="outline">{record.revocation_number}</Badge>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Card className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Registration Number:</span>
                    <span>{record.registration_number}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
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
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">User ID:</span>
                    <span>{record.userid}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Current Employer:</span>
                    <span>{record.current_employer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Reason:</span>
                    <span>{record.reason}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Submitted:</span>
                    <span>{new Date(record.date_of_submission).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Application ID:</span>
                  <span className="text-sm text-muted-foreground">
                    {record.application_id}
                  </span>
                </div>
              </div>
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

export function RestorationTableRowActions<TData>({
  row,
  userRole
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const record = row.original as {
    revocation_number: string;
    userid: string;
    registration_number: string;
    current_employer: string;
    reason: string;
    reg_status: string;
    date_of_submission: string;
    application_id: string;
  }

  function handleOpen() {
    router.push(`/trls/work/restoration/${record.registration_number}`)
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
      <RestorationDetailsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        record={record}
        onOpen={handleOpen}
      />
    </>
  )
}

export default RestorationDetailsDialog