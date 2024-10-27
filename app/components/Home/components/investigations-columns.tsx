"use client"

import { ColumnDef } from "@tanstack/react-table"


import { labels, invstatuses } from "../data/data"
import { Complaint } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { InvTableRowActions } from "./inv-table-row-actions"

export const investigationsColumns: ColumnDef<Complaint>[] = [
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
    accessorKey: "case_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Case number" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("case_number")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Omang_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Omang" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("Omang_id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "inquiry_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inquiry Number" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.inquiry_number)

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("inquiry_number")}
          </span>
        </div>
      )
    },
  },
    {
    accessorKey: "submission_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submission type" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("submission_type")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "reg_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const statusValue = row.getValue("reg_status")?.toString().trim();
      const status = invstatuses.find(
        (status) => status.value === statusValue
      );

      if (!status || !statusValue) {
        return null;
      }

      return (
        <div className="flex w-full items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label.trim()}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const cellValue = row.getValue(id)?.toString().trim();
      return value.includes(cellValue);
    },
  },
  // {
  //   accessorKey: "outcome",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const statusValue = row.getValue("reg_status")?.toString().trim()
  //     const status = invstatuses.find(
  //       (status) => status.value === row.getValue("reg_status")
  //     )

  //     if (!status || !statusValue) {
  //       return null
  //     }

  //     return (
  //       <div className="flex w-full items-center">
  //         {status.icon && (
  //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{status.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => <InvTableRowActions row={row} />,
  },
]
