import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowseTypeContent } from './$type'

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return {
    ...actual,
    Link: ({ children, to: _to, params: _params, search: _search, ...props }: { children: React.ReactNode, to?: string, params?: unknown, search?: unknown }) => (
      <a href="#" data-testid="router-link" {...props}>
        {children}
      </a>
    ),
    useNavigate: () => vi.fn(),
    useSearch: () => ({}),
  }
})

vi.mock('@kurza/ui-components', async () => {
  const actual = await vi.importActual('@kurza/ui-components')
  return {
    ...actual,
    JsonAssetTable: ({ data }: { data: Array<unknown> }) => (
      <div data-testid="json-asset-table">
        Mock Table with {data.length} rows
      </div>
    ),
  }
})

vi.mock('../../components/DBTableBrowser', () => ({
  DBTableBrowser: ({ data }: { data: Array<unknown> }) => (
    <div data-testid="db-table-browser">DB Table with {data.length} rows</div>
  ),
}))

vi.mock('../../components/SpriteCanvas', () => ({
  SpriteCanvas: ({ data }: { data: { id: number } }) => (
    <div data-testid="sprite-canvas">Sprite {data.id}</div>
  ),
}))

describe('Browse Type Route', () => {
  it('renders the browse type page with the correct type when data is loaded', () => {
    render(
      <BrowseTypeContent
        type="items"
        data={[{ id: 1, name: 'Bronze sword' }]}
        isLoading={false}
        isError={false}
        limit={50}
        offset={0}
      />,
    )
    expect(screen.getByText('Browsing items')).toBeDefined()
    expect(screen.getByTestId('json-asset-table')).toBeDefined()
  })

  it('renders loading state', () => {
    render(
      <BrowseTypeContent
        type="items"
        isLoading={true}
        isError={false}
        limit={50}
        offset={0}
      />,
    )
    expect(screen.getByText(/Loading assets from cache/i)).toBeDefined()
  })

  it('renders error state', () => {
    render(
      <BrowseTypeContent
        type="items"
        isLoading={false}
        isError={true}
        limit={50}
        offset={0}
      />,
    )
    expect(screen.getByText(/Failed to load assets/i)).toBeDefined()
  })

  it('renders SpriteCanvas grid for sprites', () => {
    render(
      <BrowseTypeContent
        type="sprite"
        data={[{ id: 100, width: 10 }]}
        isLoading={false}
        isError={false}
        limit={50}
        offset={0}
      />,
    )
    expect(screen.getAllByTestId('sprite-canvas').length).toBe(1)
    expect(screen.queryByTestId('json-asset-table')).toBeNull()
  })

  it('renders JsonAssetTable for healthBar', () => {
    render(
      <BrowseTypeContent
        type="healthBar"
        data={[{ id: 1, duration: 50 }]}
        isLoading={false}
        isError={false}
        limit={50}
        offset={0}
      />,
    )
    expect(screen.getByTestId('json-asset-table')).toBeDefined()
    expect(screen.queryByTestId('sprite-canvas')).toBeNull()
  })

  it('renders specialized view for dbTable', () => {
    render(
      <BrowseTypeContent
        type="dbTable"
        data={[{ id: 1 }]}
        isLoading={false}
        isError={false}
        limit={50}
        offset={0}
      />,
    )
    expect(screen.getByTestId('db-table-browser')).toBeDefined()
  })

  it('renders JsonAssetTable for dbRow with tableId', () => {
    render(
      <BrowseTypeContent
        type="dbRow"
        tableId={1}
        data={[{ id: 1, values: [] }]}
        isLoading={false}
        isError={false}
        limit={50}
        offset={0}
      />,
    )
    expect(screen.getByText('Browsing dbRow (Table 1)')).toBeDefined()
    expect(screen.getByTestId('json-asset-table')).toBeDefined()
  })
})
