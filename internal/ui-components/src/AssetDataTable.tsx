import React, { useMemo, useState } from 'react'
import {
  createColumnHelper,
} from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { css } from './styled-system/css'
import { StandardTable } from './StandardTable'

interface AssetDataTableProps<T extends Record<string, unknown>> {
  data: Array<T>
}

/**
 * A generic, searchable, and virtualized data table for displaying OSRS cache assets.
 */
export function AssetDataTable<T extends Record<string, unknown>>({
  data,
}: AssetDataTableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(() => {
    if (data.length === 0) return []

    const columnHelper = createColumnHelper<T>()
    // Extract keys from the first object as columns
    const keys = Object.keys(data[0])

    return keys.map((key) =>
      columnHelper.accessor(key, {
        header: key,
        cell: (info) => {
          const value = info.getValue()
          if (Array.isArray(value))
            return (
              (value as Array<unknown>)
                .filter((v) => v !== null && v !== undefined)
                .join(', ') || '-'
            )
          if (typeof value === 'boolean') return value ? 'Yes' : 'No'
          if (value === null || value === undefined) return '-'
          return String(value)
        },
      }),
    )
  }, [data])

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '4',
        h: 'calc(100vh - 250px)',
      })}
    >
      <div className={css({ position: 'relative', maxW: 'md' })}>
        <Search
          className={css({
            position: 'absolute',
            left: '3',
            top: '1/2',
            transform: 'translateY(-50%)',
            color: 'text.dim',
          })}
          size={18}
        />
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
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
            _focus: { borderColor: 'primary.default' },
          })}
        />
      </div>

      <StandardTable
        data={data}
        columns={columns}
        virtualized
        height="100%"
        estimateRowHeight={45}
      />

      <div className={css({ fontSize: 'xs', color: 'text.dim', px: '2' })}>
        Showing {data.length.toLocaleString()} assets (Virtualized)
      </div>
    </div>
  )
}
