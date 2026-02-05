import { useState, Fragment, useMemo } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
  type SortingState,
  type ExpandedState,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp, ChevronsUpDown, Info, ExternalLink } from 'lucide-react'
import type { AssetCounts } from '@kurza/osrs-cache-loader'
import { ASSET_MAPPINGS } from './AssetMappings'
import { css } from '../styled-system/css'

export interface AssetSummaryRow {
  id: keyof AssetCounts
  name: string
  count: number
  percentage: number
  index: number
  archive?: number
}

export interface AssetSummaryTableProps {
  counts: Partial<AssetCounts>
}

export function transformData(counts: Partial<AssetCounts>): AssetSummaryRow[] {
  const entries = Object.entries(counts) as [keyof AssetCounts, number][]
  const total = entries.reduce((acc, [_, count]) => acc + count, 0)

  return entries
    .map(([id, count]) => {
      const mapping = ASSET_MAPPINGS[id]
      if (!mapping) return null

      return {
        id,
        name: mapping.title,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        index: mapping.index,
        archive: mapping.archive,
      }
    })
    .filter((row): row is AssetSummaryRow => row !== null)
}

const columnHelper = createColumnHelper<AssetSummaryRow>()

function ExpandedRowContent({ row }: { row: AssetSummaryRow }) {
  const mapping = ASSET_MAPPINGS[row.id]
  
  return (
    <div className={css({ 
      p: '6', 
      bg: 'gray.900/80', 
      borderLeft: '4px solid', 
      borderColor: mapping.color,
      display: 'grid',
      gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
      gap: '6'
    })}>
      <div>
        <h4 className={css({ fontSize: 'sm', fontWeight: 'bold', color: 'gray.400', mb: '3', textTransform: 'uppercase', letterSpacing: 'tight' })}>
          Technical Mapping
        </h4>
        <div className={css({ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'x-4 y-2', fontSize: 'sm' })}>
          <span className={css({ color: 'gray.500' })}>Index:</span>
          <span className={css({ color: 'white', fontFamily: 'mono' })}>{row.index}</span>
          
          <span className={css({ color: 'gray.500' })}>Archive:</span>
          <span className={css({ color: 'white', fontFamily: 'mono' })}>{row.archive ?? 'N/A (All Archives)'}</span>
          
          <span className={css({ color: 'gray.500' })}>Type:</span>
          <span className={css({ color: 'white' })}>{row.archive ? 'Multiple Files per Archive' : 'Single File per Archive'}</span>
        </div>
      </div>
      
      <div>
        <h4 className={css({ fontSize: 'sm', fontWeight: 'bold', color: 'gray.400', mb: '3', textTransform: 'uppercase', letterSpacing: 'tight' })}>
          Context
        </h4>
        <p className={css({ fontSize: 'sm', color: 'gray.300', mb: '4', lineHeight: 'relaxed' })}>
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
            bg: 'gray.800', 
            hover: { bg: 'gray.700' }, 
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

export function AssetSummaryTable({ counts }: AssetSummaryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'count', desc: true }
  ])
  const [expanded, setExpanded] = useState<ExpandedState>({})
  
  // CRITICAL: Data and columns MUST be memoized to prevent infinite re-render loops
  // which can hang the browser during interactions like sorting.
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
              className={css({ p: '1.5', bg: 'gray.900', rounded: 'md', border: '1px solid', borderColor: 'gray.800' })}
            >
              <Icon size={18} />
            </div>
            <span className={css({ fontWeight: 'semibold', color: 'white' })}>{info.getValue()}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor('count', {
      header: 'Count',
      cell: (info) => (
        <span className={css({ fontFamily: 'mono', color: 'gray.100' })}>
          {info.getValue().toLocaleString()}
        </span>
      ),
    }),
    columnHelper.accessor('percentage', {
      header: 'Percentage',
      cell: (info) => (
        <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
          <div className={css({ flex: '1', minW: '60px', h: '2', bg: 'gray.800', rounded: 'full', overflow: 'hidden' })}>
            <div 
              className={css({ h: 'full', bg: 'blue.500' })} 
              style={{ width: `${info.getValue()}%` }}
            />
          </div>
          <span className={css({ fontSize: 'xs', color: 'gray.400', minW: '40px', textAlign: 'right' })}>
            {info.getValue().toFixed(1)}%
          </span>
        </div>
      ),
    }),
    columnHelper.accessor((row) => `${row.index}${row.archive ? `:${row.archive}` : ''}`, {
      id: 'mapping',
      header: 'OpenRS2 Mapping',
      cell: (info) => (
        <code className={css({ fontSize: 'xs', px: '2', py: '1', bg: 'gray.900', color: 'blue.300', rounded: 'md', border: '1px solid', borderColor: 'gray.800' })}>
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
            color: info.row.getIsExpanded() ? 'blue.400' : 'gray.500', 
            hover: { bg: 'gray.700', color: 'white' },
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
    getRowId: (row) => row.id, // Stable row IDs
  })

  return (
    <div className={css({ overflowX: 'auto', bg: 'gray.800', rounded: 'xl', border: '1px solid', borderColor: 'gray.700' })}>
      <table className={css({ w: 'full', borderCollapse: 'collapse', textAlign: 'left' })}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={css({ borderBottom: '1px solid', borderColor: 'gray.700', bg: 'gray.900/50' })}>
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
                      color: 'gray.400', 
                      letterSpacing: 'wider',
                      cursor: isSortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      _hover: isSortable ? { color: 'white' } : {}
                    })}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      
                      {isSortable && (
                        <span className={css({ color: header.column.getIsSorted() ? 'blue.400' : 'gray.600' })}>
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
                  borderColor: 'gray.700/50',
                  bg: row.getIsExpanded() ? 'gray.900/30' : 'transparent',
                  _hover: { bg: 'gray.700/30' },
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