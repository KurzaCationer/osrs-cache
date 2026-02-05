import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AssetBrowserLayout } from '../../components/AssetBrowserLayout'
import { assetsQueryOptions } from '../../integrations/osrs-cache-api'
import { Loader, AssetDataTable } from '@kurza/ui-components'
import { css } from '../../styled-system/css'
import { AlertCircle } from 'lucide-react'
import type { AssetCounts } from '@kurza/osrs-cache-loader'

export const Route = createFileRoute('/browse/$type')({
  component: BrowseType,
})

export function BrowseTypeContent({ type, data, isLoading, isError }: { 
  type: string, 
  data?: any[], 
  isLoading: boolean, 
  isError: boolean 
}) {
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
        <AssetDataTable data={data ?? []} />
      )}
    </AssetBrowserLayout>
  )
}

export function BrowseType() {
  const { type } = Route.useParams()
  const { data, isLoading, isError } = useQuery(assetsQueryOptions(type as keyof AssetCounts))
  
  return <BrowseTypeContent type={type} data={data} isLoading={isLoading} isError={isError} />
}
