import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { JsonAssetTable, Loader } from '@kurza/ui-components'
import { AlertCircle } from 'lucide-react'
import { AssetBrowserLayout } from '../../components/AssetBrowserLayout'
import { SpriteCanvas } from '../../components/SpriteCanvas'
import { DBTableBrowser } from '../../components/DBTableBrowser'
import { infiniteAssetsQueryOptions } from '../../integrations/osrs-cache-api'
import { css } from '../../styled-system/css'
import type { AssetCounts } from '@kurza/osrs-cache-loader'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export const Route = createFileRoute('/browse/$type')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      limit: Number(search.limit ?? 50),
      tableId:
        search.tableId !== undefined ? Number(search.tableId) : undefined,
    }
  },
  component: BrowseType,
  loader: async ({ params, context, search }) => {
    const type = params.type as keyof AssetCounts
    const limit = search?.limit ?? 50
    const tableId = search?.tableId

    await context.queryClient.ensureInfiniteQueryData(
      infiniteAssetsQueryOptions(type, limit, tableId),
    )
  },
})

export function BrowseTypeContent({
  type,
  data,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  tableId,
}: {
  type: string
  data: Array<unknown>
  isFetchingNextPage: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
  tableId?: number
}) {
  const title = `Browsing ${type}${tableId !== undefined ? ` (Table ${tableId})` : ''}`

  // Simple scroll listener for the sprite grid if needed
  useEffect(() => {
    if (type !== 'sprite') return

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [type, hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <AssetBrowserLayout title={title}>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
        })}
      >
        {type === 'sprite' ? (
          <div
            className={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '4',
            })}
          >
            {(data as Array<{ id: number }>).map((item) => (
              <div
                key={item.id}
                className={css({
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2',
                })}
              >
                <SpriteCanvas data={item} />
                <span className={css({ fontSize: 'xs', color: 'text.muted' })}>
                  ID: {item.id}
                </span>
              </div>
            ))}
          </div>
        ) : type === 'dbTable' ? (
          <DBTableBrowser
            data={(data ?? []) as Array<Record<string, unknown>>}
            onEndReached={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        ) : (
          <JsonAssetTable
            data={(data ?? []) as Array<Record<string, unknown>>}
            onEndReached={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}

        {(isFetchingNextPage || hasNextPage) && (
          <div
            className={css({
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: '8',
              gap: '2',
            })}
          >
            {isFetchingNextPage ? (
              <>
                <Loader size={20} />
                <span className={css({ fontSize: 'sm', color: 'text.muted' })}>
                  Loading more...
                </span>
              </>
            ) : (
              <span
                className={css({
                  fontSize: 'sm',
                  color: 'text.dim',
                  fontStyle: 'italic',
                })}
              >
                Scroll for more
              </span>
            )}
          </div>
        )}
      </div>
    </AssetBrowserLayout>
  )
}

export function BrowseType() {
  const { type } = Route.useParams()
  const search = Route.useSearch()
  const limit = search?.limit ?? 50
  const tableId = search?.tableId

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      infiniteAssetsQueryOptions(type as keyof AssetCounts, limit, tableId),
    )

  const allAssets = data.pages.flat()

  return (
    <BrowseTypeContent
      type={type}
      data={allAssets}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      tableId={tableId}
    />
  )
}
