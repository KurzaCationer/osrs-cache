import React, { Fragment, useMemo, useState } from 'react'
import { css } from './styled-system/css'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp, ChevronsUpDown, ExternalLink, Info } from 'lucide-react'
import { ASSET_MAPPINGS } from './AssetMappings'
import type {ExpandedState, SortingState} from '@tanstack/react-table';
import type { AssetCounts } from '@kurza/osrs-cache-loader'

/**
 * Represents a single row in the asset summary table.
 */
export interface AssetSummaryRow {
  /** The unique key for the asset type. */
  id: keyof AssetCounts
  /** The human-readable name. */
  name: string
  /** The total count found in the cache. */
  count: number
  /** The percentage of total assets this type represents. */
  percentage: number
  /** The cache index ID. */
  index: number
  /** The cache archive ID (if applicable). */
  archive?: number
}

/**
 * Props for the AssetSummaryTable component.
 */
export interface AssetSummaryTableProps {
  /** The asset counts to display. */
  counts: Partial<AssetCounts>
}

/**
 * Transforms raw asset counts into a format suitable for the summary table.
 * 
 * @param counts The raw asset counts.
 * @returns An array of AssetSummaryRow objects.
 */
export function transformData(counts: Partial<AssetCounts>): Array<AssetSummaryRow> {
  const entries = Object.entries(counts) as Array<[keyof AssetCounts, number]>
  const total = entries.reduce((acc, [_, count]) => acc + count, 0)

  return entries
    .map(([id, count]) => {
      const mapping = ASSET_MAPPINGS[id]

      return {
        id,
        name: mapping.title,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        index: mapping.index,
        archive: mapping.archive,
      }
    })
}

const columnHelper = createColumnHelper<AssetSummaryRow>()

/**
 * Renders the expanded content for an asset row, showing technical details.
 * @internal
 */
function ExpandedRowContent({ row }: { row: AssetSummaryRow }) {
  const mapping = ASSET_MAPPINGS[row.id]
  
  return (
    <div className={css({ 
      p: '6', 
      bg: 'bg.surface', 
      borderLeft: '4px solid', 
      borderColor: mapping.color,
      display: 'grid',
      gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
      gap: '6'
    })}>
      <div>
        <h4 className={css({ fontSize: 'sm', fontWeight: 'bold', color: 'text.muted', mb: '3', textTransform: 'uppercase', letterSpacing: 'tight' })}>
          Technical Mapping
        </h4>
        <div className={css({ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'x-4 y-2', fontSize: 'sm' })}>
          <span className={css({ color: 'text.dim' })}>Index:</span>
          <span className={css({ color: 'text.main', fontFamily: 'mono' })}>{row.index}</span>
          
          <span className={css({ color: 'text.dim' })}>Archive:</span>
          <span className={css({ color: 'text.main', fontFamily: 'mono' })}>{row.archive ?? 'N/A (All Archives)'}</span>
          
          <span className={css({ color: 'text.dim' })}>Type:</span>
          <span className={css({ color: 'text.main' })}>{row.archive ? 'Multiple Files per Archive' : 'Single File per Archive'}</span>
        </div>
      </div>
      
      <div>
        <h4 className={css({ fontSize: 'sm', fontWeight: 'bold', color: 'text.muted', mb: '3', textTransform: 'uppercase', letterSpacing: 'tight' })}>
          Context
        </h4>
        <p className={css({ fontSize: 'sm', color: 'text.muted', mb: '4', lineHeight: 'relaxed' })}>
          {row.name} are stored in the OSRS cache {row.archive ? `within archive ${row.archive} of index ${row.index}` : `across all archives of index ${row.index}`}. 
          Each entry contains the raw configuration data used by the game client.
        </p>
        <button 
          className={css({ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2', 
            px: '3', 
            py: '2', 
            bg: 'bg.active', 
            _hover: { bg: 'bg.muted' }, 
            rounded: 'lg', 
            fontSize: 'xs', 
            fontWeight: 'medium', 
            transition: 'colors' 
          })}
          onClick={() => alert('Browser functionality coming soon!')}
        >
          <ExternalLink size={14} />
          Browse {row.name}
        </button>
      </div>
    </div>
  )
}

/**
 * A data table component that displays a summary of OSRS cache assets.
 * Supports sorting and expanding rows for technical details.
 */
export function AssetSummaryTable({ counts }: AssetSummaryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'count', desc: true }
  ])
  const [expanded, setExpanded] = useState<ExpandedState>({})
  
  const data = useMemo(() => transformData(counts), [counts])

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Asset Type',
      cell: (info) => {
        const row = info.row.original
        const mapping = ASSET_MAPPINGS[row.id]
        const Icon = mapping.icon
        return (
          <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
            <div 
              style={{ color: mapping.color }}
              className={css({ p: '1.5', bg: 'bg.surface', rounded: 'md', border: '1px solid', borderColor: 'border.default' })}
            >
              <Icon size={18} />
            </div>
            <span className={css({ fontWeight: 'semibold', color: 'text.main' })}>{info.getValue()}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor('count', {
      header: 'Count',
      cell: (info) => (
        <span className={css({ fontFamily: 'mono', color: 'text.main' })}>
          {info.getValue().toLocaleString()}
        </span>
      ),
    }),
    columnHelper.accessor('percentage', {
      header: 'Percentage',
      cell: (info) => (
        <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
          <div className={css({ flex: '1', minW: '60px', h: '2', bg: 'bg.active', rounded: 'full', overflow: 'hidden' })}>
            <div 
              className={css({ h: 'full', bg: 'secondary.default' })} 
              style={{ width: `${info.getValue()}%` }}
            />
          </div>
          <span className={css({ fontSize: 'xs', color: 'text.dim', minW: '40px', textAlign: 'right' })}>
            {info.getValue().toFixed(1)}%
          </span>
        </div>
      ),
    }),
    columnHelper.accessor((row) => `${row.index}${row.archive ? `:${row.archive}` : ''}`, {
      id: 'mapping',
      header: 'OpenRS2 Mapping',
      cell: (info) => (
        <code className={css({ fontSize: 'xs', px: '2', py: '1', bg: 'bg.surface', color: 'secondary.default', rounded: 'md', border: '1px solid', borderColor: 'border.default' })}>
          {info.getValue()}
        </code>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => (
        <button
          onClick={info.row.getToggleExpandedHandler()}
          className={css({ 
            p: '2', 
            rounded: 'lg', 
            color: info.row.getIsExpanded() ? 'secondary.default' : 'text.dim', 
            _hover: { bg: 'bg.active', color: 'text.main' },
            transition: 'all 0.2s'
          })}
        >
          <Info size={18} />
        </button>
      ),
    }),
  ], [])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      expanded,
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    getRowId: (row) => row.id,
  })

  return (
    <div className={css({ overflowX: 'auto', bg: 'bg.surface', rounded: 'xl', border: '1px solid', borderColor: 'border.default' })}>
      <table className={css({ w: 'full', borderCollapse: 'collapse', textAlign: 'left' })}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={css({ borderBottom: '1px solid', borderColor: 'border.default', bg: 'bg.muted' })}>
              {headerGroup.headers.map((header) => {
                const isSortable = header.column.getCanSort()
                
                return (
                  <th 
                    key={header.id} 
                    className={css({ 
                      p: '4', 
                      fontSize: 'xs', 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      color: 'text.muted', 
                      letterSpacing: 'wider',
                      cursor: isSortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      _hover: isSortable ? { color: 'text.main' } : {}
                    })}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      
                      {isSortable && (
                        <span className={css({ color: header.column.getIsSorted() ? 'secondary.default' : 'text.dim' })}>
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp size={14} />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronsUpDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <tr 
                className={css({ 
                  borderBottom: '1px solid', 
                  borderColor: 'border.subtle',
                  bg: row.getIsExpanded() ? 'bg.muted' : 'transparent',
                  _hover: { bg: 'bg.active' },
                  transition: 'background-color 0.2s'
                })}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={css({ p: '4' })}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {row.getIsExpanded() && (
                <tr>
                  <td colSpan={row.getVisibleCells().length} className={css({ p: '0' })}>
                    <ExpandedRowContent row={row.original} />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}