# TanStack Table - React Sorting & State Management

Documentation for implementing sorting and managing table state in React applications using TanStack Table v8.

## Core Sorting Implementation

To enable client-side sorting, you must provide the `getSortedRowModel` to the `useReactTable` hook.

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), // Required for client-side sorting
})
```

## Controlled Sorting State

For most React applications, controlling the sorting state manually is recommended. This involves using `useState` and passing it to the table instance.

```tsx
const [sorting, setSorting] = useState<SortingState>([])

const table = useReactTable({
  data,
  columns,
  state: {
    sorting,
  },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

### Initial Sorting
You can set an initial sort order by initializing the state:
```tsx
const [sorting, setSorting] = useState<SortingState>([
  { id: 'count', desc: true }
])
```

## Performance & Memoization

**CRITICAL:** To prevent infinite re-render loops and browser hangs, your `data` and `columns` definitions **must** have stable references.

1.  **Memoize Columns:** Use `useMemo` with an empty dependency array for static columns.
2.  **Memoize Data:** Use `useMemo` for any data derived from props or state.
3.  **Stable Row IDs:** Use `getRowId` to provide a unique, stable ID for each row to help React's reconciliation.

```tsx
const columns = useMemo(() => [
  // ...
], [])

const data = useMemo(() => transform(props.data), [props.data])
```

## Implementation Checklist

- [ ] `getSortedRowModel` is included in `useReactTable`.
- [ ] `data` is memoized and only changes when necessary.
- [ ] `columns` is memoized.
- [ ] Sorting state is managed via `useState` and `onSortingChange`.
- [ ] Header click handlers are correctly attached via `header.column.getToggleSortingHandler()`.

## Troubleshooting Browser Hangs
Browser hangs during sorting usually indicate an unstable `data` or `columns` reference being passed to `useReactTable`. Ensure these are correctly wrapped in `useMemo`. If the data is extremely large, consider `manualSorting: true` and server-side processing.

---
Source: https://tanstack.com/table/latest/docs/framework/react/guide/table-state
Source: https://tanstack.com/table/latest/docs/api/features/sorting
