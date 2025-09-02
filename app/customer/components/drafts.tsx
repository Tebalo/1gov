"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye, Edit, Trash2, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export type Draft = {
  id: string
  content: string
  formType: string
  createdAt: string
  updatedAt: string
  userId: string
  userName: string
  userRole: string
  caseId: string | null
  caseType: string | null
}

interface DraftsTableProps {
  userId: string
  initialData?: Draft[]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const parseContent = (content: string) => {
  try {
    const parsed = JSON.parse(content)
    return {
      firstName: parsed.first_name || '',
      lastName: parsed.last_name || '',
      middleName: parsed.middle_name || '',
      dateOfBirth: parsed.date_of_birth || '',
      citizenship: parsed.citizenship || '',
      nationality: parsed.nationality || ''
    }
  } catch {
    return {
      firstName: '',
      lastName: '',
      middleName: '',
      dateOfBirth: '',
      citizenship: '',
      nationality: ''
    }
  }
}

const getFormTypeColor = (formType: string) => {
  switch (formType.toLowerCase()) {
    case 'registration':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    case 'application':
      return 'bg-green-100 text-green-800 hover:bg-green-200'
    case 'renewal':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }
}

export function DraftsDataTable({ userId, initialData = [] }: DraftsTableProps) {
  const router = useRouter()
  const [data, setData] = React.useState<Draft[]>(initialData)
  const [loading, setLoading] = React.useState(!initialData.length)
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "updatedAt", desc: true }
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    id: false,
    userId: false,
    userRole: false,
    caseId: false,
    caseType: false
  })
  const [rowSelection, setRowSelection] = React.useState({})

  // Fetch drafts data
  React.useEffect(() => {
    const fetchDrafts = async () => {
      //if (initialData.length > 0) return
      
      try {
        setLoading(true)
        const response = await fetch(`/api/drafts?userId=${userId}`)
        if (!response.ok) throw new Error('Failed to fetch drafts')
        const drafts = await response.json()
        setData(drafts)
      } catch (error) {
        console.error('Error fetching drafts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDrafts()
  }, [userId])

  const handleEditDraft = (draft: Draft) => {
    const formType = draft.formType.toLowerCase()
    // Navigate to form with draft ID as query parameter
    router.push(`/customer/dashboard/teacher-application?draftId=${draft.id}`)
  }

  const handleViewDraft = (draft: Draft) => {
    // Navigate to draft view page
    router.push(`/customer/dashboard/teacher-application?draftId=${draft.id}`)
  }

  const handleDeleteDraft = async (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return
    
    try {
      const response = await fetch(`/api/drafts/v1/${draftId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setData(prevData => prevData.filter(draft => draft.id !== draftId))
      } else {
        throw new Error('Failed to delete draft')
      }
    } catch (error) {
      console.error('Error deleting draft:', error)
      alert('Failed to delete draft. Please try again.')
    }
  }

  const columns: ColumnDef<Draft>[] = [
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
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-mono text-xs truncate max-w-[100px]">
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "formType",
      header: "Form Type",
      cell: ({ row }) => {
        const formType = row.getValue("formType") as string
        return (
          <Badge className={getFormTypeColor(formType)} variant="secondary">
            {formType}
          </Badge>
        )
      },
    },
    {
      id: "applicantName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Applicant
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const content = parseContent(row.original.content)
        const fullName = `${content.firstName} ${content.middleName} ${content.lastName}`.trim()
        return (
          <div className="flex flex-col">
            <div className="font-medium">{fullName || 'N/A'}</div>
            <div className="text-sm text-muted-foreground hidden sm:block">
              {content.nationality && `${content.nationality} ${content.citizenship || ''}`}
            </div>
          </div>
        )
      },
      sortingFn: (rowA, rowB) => {
        const contentA = parseContent(rowA.original.content)
        const contentB = parseContent(rowB.original.content)
        const nameA = `${contentA.firstName} ${contentA.lastName}`.trim()
        const nameB = `${contentB.firstName} ${contentB.lastName}`.trim()
        return nameA.localeCompare(nameB)
      }
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          {formatDate(row.getValue("updatedAt"))}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {formatDate(row.getValue("createdAt"))}
        </div>
      ),
    },
    {
      accessorKey: "userId",
      header: "User ID",
    },
    {
      accessorKey: "userName",
      header: "User Name",
    },
    {
      accessorKey: "userRole", 
      header: "Role",
    },
    {
      accessorKey: "caseId",
      header: "Case ID",
    },
    {
      accessorKey: "caseType",
      header: "Case Type",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const draft = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(draft.id)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Copy draft ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewDraft(draft)}>
                <Eye className="mr-2 h-4 w-4" />
                View draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditDraft(draft)}>
                <Edit className="mr-2 h-4 w-4" />
                Continue editing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteDraft(draft.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Drafts...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Draft Applications</CardTitle>
          <CardDescription>
            Manage your saved draft applications. You can continue editing or delete drafts as needed.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Filter by applicant name..."
          value={(table.getColumn("applicantName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("applicantName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter by form type..."
          value={(table.getColumn("formType")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("formType")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id.replace(/([A-Z])/g, ' $1').trim()}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        {/* Mobile Cards View */}
        <div className="block sm:hidden">
          {table.getRowModel().rows?.length ? (
            <div className="divide-y">
              {table.getRowModel().rows.map((row) => {
                const draft = row.original
                const content = parseContent(draft.content)
                const fullName = `${content.firstName} ${content.middleName} ${content.lastName}`.trim()
                
                return (
                  <div key={row.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getFormTypeColor(draft.formType)} variant="secondary">
                        {draft.formType}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDraft(draft)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View draft
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditDraft(draft)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Continue editing
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div>
                      <div className="font-medium">{fullName || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">
                        {content.nationality && `${content.nationality} ${content.citizenship || ''}`}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Updated: {formatDate(draft.updatedAt)}</div>
                      <div>Created: {formatDate(draft.createdAt)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No drafts found.
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

// Usage Example Component
// export function DraftsPage() {
//   // This would typically come from your auth context or session
//   const userId = "440418213" // Replace with actual user ID
  
//   return (
//     <div className="container mx-auto py-6 px-4">
//       <DraftsDataTable userId={userId} />
//     </div>
//   )
// }