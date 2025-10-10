"use client"

import { useState, useMemo } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Download, Eye, MoreHorizontal, Search, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

// Separate component for approval switch to avoid hooks in cell function
function ApprovalSwitch({ 
  provider, 
  onToggleApproval 
}: { 
  provider: Provider
  onToggleApproval: (id: string, approved: boolean) => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false)
  
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={provider.is_approved}
        onCheckedChange={async (checked) => {
          setIsLoading(true)
          try {
            await onToggleApproval(provider.id, checked)
            toast.success(`Provider ${checked ? 'approved' : 'disapproved'} successfully`)
          } catch (error) {
            console.error('Error toggling approval:', error)
            toast.error("Failed to update approval status")
          } finally {
            setIsLoading(false)
          }
        }}
        disabled={isLoading}
      />
      {isLoading && (
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      )}
    </div>
  )
}

export type Provider = {
  id: string
  first_name: string | null
  last_name: string | null
  dui: string | null
  whatsapp: string | null
  has_fixed_job: boolean | null
  registration_step: number | null
  is_approved: boolean
  email: string | null
  areas: string[]
  years_experience: number
  description: string
  dui_front_url: string | null
  dui_back_url: string | null
  police_record_url: string | null
}

interface ProvidersTableProps {
  data: Provider[]
  onToggleApproval: (id: string, approved: boolean) => Promise<void>
}

export function ProvidersTable({ data, onToggleApproval }: ProvidersTableProps) {
  console.log('ProvidersTable received data:', data)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isUpdatingStep, setIsUpdatingStep] = useState(false)

  // Function to update registration step
  const updateRegistrationStep = async (providerId: string, newStep: string) => {
    try {
      setIsUpdatingStep(true)
      
      const { data, error } = await supabase
        .from('providers')
        .update({ registration_step: parseInt(newStep) })
        .eq('id', providerId)
        .select()

      if (error) {
        console.error('Database error:', error)
        toast.error(`Failed to update registration step: ${error.message}`)
        return
      }

      if (data && data.length > 0) {
        // Update the local state to reflect the change
        if (selectedProvider && selectedProvider.id === providerId) {
          setSelectedProvider({
            ...selectedProvider,
            registration_step: parseInt(newStep)
          })
        }
        toast.success('Registration step updated successfully')
      } else {
        toast.error('Failed to update registration step - no confirmation from database')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('Failed to update registration step')
    } finally {
      setIsUpdatingStep(false)
    }
  }

  // Function to delete a specific document URL
  const deleteDocument = async (providerId: string, documentType: 'dui_front_url' | 'dui_back_url' | 'police_record_url') => {
    try {
      setIsDeleting(documentType)
      
      const { data, error } = await supabase
        .from('provider_documents')
        .update({ [documentType]: null })
        .eq('provider_id', providerId)
        .select()

      if (error) {
        console.error('Database error:', error)
        toast.error(`Failed to delete ${documentType.replace('_', ' ')} document: ${error.message}`)
        return
      }

      // Only update UI if we get confirmation from Supabase
      if (data && data.length > 0) {
        const updatedDocument = data[0]
        
        // Verify the document was actually deleted
        if (updatedDocument[documentType] === null) {
          // Update the local state to reflect the change
          if (selectedProvider && selectedProvider.id === providerId) {
            setSelectedProvider({
              ...selectedProvider,
              [documentType]: null
            })
          }
          toast.success(`${documentType.replace('_', ' ')} document deleted successfully`)
        } else {
          toast.error(`Failed to delete ${documentType.replace('_', ' ')} document - field still exists`)
        }
      } else {
        toast.error(`Failed to delete ${documentType.replace('_', ' ')} document - no confirmation from database`)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error(`Failed to delete ${documentType.replace('_', ' ')} document`)
    } finally {
      setIsDeleting(null)
    }
  }

  const columns: ColumnDef<Provider>[] = useMemo(
    () => [
      {
        accessorKey: "first_name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const provider = row.original
          return (
            <div className="flex flex-col">
              <div className="font-medium">
                {provider.first_name} {provider.last_name}
              </div>
              <div className="text-sm text-muted-foreground">{provider.dui || 'No DUI'}</div>
            </div>
          )
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
          const email = row.getValue("email") as string
          return <span>{email || 'Not provided'}</span>
        },
      },
      {
        accessorKey: "whatsapp",
        header: "WhatsApp",
        cell: ({ row }) => {
          const whatsapp = row.getValue("whatsapp") as string
          return <span>{whatsapp || 'Not provided'}</span>
        },
      },
      {
        accessorKey: "areas",
        header: "Areas",
        cell: ({ row }) => {
          const areas = row.getValue("areas") as string[]
          return (
            <div className="flex flex-wrap gap-1">
              {areas.slice(0, 2).map((area, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {area}
                </Badge>
              ))}
              {areas.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{areas.length - 2}
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "years_experience",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Experience
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const years = row.getValue("years_experience") as number
          return <span>{years ? `${years} years` : 'Not specified'}</span>
        },
      },
      {
        accessorKey: "has_fixed_job",
        header: "Has Fixed Job",
        cell: ({ row }) => {
          const hasFixedJob = row.getValue("has_fixed_job") as boolean
          return <Badge variant={hasFixedJob ? "default" : "secondary"}>
            {hasFixedJob ? "Yes" : "No"}
          </Badge>
        },
      },
      {
        accessorKey: "registration_step",
        header: "Step",
        cell: ({ row }) => {
          const step = row.getValue("registration_step") as number
          return <span>{step || 'Not specified'}</span>
        },
      },
      {
        accessorKey: "is_approved",
        header: "Approved",
        cell: ({ row }) => {
          const provider = row.original
          
          return (
            <ApprovalSwitch 
              provider={provider} 
              onToggleApproval={onToggleApproval}
            />
          )
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const provider = row.original

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
                  onClick={() => {
                    setSelectedProvider(provider)
                    setIsDrawerOpen(true)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(provider.id)}
                >
                  Copy ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [onToggleApproval]
  )

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

  const exportToCSV = () => {
    const csvData = data.map(provider => ({
      'First Name': provider.first_name || '',
      'Last Name': provider.last_name || '',
      'Email': provider.email || '',
      'DUI': provider.dui || '',
      'WhatsApp': provider.whatsapp || '',
      'Areas': provider.areas.join(', '),
      'Years Experience': provider.years_experience || '',
      'Description': provider.description || '',
      'Has Fixed Job': provider.has_fixed_job ? 'Yes' : 'No',
      'Is Approved': provider.is_approved ? 'Yes' : 'No',
      'Registration Step': provider.registration_step || '',
      'DUI Front URL': provider.dui_front_url || '',
      'DUI Back URL': provider.dui_back_url || '',
      'Police Record URL': provider.police_record_url || '',
    }))

    const headers = Object.keys(csvData[0])
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `providers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter providers..."
            value={(table.getColumn("first_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("first_name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="ml-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
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
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
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

      {/* Provider Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
          <SheetHeader>
            <SheetTitle>Provider Details</SheetTitle>
            <SheetDescription>
              Complete information about the selected provider.
            </SheetDescription>
          </SheetHeader>
          {selectedProvider && (
            <div className="flex-1 overflow-y-auto mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedProvider.first_name} {selectedProvider.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  ID: {selectedProvider.id}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm">{selectedProvider.email || 'Not provided'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">DUI</label>
                    <p className="text-sm">{selectedProvider.dui || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">WhatsApp</label>
                    <p className="text-sm">{selectedProvider.whatsapp || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Areas of Expertise</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProvider.areas.length > 0 ? (
                    selectedProvider.areas.map((area, index) => (
                      <Badge key={index} variant="outline">{area}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Not specified</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Experience</label>
                <p className="text-sm">{selectedProvider.years_experience ? `${selectedProvider.years_experience} years` : 'Not specified'}</p>
                {selectedProvider.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedProvider.description}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Documents</label>
                <div className="space-y-3 mt-2">
                  {selectedProvider.dui_front_url && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">DUI Front</span>
                        <a 
                          href={selectedProvider.dui_front_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline hover:text-blue-800"
                        >
                          {selectedProvider.dui_front_url.split('/').pop()}
                        </a>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => deleteDocument(selectedProvider.id, 'dui_front_url')}
                        disabled={isDeleting === 'dui_front_url'}
                      >
                        {isDeleting === 'dui_front_url' ? (
                          <div className="h-4 w-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  {selectedProvider.dui_back_url && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">DUI Back</span>
                        <a 
                          href={selectedProvider.dui_back_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline hover:text-blue-800"
                        >
                          {selectedProvider.dui_back_url.split('/').pop()}
                        </a>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => deleteDocument(selectedProvider.id, 'dui_back_url')}
                        disabled={isDeleting === 'dui_back_url'}
                      >
                        {isDeleting === 'dui_back_url' ? (
                          <div className="h-4 w-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  {selectedProvider.police_record_url && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">Police Record</span>
                        <a 
                          href={selectedProvider.police_record_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline hover:text-blue-800"
                        >
                          {selectedProvider.police_record_url.split('/').pop()}
                        </a>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => deleteDocument(selectedProvider.id, 'police_record_url')}
                        disabled={isDeleting === 'police_record_url'}
                      >
                        {isDeleting === 'police_record_url' ? (
                          <div className="h-4 w-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  {!selectedProvider.dui_front_url && !selectedProvider.dui_back_url && !selectedProvider.police_record_url && (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-sm text-muted-foreground">No documents uploaded</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Has Fixed Job</label>
                  <p className="text-sm">{selectedProvider.has_fixed_job ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Registration Step</label>
                  <Select
                    value={selectedProvider.registration_step?.toString() || ''}
                    onValueChange={(value) => updateRegistrationStep(selectedProvider.id, value)}
                    disabled={isUpdatingStep}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select step" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Step 2</SelectItem>
                      <SelectItem value="3">Step 3</SelectItem>
                      <SelectItem value="4">Step 4</SelectItem>
                      <SelectItem value="5">Step 5</SelectItem>
                    </SelectContent>
                  </Select>
                  {isUpdatingStep && (
                    <div className="flex items-center mt-2">
                      <div className="h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2" />
                      <span className="text-xs text-gray-600">Updating...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Approval Status</label>
                <Badge variant={selectedProvider.is_approved ? "default" : "secondary"}>
                  {selectedProvider.is_approved ? 'Approved' : 'Pending'}
                </Badge>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
