"use client"

import React, { useEffect, useState } from 'react';
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { regSchema } from "../data/schema"
import { RecordDetailsDialog } from './RecordDetailsDialog';
import { useAuditTrail } from '@/lib/hooks/useAuditTrail';
import { UserInfo } from '@/lib/audit-trail-service';
import { getAccessGroups } from '@/app/auth/auth';

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
  const { 
    logCaseViewed
  } = useAuditTrail();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo>({
    name: '',
    role: '',
    id: '',
  });
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const profile = await getAccessGroups();
        if (profile && profile.current) {  // Add null check
            setCurrentUser(prev => ({
            ...prev,
            name: profile.username || '',
            role: profile.current.toLowerCase() || '',
            id: profile.userid || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    initializeUser();
  }, []);

  async function handleOpen() {
    await logCaseViewed(record.national_id, 'teacher', currentUser);
    router.push(`/trls/work/teacher/${record.national_id}`);
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