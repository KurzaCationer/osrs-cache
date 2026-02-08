import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * Initializes and returns the context for TanStack Query.
 * @returns An object containing the queryClient instance.
 */
export function getContext() {
  const queryClient = new QueryClient()
  return {
    queryClient,
  }
}

/**
 * The root provider for TanStack Query, wrapping the application with QueryClientProvider.
 *
 * @param props The provider props.
 * @param props.children The child components to wrap.
 * @param props.queryClient The query client instance.
 */
export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
