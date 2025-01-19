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
    accessorKey: "nature_of_crime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nature of crime" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("nature_of_crime")}</div>,
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
  {
    accessorKey: "crime_location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Crime location" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("crime_location")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date_of_submission",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SLA Status" />
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("date_of_submission"));
      const today = new Date();
      const diffTime = today.getTime() - createdAt.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const remainingDays = 30 - diffDays;
  
      let badgeColor = "bg-green-100 text-green-800";
      let displayText = `${remainingDays} days left`;
  
      if (remainingDays <= 5 && remainingDays > 0) {
        badgeColor = "bg-yellow-100 text-yellow-800";
      } else if (remainingDays <= 0) {
        badgeColor = "bg-red-100 text-red-800";
        const overdueDays = Math.abs(remainingDays);
        displayText = `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`;
      }
  
      return (
        <div className="flex items-center">
          <Badge className={`${badgeColor} font-semibold`}>
            {displayText}
          </Badge>
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId));
      const dateB = new Date(rowB.getValue(columnId));
      const remainingDaysA = 30 - Math.ceil((new Date().getTime() - dateA.getTime()) / (1000 * 60 * 60 * 24));
      const remainingDaysB = 30 - Math.ceil((new Date().getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24));
      return remainingDaysA - remainingDaysB;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <InvTableRowActions row={row} />,
  },
]
