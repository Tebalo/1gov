"use client"

import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { TipOffTableRowActions } from "./tipoff-table-row-actions"
import { Activity } from "../data/schema"
import { ActivityTableRowActions } from "./activity-table-row-actions"


// Column definitions
export const ActivityColumns: ColumnDef<Activity>[] = [
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
    accessorKey: "activity_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activity Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">{row.getValue("activity_number")}</Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "record_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Record type" />
    ),
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("record_type")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "record_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Record ID" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("record_id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "submission_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submission Type" />
    ),
    cell: ({ row }) => <div className="w-[150px]">{row.getValue("submission_type")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "date_of_submission",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of submission" />
    ),
    cell: ({ row }) => <div className="w-[150px]">{row.getValue("date_of_submission")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActivityTableRowActions row={row} />,
  },
]




