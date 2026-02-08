---
title: TanStack Table
description: Core concepts and basic usage for TanStack Table.
source: https://tanstack.com/table/latest/docs/introduction
---

# TanStack Table

A headless UI library for building powerful tables and datagrids.

## Core Concepts

- **Headless:** Provides logic and state management without any UI or styling.
- **Framework Agnostic:** Works with React, Vue, Solid, Svelte, etc.
- **Feature Rich:** Supports sorting, filtering, pagination, grouping, and more.
- **Modular:** Only include the features you need.

## Best Practices

### Memoization

In React, you MUST memoize your `data` and `columns` definitions using `useMemo`.

Because TanStack Table uses these objects as dependencies in its own internal hooks, recreating them on every render will trigger an infinite re-render loop, which can cause performance issues or browser hangs.

```tsx
const data = useMemo(() => rawData, [rawData]);
const columns = useMemo(() => [ ... ], []);

const table = useReactTable({
  data,
  columns,
  // ...
});
```

## Resources & Links

- [Official Documentation](https://tanstack.com/table/latest/docs/introduction)
- [GitHub Repository](https://github.com/tanstack/table)
- [TanStack Index](./index.md)
