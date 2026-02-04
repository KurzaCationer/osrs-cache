import { Box, Map, Music, Package, RefreshCw, Users } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { loadCache } from '@kurza/osrs-cache-loader'
import { css } from '../styled-system/css'

const getAssetCounts = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    return await loadCache({ game: 'osrs' })
  } catch (error) {
    console.error('Failed to load cache:', error)
    throw new Error('Failed to load OSRS cache summary. Please try again later.')
  }
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getAssetCounts(),
})

function CountCard({ title, count, icon: Icon, color }: { title: string; count: number; icon: React.ElementType; color: string }) {
  return (
    <div 
      style={{ '--hover-color': color } as React.CSSProperties}
      className={css({
        p: '6',
        bg: 'gray.800',
        rounded: 'xl',
        borderWidth: '1px',
        borderColor: 'gray.700',
        display: 'flex',
        alignItems: 'center',
        gap: '4',
        shadow: 'md',
        transition: 'transform 0.2s, border-color 0.2s',
        _hover: { transform: 'translateY(-2px)', borderColor: 'var(--hover-color)' }
      })}
    >
      <div 
        style={{ color }}
        className={css({
          p: '3',
          rounded: 'lg',
          bg: 'gray.900'
        })}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className={css({ color: 'gray.400', fontSize: 'sm', fontWeight: 'medium' })}>{title}</p>
        <p className={css({ color: 'white', fontSize: '2xl', fontWeight: 'bold' })}>{count.toLocaleString()}</p>
      </div>
    </div>
  )
}

function Home() {
  const data = Route.useLoaderData()

  return (
    <main className={css({
      minH: 'calc(100vh - 64px)',
      bg: 'gray.950',
      p: '8',
      color: 'white'
    })}>
      <div className={css({ maxW: '6xl', mx: 'auto' })}>
        <header className={css({ mb: '10' })}>
          <h2 className={css({ fontSize: '3xl', fontWeight: 'bold', mb: '2' })}>Cache Summary</h2>
          <p className={css({ color: 'gray.400' })}>
            Overview of assets loaded from the latest OpenRS2 OSRS cache.
          </p>
        </header>

        <div className={css({
          gridTemplateColumns: { base: '1', md: '2', lg: '3' },
          display: 'grid',
          gap: '6'
        })}>
          <CountCard title="Items" count={data.items} icon={Package} color="cyan.400" />
          <CountCard title="NPCs" count={data.npcs} icon={Users} color="green.400" />
          <CountCard title="Objects" count={data.objects} icon={Box} color="orange.400" />
          <CountCard title="Maps" count={data.maps} icon={Map} color="purple.400" />
          <CountCard title="Audio" count={data.audio} icon={Music} color="pink.400" />
        </div>

        <footer className={css({ mt: '12', p: '6', bg: 'blue.900/20', rounded: 'xl', borderWidth: '1px', borderColor: 'blue.800/50', display: 'flex', alignItems: 'center', gap: '4' })}>
          <RefreshCw className={css({ color: 'blue.400' })} size={20} />
          <p className={css({ color: 'blue.100', fontSize: 'sm' })}>
            Data is fetched directly from the OpenRS2 Archive API using the `@kurza/osrs-cache-loader` package.
          </p>
        </footer>
      </div>
    </main>
  )
}
