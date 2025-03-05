"use client"

import { ColumnDef } from "@tanstack/react-table"

import { labels, statuses, endorsementStatuses } from "../data/data"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Registration } from "../data/schema"

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
    accessorKey: "registration_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.registration_type)

      return (
        <div className="flex space-x-2">
          {label ? (
            <Badge variant="outline">{label.label}</Badge>
          ) : (
            <Badge variant="outline">{row.getValue("registration_type")}</Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "reg_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("reg_status")
      )

      let badgeVariant = "outline";
      const statusValue = row.getValue("reg_status") as string;
      
      if (statusValue === "Manager-Approved" || statusValue === "Recommended-For-Approval") {
        badgeVariant = "success";
      } else if (statusValue === "Manager-Rejected" || statusValue === "Recommended-For-Rejection") {
        badgeVariant = "destructive";
      } else if (statusValue === "Pending-Customer-Action") {
        badgeVariant = "warning";
      } else {
        badgeVariant = "secondary";
      }

      return (
        <div className="flex w-full items-center">
          {status ? (
            <>
              {status.icon && (
                <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <Badge variant={badgeVariant as any}>
                {status.label}
              </Badge>
            </>
          ) : (
            <Badge variant={badgeVariant as any}>
              {statusValue}
            </Badge>
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "endorsement_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Endorsement" />
    ),
    cell: ({ row }) => {
      const endorsementStatus = endorsementStatuses.find(
        (status) => status.value === row.getValue("endorsement_status")
      )
      
      return (
        <div className="flex w-full items-center">
          {endorsementStatus ? (
            <>
              {endorsementStatus.icon && (
                <endorsementStatus.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <Badge variant={endorsementStatus.variant as any}>
                {endorsementStatus.label}
              </Badge>
            </>
          ) : (
            <Badge variant="outline">
              {row.getValue("endorsement_status")}
            </Badge>
          )}
        </div>
      )
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
      const hasPayment = row.original.payment_amount != null;
      const licenseLink = row.original.license_link;
      
      const licenseStatus = isManagerApproved && isEndorsementComplete && hasPayment ? 'Valid' : 'Invalid';
      const badgeVariant = licenseStatus === 'Valid' ? 'default' : 'destructive';
      
      // If license is valid and has a link
      if (licenseStatus === 'Valid' && licenseLink) {
        return (
          <div className="flex w-full items-center">
            {/* <a 
              href={licenseLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center hover:underline"
            > */}
              <Badge variant={badgeVariant as any} className="inline-flex items-center space-x-1">
                <span>{licenseStatus}</span>
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 h-3.5 w-3.5"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg> */}
              </Badge>
            {/* </a> */}
          </div>
        )
      }
      
      // Default case (no link or invalid license)
      return (
        <div className="flex w-full items-center">
          <Badge variant={badgeVariant as any}>
            {licenseStatus}
          </Badge>
        </div>
      )
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]