import { RefreshCw } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {  getMetadata } from '@kurza/osrs-cache-loader'
import { AssetSummaryTable } from '@kurza/ui-components'
import { css } from '../styled-system/css'

const getCacheMetadata = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    return await getMetadata({ game: 'oldschool' })
  } catch (error) {
    console.error('Failed to load cache metadata:', error)
    throw new Error('Failed to load OSRS cache summary. Please try again later.')
  }
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCacheMetadata(),
})

function Home() {
  const data = Route.useLoaderData()
  const build = data.builds[0] ? `Build #${data.builds[0].major}` : 'Unknown Build'
  const date = data.timestamp ? new Date(data.timestamp).toLocaleDateString() : 'Unknown Date'

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
            <div className={css({ bg: 'bg.surface', p: '4', rounded: 'lg', border: '1px solid', borderColor: 'border.default', fontSize: 'sm' })}>
              <div className={css({ display: 'grid', gridTemplateColumns: 'auto auto', gap: 'x-4 y-1' })}>
                <span className={css({ color: 'text.dim', pr: '4' })}>Cache ID:</span>
                <span className={css({ color: 'secondary.default', fontFamily: 'mono' })}>{data.id}</span>
                <span className={css({ color: 'text.dim', pr: '4' })}>Version:</span>
                <span className={css({ color: 'text.main', fontWeight: 'medium' })}>{build}</span>
                <span className={css({ color: 'text.dim', pr: '4' })}>Timestamp:</span>
                <span className={css({ color: 'text.main' })}>{date}</span>
                <span className={css({ color: 'text.dim', pr: '4' })}>Source:</span>
                <span className={css({ color: 'text.muted' })}>{data.source}</span>
              </div>
            </div>
          </div>
        </header>

        <AssetSummaryTable counts={data.counts} />

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