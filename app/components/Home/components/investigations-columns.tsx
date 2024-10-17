"use client"

import { ColumnDef } from "@tanstack/react-table"


import { labels, priorities, invstatuses } from "../data/data"
import { Complaint } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

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
    accessorKey: "bif_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="BIF Number" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("bif_number")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fir_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="FIR Number" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("fir_number")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nature_of_crime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nature Of Crime" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.nature_of_crime)

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("nature_of_crime")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "outcome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = invstatuses.find(
        (status) => status.value === row.getValue("outcome")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-full items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // {
  //   accessorKey: "created_at",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="SLA Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const createdAt = new Date(row.getValue("created_at"));
  //     const today = new Date();
  //     const diffTime = today.getTime() - createdAt.getTime();
  //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //     const remainingDays = 30 - diffDays;
  
  //     let badgeColor = "bg-green-100 text-green-800";
  //     let displayText = `${remainingDays} days left`;
  
  //     if (remainingDays <= 5 && remainingDays > 0) {
  //       badgeColor = "bg-yellow-100 text-yellow-800";
  //     } else if (remainingDays <= 0) {
  //       badgeColor = "bg-red-100 text-red-800";
  //       const overdueDays = Math.abs(remainingDays);
  //       displayText = `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`;
  //     }
  
  //     return (
  //       <div className="flex items-center">
  //         <Badge className={`${badgeColor} font-semibold`}>
  //           {displayText}
  //         </Badge>
  //       </div>
  //     );
  //   },
  //   sortingFn: (rowA, rowB, columnId) => {
  //     const dateA = new Date(rowA.getValue(columnId));
  //     const dateB = new Date(rowB.getValue(columnId));
  //     const remainingDaysA = 30 - Math.ceil((new Date().getTime() - dateA.getTime()) / (1000 * 60 * 60 * 24));
  //     const remainingDaysB = 30 - Math.ceil((new Date().getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24));
  //     return remainingDaysA - remainingDaysB;
  //   },
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]
