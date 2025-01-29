"use client"

import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { DataTableColumnHeader } from "../data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

import { StudentTeacher } from "./schema/studenteacher"
import { StudentTeacherTableRowActions } from "./studentteacher-table-row-actions"

export const StudentTeacherColumns: ColumnDef<StudentTeacher>[] = [
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
    accessorKey: "national_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="National ID" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">{row.getValue("national_id")}</Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "reg_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registration Number" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("reg_number")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "registration_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registration Type" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("registration_type")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "reg_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        <Badge variant={"secondary"}>
          {row.getValue("reg_status")}
        </Badge>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "endorsement_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Endorsement Status" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        <Badge variant="secondary">
          {row.getValue("endorsement_status")}
        </Badge>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submission Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return <div className="w-[120px]">{date.toLocaleDateString()}</div>
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <StudentTeacherTableRowActions row={row} />,
  },
]