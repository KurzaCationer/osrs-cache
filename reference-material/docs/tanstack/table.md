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

## Basic Usage

```tsx
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

function Table({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## Resources & Links

- [Official Documentation](https://tanstack.com/table/latest/docs/introduction)
- [GitHub Repository](https://github.com/tanstack/table)
- [TanStack Index](./index.md)
