import { createFileRoute } from '@tanstack/react-router'
import { getPunkSongs } from '@/data/demo.punk-songs'
import { css } from '@/styled-system/css'

export const Route = createFileRoute('/demo/start/ssr/data-only')({
  ssr: 'data-only',
  component: RouteComponent,
  loader: async () => await getPunkSongs(),
})

function RouteComponent() {
  const punkSongs = Route.useLoaderData()

  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minH: 'screen',
        bgGradient: 'to-br',
        gradientFrom: 'zinc.800',
        gradientTo: 'black',
        p: '4',
        color: 'white'
      })}
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 20% 60%, #1a1a1a 0%, #0a0a0a 50%, #000000 100%)',
      }}
    >
      <div className={css({
        w: 'full',
        maxW: '2xl',
        p: '8',
        rounded: 'xl',
        backdropBlur: 'md',
        bg: 'black/50',
        shadow: 'xl',
        borderWidth: '8px',
        borderColor: 'black/10'
      })}>
        <h1 className={css({ fontSize: '3xl', fontWeight: 'bold', mb: '6', color: 'pink.400' })}>
          Data Only SSR - Punk Songs
        </h1>
        <ul className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
          {punkSongs.map((song) => (
            <li
              key={song.id}
              className={css({
                bg: 'white/10',
                borderWidth: '1px',
                borderColor: 'white/20',
                rounded: 'lg',
                p: '4',
                backdropBlur: 'sm',
                shadow: 'md'
              })}
            >
              <span className={css({ fontSize: 'lg', color: 'white', fontWeight: 'medium' })}>
                {song.name}
              </span>
              <span className={css({ color: 'white/60' })}> - {song.artist}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}