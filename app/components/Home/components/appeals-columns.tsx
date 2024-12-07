"use client"

import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Appeal } from "../data/schema"
import { AppealsTableRowActions } from "./appeals-table-row-actions"

export const AppealsColumns: ColumnDef<Appeal>[] = [
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
    accessorKey: "appeals_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Appeal Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">{row.getValue("appeals_number")}</Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "appeal_decision",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Decision" />
    ),
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("appeal_decision")}</div>,
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
    accessorKey: "reg_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div className="w-[150px]">{row.getValue("reg_status")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <AppealsTableRowActions row={row} />,
  },
]