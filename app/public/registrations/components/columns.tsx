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
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("national_id")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  // {
  //   accessorKey: "reg_number",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Registration Number" />
  //   ),
  //   cell: ({ row }) => <div>{row.getValue("reg_number")}</div>,
  //   enableSorting: true,
  // },
  {
    accessorKey: "registration_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registration Type" />
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
      <DataTableColumnHeader column={column} title="Created Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      return <div>{formattedDate}</div>;
    },
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
      
      const licenseStatus = isManagerApproved && isEndorsementComplete && hasPayment ? 'Valid' : 'Invalid';
      
      const badgeVariant = licenseStatus === 'Valid' ? 'default' : 'destructive';
      
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