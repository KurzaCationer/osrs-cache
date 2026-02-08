import React, { useMemo, useState } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { css } from './styled-system/css'
import { JsonViewer } from './JsonViewer'
import { StandardTable } from './StandardTable'

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
  }, [])

  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '4', h: 'calc(100vh - 300px)' })}>
      <StandardTable 
        data={data} 
        columns={columns} 
        virtualized 
        height="100%"
        estimateRowHeight={60}
      />
    </div>
  )
}


function JsonValueWrapper({ value }: { value: any }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (typeof value !== 'object' || value === null) {
    return <span>{JSON.stringify(value)}</span>
  }

  const propertyCount = Array.isArray(value) ? value.length : Object.keys(value).length

  return (
    <div className={css({ fontFamily: 'mono', fontSize: 'xs', maxWidth: '100%', overflow: 'hidden' })}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={css({ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2', 
          color: 'secondary.default', 
          bg: 'transparent', 
          border: 'none', 
          cursor: 'pointer',
          p: '1',
          rounded: 'sm',
          _hover: { bg: 'bg.muted' }
        })}
      >
        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span className={css({ fontWeight: 'bold' })}>{propertyCount} Items</span>
      </button>
      
      {isExpanded && (
        <div className={css({ mt: '2' })}>
          <JsonViewer value={value} />
        </div>
      )}
    </div>
  )
}