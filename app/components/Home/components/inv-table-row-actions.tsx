"use client"

import React, { useState } from 'react';
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { complaintSchema, complaintSchemawithNullValues, InvestigationsSchema } from "../data/schema"
import { InvestigationsDetailsDialog } from './InvestigationDetailsDialog';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  userRole?: string,
}

export function InvTableRowActions<TData>({
  row,
  userRole
}: DataTableRowActionsProps<TData>) {
  const record = complaintSchemawithNullValues.parse(row.original)
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function handleOpen() {
    router.push(`/trls/work/investigation/${record.inquiry_number}`);
    // if (record.case_number === 'Com') {
    //   router.push(`/trls/work/investigation/${record.case_number}`);
    // } else{
    //   router.push(`/trls/work`);
    // }
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
      <InvestigationsDetailsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        record={record}
        onOpen={handleOpen}
      />
    </>
  )
}