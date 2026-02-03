import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
} from '@tanstack/react-table'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'

import { makeData } from '@/data/demo-table-data'

import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingFn,
} from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import type { Person } from '@/data/demo-table-data'
import { css } from '../../styled-system/css'

export const Route = createFileRoute('/demo/table')({
  component: TableDemo,
})

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!,
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

function TableDemo() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [globalFilter, setGlobalFilter] = React.useState('')

  const columns = React.useMemo<ColumnDef<Person, any>[]>(
    () => [
      {
        accessorKey: 'id',
        filterFn: 'equalsString', //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        filterFn: 'includesStringSensitive', //note: normal non-fuzzy filter column - case sensitive
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        filterFn: 'includesString', //note: normal non-fuzzy filter column - case insensitive
      },
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: 'fullName',
        header: 'Full Name',
        cell: (info) => info.getValue(),
        filterFn: 'fuzzy', //using our custom fuzzy filter function
        // filterFn: fuzzyFilter, //or just define with the function
        sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
      },
    ],
    [],
  )

  const [data, setData] = React.useState<Person[]>(() => makeData(5_000))
  const refreshData = () => setData((_old) => makeData(50_000)) //stress test

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy', //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  //apply the fuzzy sort if the fullName column is being filtered
  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])

  return (
    <div className={css({ minH: 'screen', bg: 'gray.900', p: '6' })}>
      <div>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          className={css({
            w: 'full',
            p: '3',
            bg: 'gray.800',
            color: 'white',
            rounded: 'lg',
            borderWidth: '1px',
            borderColor: 'gray.700',
            outline: 'none',
            _focus: { ringWidth: '2', ringColor: 'blue.500', borderColor: 'transparent' }
          })}
          placeholder="Search all columns..."
        />
      </div>
      <div className={css({ h: '4' })} />
      <div className={css({ overflowX: 'auto', rounded: 'lg', borderWidth: '1px', borderColor: 'gray.700' })}>
        <table className={css({ w: 'full', fontSize: 'sm', color: 'gray.200' })}>
          <thead className={css({ bg: 'gray.800', color: 'gray.100' })}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={css({ px: '4', py: '3', textAlign: 'left' })}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? css({ cursor: 'pointer', userSelect: 'none', transition: 'colors', _hover: { color: 'blue.400' } })
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div className={css({ mt: '2' })}>
                              <Filter column={header.column} />
                            </div>
                          ) : null}
                        </>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className={css({ divideY: '1px', divideColor: 'gray.700' })}>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className={css({ transition: 'colors', _hover: { bg: 'gray.800' } })}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className={css({ px: '4', py: '3' })}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className={css({ h: '4' })} />
      <div className={css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2', color: 'gray.200' })}>
        <button
          className={css({
            px: '3', py: '1', bg: 'gray.800', rounded: 'md',
            _hover: { bg: 'gray.700' },
            _disabled: { opacity: '0.5', cursor: 'not-allowed' }
          })}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className={css({
            px: '3', py: '1', bg: 'gray.800', rounded: 'md',
            _hover: { bg: 'gray.700' },
            _disabled: { opacity: '0.5', cursor: 'not-allowed' }
          })}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className={css({
            px: '3', py: '1', bg: 'gray.800', rounded: 'md',
            _hover: { bg: 'gray.700' },
            _disabled: { opacity: '0.5', cursor: 'not-allowed' }
          })}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className={css({
            px: '3', py: '1', bg: 'gray.800', rounded: 'md',
            _hover: { bg: 'gray.700' },
            _disabled: { opacity: '0.5', cursor: 'not-allowed' }
          })}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className={css({ display: 'flex', alignItems: 'center', gap: '1' })}>
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className={css({ display: 'flex', alignItems: 'center', gap: '1' })}>
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className={css({
              w: '16', px: '2', py: '1', bg: 'gray.800', rounded: 'md', borderWidth: '1px', borderColor: 'gray.700', outline: 'none',
              _focus: { ringWidth: '2', ringColor: 'blue.500', borderColor: 'transparent' }
            })}
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
          className={css({
            px: '2', py: '1', bg: 'gray.800', rounded: 'md', borderWidth: '1px', borderColor: 'gray.700', outline: 'none',
            _focus: { ringWidth: '2', ringColor: 'blue.500', borderColor: 'transparent' }
          })}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div className={css({ mt: '4', color: 'gray.400' })}>
        {table.getPrePaginationRowModel().rows.length} Rows
      </div>
      <div className={css({ mt: '4', display: 'flex', gap: '2' })}>
        <button
          onClick={() => rerender()}
          className={css({
            px: '4', py: '2', bg: 'blue.600', color: 'white', rounded: 'md', transition: 'colors',
            _hover: { bg: 'blue.700' }
          })}
        >
          Force Rerender
        </button>
        <button
          onClick={() => refreshData()}
          className={css({
            px: '4', py: '2', bg: 'blue.600', color: 'white', rounded: 'md', transition: 'colors',
            _hover: { bg: 'blue.700' }
          })}
        >
          Refresh Data
        </button>
      </div>
      <pre className={css({ mt: '4', p: '4', bg: 'gray.800', rounded: 'lg', color: 'gray.300', overflow: 'auto' })}>
        {JSON.stringify(
          {
            columnFilters: table.getState().columnFilters,
            globalFilter: table.getState().globalFilter,
          },
          null,
          2,
        )}
      </pre>
    </div>
  )
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue()

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      className={css({
        w: 'full', px: '2', py: '1', bg: 'gray.700', color: 'white', rounded: 'md', borderWidth: '1px', borderColor: 'gray.600', outline: 'none',
        _focus: { ringWidth: '2', ringColor: 'blue.500', borderColor: 'transparent' }
      })}
    />
  )
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}