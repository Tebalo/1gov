"use client"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Registration } from "../data/schema"
import { CheckCircle, XCircle } from "lucide-react"

export const columns: ColumnDef<Registration>[] = [
  {
    accessorKey: "national_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="National ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("national_id")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => {
      const forenames = row.original.forenames || "";
      const surname = row.original.surname || "";
      const fullName = `${forenames} ${surname}`.trim();
      
      return (
        <div className="font-medium">
          {fullName || "N/A"}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "reg_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-full items-center">
          {row.getValue("reg_status")}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registration Date" />
    ),
    cell: ({ row }) => {
      try {
        // Get raw date value
        const dateValue = row.getValue("created_at");
        if (!dateValue) return <div>-</div>;
        
        // Trim the date value to just the YYYY-MM-DD part
        const trimmedDate = String(dateValue).split('T')[0];
        
        // Parse the trimmed date
        const [year, month, day] = trimmedDate.split('-').map(Number);
        
        // JavaScript months are 0-indexed (0-11), so subtract 1 from the month
        const date = new Date(year, month - 1, day);
        
        // Format the date
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        
        return <div>{formattedDate}</div>;
      } catch (error) {
        // If any error occurs during parsing, show the original value
        const rawValue = row.getValue("created_at");
        return <div>{String(rawValue).split('T')[0] || "Invalid Date"}</div>;
      }
    },
    enableSorting: true,
    sortingFn: "datetime",
  },
  {
    id: "license_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="License" />
    ),
    cell: ({ row }) => {
      const isManagerApproved = row.original.reg_status === 'Manager-Approved';
      const isEndorsementComplete = row.original.endorsement_status === 'Endorsement-Complete';
      const licenseLink = row.original.license_link;
      
      const licenseStatus = isManagerApproved && isEndorsementComplete ? 'Valid' : 'Invalid';
      
      // If license is valid and has a link
      if (licenseStatus === 'Valid' && licenseLink) {
        return (
          <div className="flex w-full items-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        )
      }
      
      return (
        <div className="flex w-full items-center">
          <XCircle className="h-5 w-5 text-red-600" />
        </div>
      )
    },
  }
]