import React from 'react'
import { Link } from '@tanstack/react-router'
import { css } from '../styled-system/css'

export function DBTableBrowser({ data }: { data: any[] }) {
  return (
    <div data-testid="db-table-browser" className={css({ overflow: 'auto', bg: 'bg.surface', rounded: 'xl', border: '1px solid', borderColor: 'border.default' })}>
      <table className={css({ w: 'full', borderCollapse: 'collapse', textAlign: 'left' })}>
        <thead className={css({ bg: 'bg.muted' })}>
          <tr className={css({ borderBottom: '1px solid', borderColor: 'border.default' })}>
            <th className={css({ p: '4', fontSize: 'xs', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.muted' })}>ID</th>
            <th className={css({ p: '4', fontSize: 'xs', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.muted' })}>Columns</th>
            <th className={css({ p: '4', fontSize: 'xs', fontWeight: 'bold', textTransform: 'uppercase', color: 'text.muted' })}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((table) => (
            <tr key={table.id} className={css({ borderBottom: '1px solid', borderColor: 'border.subtle', _hover: { bg: 'bg.active' } })}>
              <td className={css({ p: '4', fontSize: 'sm', fontWeight: 'bold' })}>{table.id}</td>
              <td className={css({ p: '4', fontSize: 'sm' })}>{table.types?.length ?? 0}</td>
              <td className={css({ p: '4', fontSize: 'sm' })}>
                <Link 
                  to="/browse/$type" 
                  params={{ type: 'dbRow' }} 
                  search={(prev: any) => ({ ...prev, tableId: table.id, offset: 0 })}
                  className={css({ color: 'primary.default', fontWeight: 'medium', _hover: { textDecoration: 'underline' } })}
                >
                  View Rows
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
