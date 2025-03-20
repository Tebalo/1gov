"use client"

import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { DataTableColumnHeader } from "../data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { RenewalTableRowActions } from "./renewal-table-row-actions"
import { Renewal } from "./schema/renewal"

export const RenewalColumns: ColumnDef<Renewal>[] = [
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
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("national_id")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "registration_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("registration_type")}</div>,
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
    accessorKey: "endorsement_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Endorsement" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px]">
        <Badge variant={
          row.getValue("endorsement_status") === "Endorsed" ? "default" :
          row.getValue("endorsement_status") === "Rejected" ? "destructive" :
          "secondary"
        }>
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
      <DataTableColumnHeader column={column} title="Date" />
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
    cell: ({ row }) => <RenewalTableRowActions row={row} />,
  },
]