"use client"

import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { DataTableColumnHeader } from "../data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { RevocationTableRowActions } from "./changeofcategory-table-row-actions"
import { Revocation } from "./schema/changeofcategory"

export const ChangeOfCategoryColumns: ColumnDef<Revocation>[] = [
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
    accessorKey: "revocation_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Revocation Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">{row.getValue("revocation_number")}</Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "registration_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registration Number" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("registration_number")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "current_employer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Current Employer" />
    ),
    cell: ({ row }) => <div className="w-[150px]">{row.getValue("current_employer")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "reason",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reason" />
    ),
    cell: ({ row }) => <div className="w-[150px]">{row.getValue("reason")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "reg_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px]">
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
    accessorKey: "date_of_submission",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submission Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date_of_submission"))
      return <div className="w-[120px]">{date.toLocaleDateString()}</div>
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <RevocationTableRowActions row={row} />,
  },
]