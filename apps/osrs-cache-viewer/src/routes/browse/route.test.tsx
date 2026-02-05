import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowseTypeContent } from './$type'

vi.mock('@kurza/ui-components', async () => {
  const actual = await vi.importActual('@kurza/ui-components')
  return {
    ...actual,
    AssetDataTable: ({ data }: any) => (
      <div data-testid="asset-data-table">
        Mock Table with {data?.length} rows
      </div>
    ),
  }
})

describe('Browse Type Route', () => {
  it('renders the browse type page with the correct type when data is loaded', () => {
    render(<BrowseTypeContent type="items" data={[{ id: 1, name: 'Bronze sword' }]} isLoading={false} isError={false} />)
    expect(screen.getByText('Browsing items')).toBeDefined()
    expect(screen.getByTestId('asset-data-table')).toBeDefined()
  })

  it('renders loading state', () => {
    render(<BrowseTypeContent type="items" isLoading={true} isError={false} />)
    expect(screen.getByText(/Loading assets from cache/i)).toBeDefined()
  })

  it('renders error state', () => {
    render(<BrowseTypeContent type="items" isLoading={false} isError={true} />)
    expect(screen.getByText(/Failed to load assets/i)).toBeDefined()
  })
})