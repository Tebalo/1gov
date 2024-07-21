"use client"

import React, { useState } from 'react';
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { regSchema } from "../data/schema"
import { RecordDetailsDialog } from './RecordDetailsDialog';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  userRole?: string,
}

export function DataTableRowActions<TData>({
  row,
  userRole
}: DataTableRowActionsProps<TData>) {
  const record = regSchema.parse(row.original)
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function handleOpen() {
    if (record.registration_type === 'Teacher') {
      router.push(`/trls/work/object/${record.national_id}`);
    } else if (record.registration_type === 'Student-Teacher') {
      router.push(`/trls/work/student/${record.national_id}`);
    }
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
            Open
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RecordDetailsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        record={record}
        onOpen={handleOpen}
      />
    </>
  )
}