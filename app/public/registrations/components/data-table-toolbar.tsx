"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { endorsementStatuses, priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { Button } from "@/components/ui/button"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by ID"
          value={(table.getColumn("national_id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("national_id")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("reg_status") && (
          <DataTableFacetedFilter
            column={table.getColumn("reg_status")}
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
