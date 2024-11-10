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
import {  User,  Calendar, UserCircle, FileInput, Hash, FileType } from "lucide-react"
import { Activity } from '@/app/lib/types';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  userRole?: string
}

interface ActivityDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: Activity;
  onOpen: () => void;
}

const ActivityDetailsDialog: React.FC<ActivityDetailsDialogProps> = ({
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
        <span>Activity Details</span>
        <Badge variant="outline">{record.activity_number}</Badge>
      </AlertDialogTitle>
      <AlertDialogDescription>
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Name:</span>
                <span>{record.full_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileType className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Record type:</span>
                <span>{record.record_type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Record ID:</span>
                <span>{record.record_id}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileInput className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Submission Type:</span>
                <span>{record.submission_type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Persona:</span>
                <span>{record.role}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Submission Date :</span>
                <span>{record.date_of_submission}</span>
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

export function ActivityTableRowActions<TData>({
  row,
  userRole
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const record = row.original as Activity

  function handleOpen() {
    router.push(`/trls/work/activity/${record.activity_number}`)
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
      <ActivityDetailsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        record={record}
        onOpen={handleOpen}
      />
    </>
  )
}