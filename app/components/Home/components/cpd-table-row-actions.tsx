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
import { FileText, MapPin, User, Phone, Mail, AlertTriangle, Building, Calendar, Calculator, Clock, CheckCircle } from "lucide-react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  userRole?: string
}



interface CPDDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  record: {
    id: number;
    user_id: string;
    cpd_number: string;
    cumulative_points: string;
    reg_status: string;
    sla: string;
    cpd_activity: string;
    cpd_points: string;
    cpd_activity_description: string;
    service_provider: string;
    duration: string;
    declaration: string;
    profile_data_consent: string;
    created_at: string;
    updated_at: string;
  }
  onOpen: () => void
}

const CPDDetailsDialog: React.FC<CPDDetailsDialogProps> = ({
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
            <span>CPD Activity Details</span>
            <Badge variant="outline">{record.cpd_number}</Badge>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Card className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Points:</span>
                    <span>{record.cpd_points}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Cumulative Points:</span>
                    <span>{record.cumulative_points}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Duration:</span>
                    <span>{record.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Status:</span>
                    <span>{record.reg_status}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Activity Type:</span>
                    <span>{record.cpd_activity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Service Provider:</span>
                    <span>{record.service_provider}</span>
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
                <span className="font-medium">Activity Description:</span>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {record.cpd_activity_description}
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

export default CPDDetailsDialog

export function CPDTableRowActions<TData>({
  row,
  userRole
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const record = row.original as {
    id: number;
    user_id: string;
    cpd_number: string;
    cumulative_points: string;
    reg_status: string;
    sla: string;
    cpd_activity: string;
    cpd_points: string;
    cpd_activity_description: string;
    service_provider: string;
    duration: string;
    declaration: string;
    profile_data_consent: string;
    created_at: string;
    updated_at: string;
  }

  function handleOpen() {
    router.push(`/trls/work/cpd/${record.cpd_number}`)
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
      <CPDDetailsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        record={record}
        onOpen={handleOpen}
      />
    </>
  )
}