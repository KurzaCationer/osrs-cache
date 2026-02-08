// @vitest-environment jsdom
import React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { StandardTable } from './StandardTable'

describe('StandardTable', () => {
  afterEach(cleanup)

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Name', accessorKey: 'name' },
  ]
  const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ]

  it('renders headers correctly', () => {
    render(<StandardTable columns={columns} data={data} />)
    expect(screen.getByText('ID')).toBeTruthy()
    expect(screen.getByText('Name')).toBeTruthy()
  })

  it('renders data correctly', () => {
    render(<StandardTable columns={columns} data={data} />)
    expect(screen.getAllByText('Item 1')).toHaveLength(1)
    expect(screen.getAllByText('Item 2')).toHaveLength(1)
  })

  it('supports custom cell rendering', () => {
    const customColumns = [
      {
        header: 'ID',
        accessorKey: 'id',
        cell: (info: { getValue: () => React.ReactNode }) => (
          <span data-testid="custom-id">{info.getValue()}</span>
        ),
      },
    ]
    render(<StandardTable columns={customColumns} data={data} />)
    expect(screen.getAllByTestId('custom-id')).toHaveLength(2)
  })
})
