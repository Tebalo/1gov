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
import { FileText, AlertTriangle, Building, Calendar, Scale, Clock, CheckCircle, FileWarning } from "lucide-react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  userRole?: string
}

interface AppealsDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  record: {
    id: number;
    user_id: string;
    application: string;
    appeals_number: string;
    reg_status: string;
    sla: string;
    appeal_decision: string;
    appeal_reason: string;
    supporting_document_key: string;
    declaration: string;
    profile_data_consent: number;
    created_at: string;
    updated_at: string;
  }
  onOpen: () => void
}

const AppealsDetailsDialog: React.FC<AppealsDetailsDialogProps> = ({
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
            <span>Appeal Details</span>
            <Badge variant="outline">{record.appeals_number}</Badge>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Card className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Status:</span>
                    <span>{record.reg_status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">SLA:</span>
                    <span>{record.sla}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Decision:</span>
                    <span>{record.appeal_decision}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileWarning className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Document Key:</span>
                    <span>{record.supporting_document_key}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Application:</span>
                    <span>{record.application}</span>
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
                <span className="font-medium">Appeal Reason:</span>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {record.appeal_reason}
                </p>
              </div>
              {record.declaration && (
                <div className="space-y-2">
                  <span className="font-medium">Declaration:</span>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {record.declaration}
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

export default AppealsDetailsDialog

export function AppealsTableRowActions<TData>({
  row,
  userRole
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const record = row.original as {
    id: number;
    user_id: string;
    application: string;
    appeals_number: string;
    reg_status: string;
    sla: string;
    appeal_decision: string;
    appeal_reason: string;
    supporting_document_key: string;
    declaration: string;
    profile_data_consent: number;
    created_at: string;
    updated_at: string;
  }

  function handleOpen() {
    router.push(`/trls/work/appeal/${record.appeals_number}`)
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
      <AppealsDetailsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        record={record}
        onOpen={handleOpen}
      />
    </>
  )
}