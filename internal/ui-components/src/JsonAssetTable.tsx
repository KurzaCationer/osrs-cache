import React, { useMemo, useRef, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { css } from './styled-system/css'
import { JsonViewer } from './JsonViewer'

interface JsonAssetTableProps<T extends Record<string, any>> {
  data: Array<T>
}

/**
 * A data table that displays asset core properties (ID, Name) 
 * and a primary "Data" column with full JSON representation.
 */
export function JsonAssetTable<T extends Record<string, any>>({ 
  data
}: JsonAssetTableProps<T>) {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<T>()
    
    return [
      columnHelper.accessor('id' as any, {
        header: 'ID',
        cell: (info) => <span className={css({ fontWeight: 'bold', color: 'secondary.default' })}>{info.getValue()}</span>,
        size: 80,
      }),
      columnHelper.accessor('name' as any, {
        header: 'Name',
        cell: (info) => info.getValue() || <span className={css({ color: 'text.dim', fontStyle: 'italic' })}>Unnamed</span>,
        size: 180,
      }),
      columnHelper.display({
        id: 'data',
        header: 'Asset Data (JSON)',
        cell: (info) => {
          return <JsonValueWrapper value={info.row.original} />
        },
        size: 500, // Large enough but will be flexible
      }),
    ]
  }, [data])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 60,
    getScrollElement: () => tableContainerRef.current,
    overscan: 5,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  const itemsToRender = (virtualItems.length === 0 && rows.length > 0)
    ? rows.map((row, index) => ({ index, key: row.id, start: index * 60 }))
    : virtualItems

  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '4', h: 'calc(100vh - 300px)' })}>
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
        <table className={css({ 
          w: 'full', 
          borderCollapse: 'collapse', 
          textAlign: 'left',
          tableLayout: 'fixed'
        })}>
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
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody style={{ height: `${rowVirtualizer.getTotalSize() || (rows.length * 60)}px`, position: 'relative' }}>
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
                    display: 'table', // Crucial for absolute tr to align columns
                    tableLayout: 'fixed',
                    borderBottom: '1px solid', 
                    borderColor: 'border.subtle', 
                    _hover: { bg: 'bg.active' } 
                  })}
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td 
                      key={cell.id} 
                      className={css({ p: '4', fontSize: 'sm', color: 'text.main', verticalAlign: 'top' })}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function JsonValueWrapper({ value }: { value: any }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (typeof value !== 'object' || value === null) {
    return <span>{JSON.stringify(value)}</span>
  }

  return (
    <div className={css({ fontFamily: 'mono', fontSize: 'xs', maxWidth: '100%', overflow: 'hidden' })}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={css({ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2', 
          color: 'primary.default', 
          bg: 'transparent', 
          border: 'none', 
          cursor: 'pointer',
          p: '1',
          rounded: 'sm',
          _hover: { bg: 'bg.muted' }
        })}
      >
        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span>{Array.isArray(value) ? `Array[${value.length}]` : 'Object'}</span>
      </button>
      
      {isExpanded && (
        <div className={css({ mt: '2' })}>
          <JsonViewer value={value} />
        </div>
      )}
    </div>
  )
}