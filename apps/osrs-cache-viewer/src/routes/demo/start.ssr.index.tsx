import { createFileRoute, Link } from '@tanstack/react-router'
import { css } from '@/styled-system/css'

export const Route = createFileRoute('/demo/start/ssr/')({
  component: RouteComponent,
})

function RouteComponent() {
  const linkBase = css({
    fontSize: '2xl',
    fontWeight: 'bold',
    py: '6',
    px: '8',
    rounded: 'lg',
    bgGradient: 'to-r',
    color: 'white',
    textAlign: 'center',
    shadow: 'lg',
    transition: 'all',
    borderWidth: '2px',
    _hover: { scale: '1.05' }
  })

  const pinkLink = css({
    gradientFrom: 'pink.600',
    gradientTo: 'pink.500',
    borderColor: 'pink.400',
    _hover: { gradientFrom: 'pink.700', gradientTo: 'pink.600', shadowColor: 'pink.500/50' }
  })

  const purpleLink = css({
    gradientFrom: 'purple.600',
    gradientTo: 'purple.500',
    borderColor: 'purple.400',
    _hover: { gradientFrom: 'purple.700', gradientTo: 'purple.600', shadowColor: 'purple.500/50' }
  })

  const greenLink = css({
    gradientFrom: 'green.500',
    gradientTo: 'emerald.500',
    borderColor: 'green.400',
    _hover: { gradientFrom: 'green.600', gradientTo: 'emerald.600', shadowColor: 'green.500/50' }
  })

  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minH: 'screen',
        bgGradient: 'to-br',
        gradientFrom: 'zinc.900',
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
        <h1 className={css({
          fontSize: '4xl',
          fontWeight: 'bold',
          mb: '8',
          textAlign: 'center',
          bgGradient: 'to-r',
          gradientFrom: 'pink.500',
          gradientVia: 'purple.500',
          gradientTo: 'green.400',
          bgClip: 'text',
          color: 'transparent'
        })}>
          SSR Demos
        </h1>
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
          <Link
            to="/demo/start/ssr/spa-mode"
            className={`${linkBase} ${pinkLink}`}
          >
            SPA Mode
          </Link>
          <Link
            to="/demo/start/ssr/full-ssr"
            className={`${linkBase} ${purpleLink}`}
          >
            Full SSR
          </Link>
          <Link
            to="/demo/start/ssr/data-only"
            className={`${linkBase} ${greenLink}`}
          >
            Data Only
          </Link>
        </div>
      </div>
    </div>
  )
}