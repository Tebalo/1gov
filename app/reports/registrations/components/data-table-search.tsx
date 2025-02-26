"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"
import { Search } from "lucide-react"

interface DataTableSearchProps<TData> {
  table: Table<TData>
}

export function DataTableSearch<TData>({
  table,
}: DataTableSearchProps<TData>) {
  const [searchValue, setSearchValue] = React.useState("")

  // Apply the search to multiple columns
  const handleSearch = React.useCallback(
    (value: string) => {
      setSearchValue(value)
      
      // Apply global filter across specified columns
      table.setGlobalFilter(value)
    },
    [table]
  )

  return (
    <div className="flex items-center relative">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by ID or name..."
        value={searchValue}
        onChange={(event) => handleSearch(event.target.value)}
        className="h-8 w-[150px] pl-8 lg:w-[300px]"
      />
    </div>
  )
}