import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DBTableBrowser } from './DBTableBrowser'

// Mock Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}))

// Mock StandardTable
vi.mock('@kurza/ui-components', () => ({
  StandardTable: ({ data, columns }: any) => (
    <div data-testid="standard-table">
      <table>
        <thead>
          <tr>
            {columns.map((col: any, i: number) => (
              <th key={i}>{typeof col.header === 'string' ? col.header : 'Header'}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.types?.length}</td>
              <td>View Rows</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}))

describe('DBTableBrowser', () => {
  const mockData = [
    { id: 1, types: [1, 2, 3] },
    { id: 2, types: [1, 2] },
  ]

  it('renders table headers', () => {
    render(<DBTableBrowser data={mockData} />)
    expect(screen.getByText('ID')).toBeTruthy()
    expect(screen.getByText('Columns')).toBeTruthy()
    expect(screen.getByText('Actions')).toBeTruthy()
  })

  it('renders table rows', () => {
    render(<DBTableBrowser data={mockData} />)
    expect(screen.getByText('1')).toBeTruthy()
    expect(screen.getAllByText('2')).toHaveLength(2) // ID 2 and 2 columns for ID 2
    expect(screen.getByText('3')).toBeTruthy() // Columns for ID 1
    expect(screen.getAllByText('View Rows')).toHaveLength(2)
  })
})