import { createServerFn } from '@tanstack/react-start'
import { getAssetsByType } from '@kurza/osrs-cache-loader'
import type { AssetCounts } from '@kurza/osrs-cache-loader'
import { queryOptions } from '@tanstack/react-query'

/**
 * Server function to fetch all assets of a specific type.
 */
export const fetchAssets = createServerFn({
  method: 'GET',
}).handler(async ({ data }: { data: { type: keyof AssetCounts, limit?: number, offset?: number } }) => {
    const { type, limit, offset } = data;
    try {
      return await getAssetsByType(type, { game: 'oldschool' }, limit, offset)
    } catch (error) {
      console.error(`Failed to load assets for type ${type}:`, error)
      throw new Error(`Failed to load ${type} data.`)
    }
  })

/**
 * TanStack Query options for fetching assets by type.
 */
export const assetsQueryOptions = (type: keyof AssetCounts, limit?: number, offset?: number) => queryOptions({
  queryKey: ['assets', type, limit, offset],
  queryFn: () => fetchAssets({ data: { type, limit, offset } }),
})
