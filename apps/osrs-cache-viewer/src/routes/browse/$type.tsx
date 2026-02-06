import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { JsonAssetTable, Loader } from '@kurza/ui-components'
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { AssetBrowserLayout } from '../../components/AssetBrowserLayout'
import { fetchAssets } from '../../integrations/osrs-cache-api'
import { css } from '../../styled-system/css'
import type { AssetCounts } from '@kurza/osrs-cache-loader'

export const Route = createFileRoute('/browse/$type')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      limit: Number(search?.limit ?? 50),
      offset: Number(search?.offset ?? 0),
    }
  },
  component: BrowseType,
  loader: async ({ params, search }) => {
    return await fetchAssets({ 
      data: { 
        type: params.type as keyof AssetCounts,
        limit: search?.limit ?? 50,
        offset: search?.offset ?? 0
      } 
    })
  }
})

export function BrowseTypeContent({ type, data, isLoading, isError, limit, offset }: { 
  type: string, 
  data?: Array<any>, 
  isLoading: boolean, 
  isError: boolean,
  limit: number,
  offset: number
}) {
  const navigate = useNavigate()

  const handlePrev = () => {
    navigate({
      search: (old: any) => ({ ...old, offset: Math.max(0, offset - limit) })
    })
  }

  const handleNext = () => {
    navigate({
      search: (old: any) => ({ ...old, offset: offset + limit })
    })
  }

  return (
    <AssetBrowserLayout title={`Browsing ${type}`}>
      {isLoading ? (
        <div className={css({ display: 'flex', flexDirection: 'column', alignItems: 'center', py: '20', gap: '4' })}>
          <Loader size={48} />
          <p className={css({ color: 'text.muted', animate: 'pulse' })}>Loading assets from cache...</p>
        </div>
      ) : isError ? (
        <div className={css({ display: 'flex', flexDirection: 'column', alignItems: 'center', py: '20', gap: '4', color: 'error.default' })}>
          <AlertCircle size={48} />
          <p className={css({ fontWeight: 'bold' })}>Failed to load assets.</p>
          <p className={css({ fontSize: 'sm', color: 'text.muted' })}>The requested asset type might not be supported yet or the cache is unavailable.</p>
        </div>
      ) : (
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
          <JsonAssetTable data={data ?? []} />
          
          <div className={css({ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4', mt: '4', py: '2' })}>
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
                _hover: { bg: 'bg.muted', _disabled: { bg: 'bg.surface' } }
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
                _hover: { bg: 'bg.muted', _disabled: { bg: 'bg.surface' } }
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
  const limit = search?.limit ?? 50
  const offset = search?.offset ?? 0
  
  return <BrowseTypeContent type={type} data={data} isLoading={false} isError={false} limit={limit} offset={offset} />
}
