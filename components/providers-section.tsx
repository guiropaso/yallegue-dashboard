"use client"

import { useState, useEffect } from "react"
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
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
      const { data, error } = await supabase
        .from('providers_admin_view')
        .select('*')
        .order('id', { ascending: false })

      console.log('Supabase response:', { data, error })
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      console.log('Returning data:', data)
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
      const { error } = await supabase
        .from('providers')
        .update({ is_approved: approved })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] })
      toast.success("Approval status updated")
    },
    onError: () => {
      toast.error("Failed to update approval status")
    },
  })

  const handleToggleApproval = async (id: string, approved: boolean) => {
    await toggleApprovalMutation.mutateAsync({ id, approved })
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
