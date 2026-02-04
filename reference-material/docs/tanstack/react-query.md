---
title: TanStack Query (React)
description: Core concepts and basic usage for TanStack Query in React.
source: https://tanstack.com/query/latest/docs/framework/react/overview
---

# TanStack Query (React)

TanStack Query (formerly React Query) is a powerful asynchronous state management library for TS/JS, React, Solid, Vue, Svelte and Angular.

## Core Concepts

- **Server State Management:** Manages asynchronous state that is persisted remotely.
- **Caching & Deduping:** Automatically caches data and dedupes multiple requests for the same data.
- **Stale-While-Revalidate:** Keeps data fresh by fetching in the background.
- **Zero-Config:** Works out-of-the-box with sensible defaults but is highly customizable.

## Basic Usage

### 1. Setup QueryClient

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourComponent />
    </QueryClientProvider>
  )
}
```

### 2. Fetching Data with `useQuery`

```tsx
import { useQuery } from '@tanstack/react-query'

function YourComponent() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then((res) =>
        res.json(),
      ),
  })

  if (isPending) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
    </div>
  )
}
```

## Resources & Links

- [Official Documentation](https://tanstack.com/query/latest/docs/framework/react/overview)
- [GitHub Repository](https://github.com/tanstack/query)
- [Installation Guide](https://tanstack.com/query/latest/docs/framework/react/installation)
- [TanStack Index](./index.md)
