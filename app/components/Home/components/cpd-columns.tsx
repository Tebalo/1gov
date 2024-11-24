"use client"

import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CPD} from "../data/schema"
import { CPDTableRowActions } from "./cpd-table-row-actions"


// Column definitions
export const CPDColumns: ColumnDef<CPD>[] = [
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
    accessorKey: "cpd_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPD Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">{row.getValue("cpd_number")}</Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "cpd_activity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activity" />
    ),
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("cpd_activity")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Number" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("user_id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sla",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SLA" />
    ),
    cell: ({ row }) => <div className="w-[150px]">{row.getValue("sla")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <CPDTableRowActions row={row} />,
  },
]




