import React, { Fragment, useMemo, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ExternalLink,
  Info,
} from 'lucide-react'
import { css, cva } from './styled-system/css'

import { ASSET_MAPPINGS } from './AssetMappings'
import type { ExpandedState, SortingState } from '@tanstack/react-table'
import type { AssetCounts } from '@kurza/osrs-cache-loader'

const statusBadge = cva({
  base: {
    display: 'inline-flex',
    px: '2.5',
    py: '0.5',
    rounded: 'full',
    fontSize: 'xs',
    fontWeight: 'bold',
    border: '1px solid',
  },
  variants: {
    status: {
      Implemented: {
        bg: 'success.muted',
        color: 'secondary.default', // Keeps secondary.default as per design or should it be success.default?
        borderColor: 'success.border',
      },
      'Encoded Only': {
        bg: 'bg.muted',
        color: 'text.dim',
        borderColor: 'border.default',
      },
    },
  },
})

const actionButtonStyle = cva({
  base: {
    p: '2',
    rounded: 'lg',
    transition: 'all 0.2s',
    _hover: { bg: 'bg.active', color: 'text.main' },
  },
  variants: {
    isExpanded: {
      true: { color: 'secondary.default' },
      false: { color: 'text.dim' },
    },
  },
})

const tableHeaderStyle = cva({
  base: {
    p: '4',
    fontSize: 'xs',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'text.muted',
    letterSpacing: 'wider',
    userSelect: 'none',
  },
  variants: {
    isSortable: {
      true: {
        cursor: 'pointer',
        _hover: { color: 'text.main' },
      },
      false: {
        cursor: 'default',
      },
    },
  },
})

const sortIconStyle = cva({
  base: {},
  variants: {
    isSorted: {
      true: { color: 'secondary.default' },
      false: { color: 'text.dim' },
    },
  },
})

const tableRowStyle = cva({
  base: {
    borderBottom: '1px solid',
    borderColor: 'border.subtle',
    _hover: { bg: 'bg.active' },
    transition: 'background-color 0.2s',
  },
  variants: {
    isExpanded: {
      true: { bg: 'bg.muted' },
      false: { bg: 'transparent' },
    },
  },
})

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
  /** Whether the decoding is implemented. */
  status: 'Implemented' | 'Encoded Only'
}

/**
 * List of asset types that have full decoding implementation in the loader.
 */
const IMPLEMENTED_TYPES: Array<keyof AssetCounts> = [
  'item',
  'npc',
  'obj',
  'enum',
  'struct',
  'param',
  'underlay',
  'animation',
  'sprite',
  'hitsplat',
  'healthBar',
  'dbRow',
  'dbTable',
  'worldEntity',
]

/**
 * Props for the AssetSummaryTable component.
 */
export interface AssetSummaryTableProps {
  /** The asset counts to display. */
  counts: Partial<AssetCounts>
  /** Optional function to render a custom browse link/button. */
  renderBrowseLink?: (id: keyof AssetCounts, name: string) => React.ReactNode
}

/**
 * Transforms raw asset counts into a format suitable for the summary table.
 *
 * @param counts The raw asset counts.
 * @returns An array of AssetSummaryRow objects.
 */
export function transformData(
  counts: Partial<AssetCounts>,
): Array<AssetSummaryRow> {
  const entries = Object.entries(counts) as Array<[keyof AssetCounts, number]>
  const total = entries.reduce((acc, [_, count]) => acc + count, 0)

  return entries.map(([id, count]) => {
    const mapping = ASSET_MAPPINGS[id]

    return {
      id,
      name: mapping.title,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      index: mapping.index,
      archive: mapping.archive,
      status: IMPLEMENTED_TYPES.includes(id) ? 'Implemented' : 'Encoded Only',
    }
  })
}

const columnHelper = createColumnHelper<AssetSummaryRow>()

const statusText = cva({
  base: {
    fontWeight: 'bold',
  },
  variants: {
    status: {
      Implemented: {
        color: 'secondary.default',
      },
      'Encoded Only': {
        color: 'text.dim',
      },
    },
  },
})

/**
 * Renders the expanded content for an asset row, showing technical details.
 * @internal
 */
function ExpandedRowContent({
  row,
  renderBrowseLink,
}: {
  row: AssetSummaryRow
  renderBrowseLink?: AssetSummaryTableProps['renderBrowseLink']
}) {
  const mapping = ASSET_MAPPINGS[row.id]

  return (
    <div
      className={css({
        p: '6',
        bg: 'bg.surface',
        borderLeft: '4px solid',
        borderColor: 'var(--asset-color)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
        gap: '6',
      })}
      style={{ '--asset-color': mapping.color } as React.CSSProperties}
    >
      <div>
        <h4
          className={css({
            fontSize: 'sm',
            fontWeight: 'bold',
            color: 'text.muted',
            mb: '3',
            textTransform: 'uppercase',
            letterSpacing: 'tight',
          })}
        >
          Technical Mapping
        </h4>
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 'x-4 y-2',
            fontSize: 'sm',
          })}
        >
          <span className={css({ color: 'text.dim' })}>Index:</span>
          <span className={css({ color: 'text.main', fontFamily: 'mono' })}>
            {row.index}
          </span>

          <span className={css({ color: 'text.dim' })}>Archive:</span>
          <span className={css({ color: 'text.main', fontFamily: 'mono' })}>
            {row.archive ?? 'N/A (All Archives)'}
          </span>

          <span className={css({ color: 'text.dim' })}>Type:</span>
          <span className={css({ color: 'text.main' })}>
            {row.archive
              ? 'Multiple Files per Archive'
              : 'Single File per Archive'}
          </span>

          <span className={css({ color: 'text.dim' })}>Status:</span>
          <span className={statusText({ status: row.status })}>
            {row.status}
          </span>
        </div>
      </div>

      <div>
        <h4 className={h4Style}>Context</h4>
        <p
          className={css({
            fontSize: 'sm',
            color: 'text.muted',
            mb: '4',
            lineHeight: 'relaxed',
          })}
        >
          {row.name} are stored in the OSRS cache{' '}
          {row.archive
            ? `within archive ${row.archive} of index ${row.index}`
            : `across all archives of index ${row.index}`}
          .
          {row.status === 'Implemented'
            ? ' This type is fully decoded into structured data.'
            : ' Currently, only raw encoded data is accessible for this type.'}
        </p>
        {renderBrowseLink ? (
          renderBrowseLink(row.id, row.name)
        ) : (
          <button
            className={browseButtonStyle}
            onClick={() => alert('Browser functionality coming soon!')}
          >
            <ExternalLink size={14} />
            Browse {row.name}
          </button>
        )}
      </div>
    </div>
  )
}

const h4Style = css({
  fontSize: 'sm',
  fontWeight: 'bold',
  color: 'text.muted',
  mb: '3',
  textTransform: 'uppercase',
  letterSpacing: 'tight',
})

const browseButtonStyle = css({
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
  transition: 'colors',
})

/**
 * A data table component that displays a summary of OSRS cache assets.
 * Supports sorting and expanding rows for technical details.
 */
export function AssetSummaryTable({
  counts,
  renderBrowseLink,
}: AssetSummaryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'count', desc: true },
  ])
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const data = useMemo(() => transformData(counts), [counts])

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Asset Type',
        cell: (info) => {
          const row = info.row.original
          const mapping = ASSET_MAPPINGS[row.id]
          const Icon = mapping.icon
          return (
            <div
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '3',
              })}
            >
              <div
                style={{ color: mapping.color }}
                className={css({
                  p: '1.5',
                  bg: 'bg.surface',
                  rounded: 'md',
                  border: '1px solid',
                  borderColor: 'border.default',
                })}
              >
                <Icon size={18} />
              </div>
              <span
                className={css({ fontWeight: 'semibold', color: 'text.main' })}
              >
                {info.getValue()}
              </span>
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
      columnHelper.accessor('status', {
        header: 'Decoding Status',
        cell: (info) => {
          return (
            <span className={statusBadge({ status: info.getValue() })}>
              {info.getValue()}
            </span>
          )
        },
      }),
      columnHelper.accessor('percentage', {
        header: 'Percentage',
        cell: (info) => (
          <div
            className={css({ display: 'flex', alignItems: 'center', gap: '3' })}
          >
            <div
              className={css({
                flex: '1',
                minW: '60px',
                h: '2',
                bg: 'bg.active',
                rounded: 'full',
                overflow: 'hidden',
              })}
            >
              <div
                className={css({ h: 'full', bg: 'secondary.default' })}
                style={{ width: `${info.getValue()}%` }}
              />
            </div>
            <span
              className={css({
                fontSize: 'xs',
                color: 'text.dim',
                minW: '40px',
                textAlign: 'right',
              })}
            >
              {info.getValue().toFixed(1)}%
            </span>
          </div>
        ),
      }),
      columnHelper.accessor(
        (row) => `${row.index}${row.archive ? `:${row.archive}` : ''}`,
        {
          id: 'mapping',
          header: 'OpenRS2 Mapping',
          cell: (info) => (
            <code
              className={css({
                fontSize: 'xs',
                px: '2',
                py: '1',
                bg: 'bg.surface',
                color: 'secondary.default',
                rounded: 'md',
                border: '1px solid',
                borderColor: 'border.default',
              })}
            >
              {info.getValue()}
            </code>
          ),
        },
      ),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
          <button
            onClick={info.row.getToggleExpandedHandler()}
            className={actionButtonStyle({ isExpanded: info.row.getIsExpanded() })}
          >
            <Info size={18} />
          </button>
        ),
      }),
    ],
    [],
  )

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
    <div
      className={css({
        overflowX: 'auto',
        bg: 'bg.surface',
        rounded: 'xl',
        border: '1px solid',
        borderColor: 'border.default',
      })}
    >
      <table
        className={css({
          w: 'full',
          borderCollapse: 'collapse',
          textAlign: 'left',
        })}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className={css({
                borderBottom: '1px solid',
                borderColor: 'border.default',
                bg: 'bg.muted',
              })}
            >
              {headerGroup.headers.map((header) => {
                const isSortable = header.column.getCanSort()

                return (
                  <th
                    key={header.id}
                    className={tableHeaderStyle({ isSortable })}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div
                      className={css({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2',
                      })}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                      {isSortable && (
                        <span
                          className={sortIconStyle({
                            isSorted: !!header.column.getIsSorted(),
                          })}
                        >
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
              <tr className={tableRowStyle({ isExpanded: row.getIsExpanded() })}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={css({ p: '4' })}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {row.getIsExpanded() && (
                <tr>
                  <td
                    colSpan={row.getVisibleCells().length}
                    className={css({ p: '0' })}
                  >
                    <ExpandedRowContent
                      row={row.original}
                      renderBrowseLink={renderBrowseLink}
                    />
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
