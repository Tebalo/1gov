"use client"

import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { DataTableColumnHeader } from "../data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Revocation } from "./schema/revocation"
import { RevocationTableRowActions } from "./revocation-table-row-actions"

export const RevocationColumns: ColumnDef<Revocation, unknown>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "revocation_number",
    accessorFn: (row) => row.revocation_number,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Revocation Number" />
    ),
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("revocation_number")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "sla",
    accessorFn: (row) => row.sla,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SLA Days" />
    ),
    cell: ({ row }) => <div className="w-[200px]">{row.getValue("sla")} days</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "current_employer",
    accessorFn: (row) => row.current_employer,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Current Employer" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("current_employer")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  // {
  //   id: "reason",
  //   accessorFn: (row) => row.reason,
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Reason" />
  //   ),
  //   cell: ({ row }) => <div className="w-[150px]">{row.getValue("reason")}</div>,
  //   enableSorting: true,
  //   enableHiding: false,
  // },
  {
    id: "reg_status",
    accessorFn: (row) => row.reg_status,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="w-[180px]">
        <Badge variant={
          row.getValue("reg_status") === "Approved" ? "default" :
          row.getValue("reg_status") === "Rejected" ? "destructive" :
          "secondary"
        }>
          {row.getValue("reg_status")}
        </Badge>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "date_of_submission",
    accessorFn: (row) => row.date_of_submission,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submission Date" />
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue("date_of_submission") as string | null;
      if (!dateValue) return <div className="w-[20px]">N/A</div>;
      
      const date = new Date(dateValue);
      return <div className="w-[80px]">{date.toLocaleDateString()}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <RevocationTableRowActions row={row} />,
  },
]