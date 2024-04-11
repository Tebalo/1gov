"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { RxCheck } from "react-icons/rx";
import { Table } from "@tanstack/react-table"

import { endorsement_status, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "./data-table-view-options"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { regSchema } from "../data/schema";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const handleBulkStatusUpdate = () => {
    const selectedRows = table.getFilteredSelectedRowModel().flatRows;
    
    console.log('Selected rows',selectedRows)
  }
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter registrations..."
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
        {table.getColumn("endorsement_status") && (
          <DataTableFacetedFilter
            column={table.getColumn("endorsement_status")}
            title="Endorsement"
            options={endorsement_status}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        {
          (table.getIsSomePageRowsSelected() || table.getIsAllRowsSelected()) &&
            <Dialog>
            <DialogTrigger className="flex" >
              <Button
                variant="outline"
                className="h-8 px-2 lg:px-3"
                >
                Open Selected
                <RxCheck className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Selected Records</DialogTitle>
                <DialogDescription>
                  Update selected{" "}({table.getFilteredSelectedRowModel().rows.length}) records in bulk.
                </DialogDescription>
                {
                  table.getFilteredSelectedRowModel().rows?.length ? (
                    table.getFilteredSelectedRowModel().rows.map((row) => (
                      <>
                      <li
                      key={row.id}
                      className="flex space-x-2"
                      >
                        <Badge variant='outline'>{row.getValue('national_id')}</Badge>
                        <Badge variant='secondary'>{row.getValue('reg_status')}</Badge>
                        <Badge variant='default'>{row.getValue('endorsement_status')}</Badge>
                      </li>
                      <Separator/>
                      </>
                    ))
                  ):(
                    <></>
                  )
                }
              </DialogHeader>
              <DialogFooter>
                <Button 
                type="submit"
                variant='outline'
                onClick={async () => await handleBulkStatusUpdate}
                >Recommend</Button>
                <Button 
                type="submit"
                >Endorse</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
