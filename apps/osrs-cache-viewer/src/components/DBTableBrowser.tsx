import React, { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { StandardTable } from '@kurza/ui-components'
import { createColumnHelper } from '@tanstack/react-table'
import { css } from '../styled-system/css'

export function DBTableBrowser({ data }: { data: Array<Record<string, any>> }) {
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Record<string, any>>()
    return [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => <span className={css({ fontWeight: 'bold' })}>{info.getValue()}</span>,
      }),
      columnHelper.accessor('types', {
        header: 'Columns',
        cell: (info) => info.getValue()?.length ?? 0,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <Link 
            to="/browse/$type" 
            params={{ type: 'dbRow' }} 
            search={(prev: Record<string, any>) => ({ ...prev, tableId: info.row.original.id, offset: 0 })}
            className={css({ color: 'primary.default', fontWeight: 'medium', _hover: { textDecoration: 'underline' } })}
          >
            View Rows
          </Link>
        ),
      }),
    ]
  }, [])

  return (
    <div data-testid="db-table-browser">
      <StandardTable 
        data={data} 
        columns={columns}
      />
    </div>
  )
}

