import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { JsonAssetTable, Loader } from '@kurza/ui-components'
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { AssetBrowserLayout } from '../../components/AssetBrowserLayout'
import { SpriteCanvas } from '../../components/SpriteCanvas'
import { DBTableBrowser } from '../../components/DBTableBrowser'
import { fetchAssets } from '../../integrations/osrs-cache-api'
import { css } from '../../styled-system/css'
import type { AssetCounts } from '@kurza/osrs-cache-loader'

export const Route = createFileRoute('/browse/$type')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      limit: Number(search.limit ?? 50),
      offset: Number(search.offset ?? 0),
      tableId:
        search.tableId !== undefined ? Number(search.tableId) : undefined,
    }
  },
  component: BrowseType,
  loader: async ({ params, search }) => {
    return await fetchAssets({
      data: {
        type: params.type as keyof AssetCounts,
        limit: search.limit ?? 50,
        offset: search.offset ?? 0,
        tableId: search.tableId,
      },
    })
  },
})

export function BrowseTypeContent({
  type,
  data,
  isLoading,
  isError,
  limit,
  offset,
  tableId,
}: {
  type: string
  data?: Array<unknown>
  isLoading: boolean
  isError: boolean
  limit: number
  offset: number
  tableId?: number
}) {
  const navigate = useNavigate()

  const handlePrev = () => {
    navigate({
      search: (old: Record<string, unknown>) => ({ ...old, offset: Math.max(0, offset - limit) }),
    })
  }

  const handleNext = () => {
    navigate({
      search: (old: Record<string, unknown>) => ({ ...old, offset: offset + limit }),
    })
  }

  const title = `Browsing ${type}${tableId !== undefined ? ` (Table ${tableId})` : ''}`

  return (
    <AssetBrowserLayout title={title}>
      {isLoading ? (
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: '20',
            gap: '4',
          })}
        >
          <Loader size={48} />
          <p className={css({ color: 'text.muted', animate: 'pulse' })}>
            Loading assets from cache...
          </p>
        </div>
      ) : isError ? (
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: '20',
            gap: '4',
            color: 'error.default',
          })}
        >
          <AlertCircle size={48} />
          <p className={css({ fontWeight: 'bold' })}>Failed to load assets.</p>
          <p className={css({ fontSize: 'sm', color: 'text.muted' })}>
            The requested asset type might not be supported yet or the cache is
            unavailable.
          </p>
        </div>
      ) : (
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
                  <span
                    className={css({ fontSize: 'xs', color: 'text.muted' })}
                  >
                    ID: {item.id}
                  </span>
                </div>
              ))}
            </div>
          ) : type === 'dbTable' ? (
            <DBTableBrowser data={(data ?? []) as Array<Record<string, unknown>>} />
          ) : (
            <JsonAssetTable data={(data ?? []) as Array<Record<string, unknown>>} />
          )}

          <div
            className={css({
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '4',
              mt: '4',
              py: '2',
            })}
          >
            <button
              onClick={handlePrev}
              disabled={offset === 0}
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '1',
                px: '4',
                py: '2',
                bg: 'bg.surface',
                border: '1px solid',
                borderColor: 'border.default',
                rounded: 'md',
                fontSize: 'sm',
                cursor: 'pointer',
                _disabled: { opacity: 0.5, cursor: 'not-allowed' },
                _hover: { bg: 'bg.muted', _disabled: { bg: 'bg.surface' } },
              })}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className={css({ fontSize: 'sm', color: 'text.muted' })}>
              Offset: {offset.toLocaleString()}
            </span>
            <button
              onClick={handleNext}
              disabled={(data?.length ?? 0) < limit}
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '1',
                px: '4',
                py: '2',
                bg: 'bg.surface',
                border: '1px solid',
                borderColor: 'border.default',
                rounded: 'md',
                fontSize: 'sm',
                cursor: 'pointer',
                _disabled: { opacity: 0.5, cursor: 'not-allowed' },
                _hover: { bg: 'bg.muted', _disabled: { bg: 'bg.surface' } },
              })}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </AssetBrowserLayout>
  )
}

export function BrowseType() {
  const { type } = Route.useParams()
  const data = Route.useLoaderData()
  const search = useSearch({ from: '/browse/$type' })
  const limit = search.limit
  const offset = search.offset
  const tableId = search.tableId

  return (
    <BrowseTypeContent
      type={type}
      data={data as Array<unknown>}
      isLoading={false}
      isError={false}
      limit={limit}
      offset={offset}
      tableId={tableId}
    />
  )
}
