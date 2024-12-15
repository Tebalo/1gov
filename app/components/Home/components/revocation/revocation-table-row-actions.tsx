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

interface RevocationDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  record: {
    revocation_number: string | null;
    userid: string | null;
    sla: string | null;
    registration_number: string | null;
    current_employer: string | null;
    reason: string | null;
    reg_status: string | null;
    date_of_submission: string | null;
  }
  onOpen: () => void
}

const RevocationDetailsDialog: React.FC<RevocationDetailsDialogProps> = ({
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
            <Badge variant="outline">{record.revocation_number || 'N/A'}</Badge>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Card className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Registration Number:</span>
                    <span>{record.registration_number || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">SLA:</span>
                    <span>{record.sla ? `${record.sla} days` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Status:</span>
                    <Badge variant={
                      record.reg_status === "Approved" ? "default" :
                      record.reg_status === "Rejected" ? "destructive" :
                      "secondary"
                    }>
                      {record.reg_status || 'N/A'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">User ID:</span>
                    <span>{record.userid || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Current Employer:</span>
                    <span>{record.current_employer || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Submitted:</span>
                    <span>
                      {record.date_of_submission 
                        ? new Date(record.date_of_submission).toLocaleDateString()
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <span className="font-medium">Reason:</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {record.reason || 'N/A'}
                    </p>
                  </div>
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

export function RevocationTableRowActions<TData>({
  row,
  userRole
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const record = row.original as {
    revocation_number: string;
    userid: string;
    sla: string;
    registration_number: string;
    current_employer: string;
    reason: string;
    reg_status: string;
    date_of_submission: string;
  }

  function handleOpen() {
    router.push(`/trls/work/revocation/${record.revocation_number}`)
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
      <RevocationDetailsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        record={record}
        onOpen={handleOpen}
      />
    </>
  )
}

export default RevocationDetailsDialog