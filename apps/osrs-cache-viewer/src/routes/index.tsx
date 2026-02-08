import { useEffect, useState } from 'react'
import { ExternalLink, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { AssetSummaryTable } from '@kurza/ui-components'
import { css } from '../styled-system/css'
import { fetchSummary, refreshCache } from '../integrations/osrs-cache-api'
import type { CacheMetadata } from '@kurza/osrs-cache-loader'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await fetchSummary(),
})

export function Home() {
  const data = Route.useLoaderData()
  return <HomeContent data={data as CacheMetadata} />
}

export function HomeContent({ data }: { data: CacheMetadata }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshCache()
      await router.invalidate()
    } catch (e) {
      console.error(e)
    } finally {
      setRefreshing(false)
    }
  }

  const build = data.builds[0] ? `Build #${data.builds[0].major}` : 'Unknown Build'
  const date = data.timestamp ? new Date(data.timestamp).toLocaleDateString() : 'Unknown Date'
  const lastChecked = data.lastCheckedAt && mounted ? new Date(data.lastCheckedAt).toLocaleString() : 'Never'

  return (
    <main className={css({
      minH: 'calc(100vh - 64px)',
      bg: 'bg.default',
      p: { base: '4', md: '8' },
      color: 'text.main'
    })}>
      <div className={css({ maxW: '6xl', mx: 'auto' })}>
        <header className={css({ mb: '10' })}>
          <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4' })}>
            <div>
              <h2 className={css({ fontSize: '3xl', fontWeight: 'bold', mb: '2' })}>Cache Summary</h2>
              <p className={css({ color: 'text.muted' })}>
                Overview of assets loaded from the latest OpenRS2 OSRS cache.
              </p>
            </div>
            <div className={css({ bg: 'bg.surface', p: '4', rounded: 'lg', border: '1px solid', borderColor: 'border.default', fontSize: 'sm', minW: '300px' })}>
              <div className={css({ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'x-4 y-2' })}>
                <span className={css({ color: 'text.dim' })}>Cache ID:</span>
                <span className={css({ color: 'secondary.default', fontFamily: 'mono' })}>{data.id}</span>
                
                <span className={css({ color: 'text.dim' })}>Version:</span>
                <span className={css({ color: 'text.main', fontWeight: 'medium' })}>{build}</span>
                
                <span className={css({ color: 'text.dim' })}>Timestamp:</span>
                <span className={css({ color: 'text.main' })}>{mounted ? date : '---'}</span>

                <span className={css({ color: 'text.dim' })}>Sync Status:</span>
                <div className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
                  {data.isStale ? (
                    <span className={css({ color: 'primary.default', display: 'flex', alignItems: 'center', gap: '1', fontWeight: 'bold' })}>
                      <AlertTriangle size={14} /> Update Available
                    </span>
                  ) : (
                    <span className={css({ color: 'secondary.default', display: 'flex', alignItems: 'center', gap: '1' })}>
                      <CheckCircle size={14} /> Synced
                    </span>
                  )}
                </div>

                <span className={css({ color: 'text.dim' })}>Last Checked:</span>
                <span className={css({ color: 'text.muted', fontSize: 'xs' })}>{lastChecked}</span>
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={css({
                  mt: '4',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2',
                  py: '2',
                  px: '4',
                  bg: refreshing ? 'bg.muted' : 'bg.active',
                  color: 'text.main',
                  rounded: 'md',
                  fontSize: 'xs',
                  fontWeight: 'bold',
                  cursor: refreshing ? 'not-allowed' : 'pointer',
                  border: '1px solid',
                  borderColor: 'border.default',
                  transition: 'all',
                  _hover: { bg: refreshing ? 'bg.muted' : 'border.default' }
                })}
              >
                <RefreshCw size={14} className={css({ animation: refreshing ? 'spin 2s linear infinite' : 'none' })} />
                {refreshing ? 'Checking for updates...' : 'Check for Updates'}
              </button>
            </div>
          </div>
        </header>

        <AssetSummaryTable 
          counts={data.counts} 
          renderBrowseLink={(id, name) => (
            <Link 
              to="/browse/$type" 
              params={{ type: id }}
              className={css({ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2', 
                px: '3', 
                py: '2', 
                bg: 'bg.active', 
                _hover: { bg: 'bg.muted' }, 
                rounded: 'lg', 
                fontSize: 'xs', 
                fontWeight: 'medium', 
                transition: 'colors',
                color: 'text.main',
                textDecoration: 'none'
              })}
            >
              <ExternalLink size={14} />
              Browse {name}
            </Link>
          )}
        />

        <footer className={css({ mt: '12', p: '6', bg: 'bg.muted', rounded: 'xl', borderWidth: '1px', borderColor: 'border.subtle', display: 'flex', alignItems: 'center', gap: '4' })}>
          <RefreshCw className={css({ color: 'secondary.default' })} size={20} />
          <p className={css({ color: 'text.muted', fontSize: 'sm' })}>
            Data is fetched directly from the OpenRS2 Archive API using the `@kurza/osrs-cache-loader` package.
          </p>
        </footer>
      </div>
    </main>
  )
}