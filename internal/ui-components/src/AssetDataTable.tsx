import React, { useMemo, useRef, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Search } from 'lucide-react'
import { css } from './styled-system/css'

interface AssetDataTableProps<T extends Record<string, any>> {
  data: Array<T>
}

/**
 * A generic, searchable, and virtualized data table for displaying OSRS cache assets.
 */
export function AssetDataTable<T extends Record<string, any>>({ 
  data
}: AssetDataTableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState('')
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const columns = useMemo(() => {
    if (data.length === 0) return []
    
    const columnHelper = createColumnHelper<T>()
    // Extract keys from the first object as columns
    const keys = Object.keys(data[0])
    
    return keys.map(key => 
      columnHelper.accessor(key as any, {
        header: key,
        cell: (info) => {
          const value = info.getValue()
          if (Array.isArray(value)) return value.filter(v => v !== null && v !== undefined).join(', ') || '-'
          if (typeof value === 'boolean') return value ? 'Yes' : 'No'
          if (value === null || value === undefined) return '-'
          return String(value)
        },
      })
    )
  }, [data])

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 45, // Estimated row height
    getScrollElement: () => tableContainerRef.current,
    overscan: 10,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  
  // In some test environments, the virtualizer might not report items correctly 
  // due to missing DOM measurements (like offsetHeight).
  // We'll fallback to rendering all rows if virtualItems is empty but we have data.
  const itemsToRender = (virtualItems.length === 0 && rows.length > 0)
    ? rows.map((row, index) => ({ index, key: row.id, start: index * 45 }))
    : virtualItems

  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '4', h: 'calc(100vh - 250px)' })}>
      <div className={css({ position: 'relative', maxW: 'md' })}>
        <Search className={css({ position: 'absolute', left: '3', top: '1/2', transform: 'translateY(-50%)', color: 'text.dim' })} size={18} />
        <input
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search assets..."
          className={css({ 
            w: 'full', 
            bg: 'bg.muted', 
            pl: '10', 
            pr: '4', 
            py: '2', 
            rounded: 'lg', 
            border: '1px solid', 
            borderColor: 'border.default',
            color: 'text.main',
            outline: 'none',
            _focus: { borderColor: 'primary.default' }
          })}
        />
      </div>

      <div 
        ref={tableContainerRef}
        className={css({ 
          overflow: 'auto', 
          bg: 'bg.surface', 
          rounded: 'xl', 
          border: '1px solid', 
          borderColor: 'border.default',
          flex: '1',
          position: 'relative'
        })}
      >
        <table className={css({ w: 'full', borderCollapse: 'collapse', textAlign: 'left' })}>
          <thead className={css({ position: 'sticky', top: 0, zIndex: '1', bg: 'bg.muted' })}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className={css({ borderBottom: '1px solid', borderColor: 'border.default' })}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className={css({ 
                      p: '4', 
                      fontSize: 'xs', 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      color: 'text.muted', 
                      letterSpacing: 'wider'
                    })}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody style={{ height: `${rowVirtualizer.getTotalSize() || (rows.length * 45)}px`, position: 'relative' }}>
            {itemsToRender.map(virtualRow => {
              const row = rows[virtualRow.index]
              return (
                <tr 
                  key={virtualRow.key} 
                  data-index={virtualRow.index}
                  ref={node => rowVirtualizer.measureElement(node)}
                  className={css({ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    w: 'full',
                    display: 'table',
                    tableLayout: 'fixed',
                    borderBottom: '1px solid', 
                    borderColor: 'border.subtle', 
                    _hover: { bg: 'bg.active' } 
                  })}
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className={css({ p: '4', fontSize: 'sm', color: 'text.main' })}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className={css({ fontSize: 'xs', color: 'text.dim', px: '2' })}>
        Showing {rows.length.toLocaleString()} assets (Virtualized)
      </div>
    </div>
  )
}
