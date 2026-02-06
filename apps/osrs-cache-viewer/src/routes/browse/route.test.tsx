import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowseTypeContent } from './$type'

vi.mock('@kurza/ui-components', async () => {

  const actual = await vi.importActual('@kurza/ui-components')

  return {

    ...actual,

    JsonAssetTable: ({ data }: any) => (

      <div data-testid="json-asset-table">

        Mock Table with {data?.length} rows

      </div>

    ),

  }

})



describe('Browse Type Route', () => {

  it('renders the browse type page with the correct type when data is loaded', () => {

    render(<BrowseTypeContent type="items" data={[{ id: 1, name: 'Bronze sword' }]} isLoading={false} isError={false} limit={50} offset={0} />)

    expect(screen.getByText('Browsing items')).toBeDefined()

    expect(screen.getByTestId('json-asset-table')).toBeDefined()

  })



  it('renders loading state', () => {

    render(<BrowseTypeContent type="items" isLoading={true} isError={false} limit={50} offset={0} />)

    expect(screen.getByText(/Loading assets from cache/i)).toBeDefined()

  })



  it('renders error state', () => {

    render(<BrowseTypeContent type="items" isLoading={false} isError={true} limit={50} offset={0} />)

    expect(screen.getByText(/Failed to load assets/i)).toBeDefined()

  })

})
