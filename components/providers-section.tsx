"use client"

import { useState, useEffect } from "react"
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ProvidersTable, type Provider } from "./providers-table"
import { toast } from "sonner"

const queryClient = new QueryClient()

function ProvidersContent() {
  const [providers, setProviders] = useState<Provider[]>([])
  const queryClient = useQueryClient()

  // Fetch providers data
  const { data, isLoading, error } = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      console.log('Fetching providers...')
      const response = await fetch('/api/providers')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch providers')
      }
      
      const data = await response.json()
      console.log('API response:', data)
      return data as Provider[]
    },
  })

  // Update providers when data changes
  useEffect(() => {
    console.log('Data changed:', data)
    if (data) {
      console.log('Setting providers:', data)
      setProviders(data)
    }
  }, [data])

  // Toggle approval mutation
  const toggleApprovalMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string, approved: boolean }) => {
      const response = await fetch(`/api/providers/${id}/approval`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update approval status')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] })
      toast.success("Approval status updated")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update approval status")
    },
  })

  const handleToggleApproval = async (id: string, approved: boolean) => {
    await toggleApprovalMutation.mutateAsync({ id, approved })
  }

  // Function to update a specific provider in the local state
  const updateProviderInState = (updatedProvider: Provider) => {
    setProviders(prevProviders => 
      prevProviders.map(provider => 
        provider.id === updatedProvider.id ? updatedProvider : provider
      )
    )
  }

  // Function to refresh providers data from the database
  const refreshProvidersData = () => {
    queryClient.invalidateQueries({ queryKey: ['providers'] })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Providers</h1>
          <p className="text-muted-foreground">
            Manage service providers and their information.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Providers</h1>
          <p className="text-muted-foreground">
            Manage service providers and their information.
          </p>
        </div>
        <div className="rounded-lg border border-destructive p-6">
          <h2 className="text-xl font-semibold mb-2 text-destructive">Error Loading Providers</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'An error occurred while loading providers.'}
          </p>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-muted-foreground">Show error details</summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Providers</h1>
        <p className="text-muted-foreground">
          Manage service providers and their information. Total: {providers.length} providers
        </p>
      </div>
      
      <ProvidersTable 
        data={providers}
        onToggleApproval={handleToggleApproval}
        onUpdateProvider={updateProviderInState}
        onRefreshData={refreshProvidersData}
      />
    </div>
  )
}

export function ProvidersSection() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProvidersContent />
    </QueryClientProvider>
  )
}
