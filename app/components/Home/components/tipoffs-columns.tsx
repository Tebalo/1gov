"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table"
import { getTipOffs } from "@/app/lib/actions"
import React, { useEffect, useState } from "react"
import TableLoadingSkeleton from "../../TableLoadingSkeleton"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { InvTableRowActions } from "./inv-table-row-actions"
import { roleObjects } from "@/app/lib/store"
import { Tipoff } from "../data/schema"
import { TipOffTableRowActions } from "./tipoff-table-row-actions"


// Column definitions
export const tipoffsColumns: ColumnDef<Tipoff>[] = [
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
    accessorKey: "tipoff_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tip-off Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">{row.getValue("tipoff_number")}</Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reporter Name" />
    ),
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("full_name")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "identity_No",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Number" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("identity_No")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nature_of_crime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Crime Type" />
    ),
    cell: ({ row }) => <div className="w-[150px]">{row.getValue("nature_of_crime")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "crime_location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => <div className="w-[150px]">{row.getValue("crime_location")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <TipOffTableRowActions row={row} />,
  },
]




