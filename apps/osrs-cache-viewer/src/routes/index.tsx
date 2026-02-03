import { createFileRoute } from '@tanstack/react-router'
import {
  Zap,
  Server,
  Route as RouteIcon,
  Shield,
  Waves,
  Sparkles,
} from 'lucide-react'
import { css } from '@/styled-system/css'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const iconClass = css({ w: '12', h: '12', color: 'blue.400' })

  const features = [
    {
      icon: <Zap className={iconClass} />,
      title: 'Powerful Server Functions',
      description:
        'Write server-side code that seamlessly integrates with your client components. Type-safe, secure, and simple.',
    },
    {
      icon: <Server className={iconClass} />,
      title: 'Flexible Server Side Rendering',
      description:
        'Full-document SSR, streaming, and progressive enhancement out of the box. Control exactly what renders where.',
    },
    {
      icon: <RouteIcon className={iconClass} />,
      title: 'API Routes',
      description:
        'Build type-safe API endpoints alongside your application. No separate backend needed.',
    },
    {
      icon: <Shield className={iconClass} />,
      title: 'Strongly Typed Everything',
      description:
        'End-to-end type safety from server to client. Catch errors before they reach production.',
    },
    {
      icon: <Waves className={iconClass} />,
      title: 'Full Streaming Support',
      description:
        'Stream data from server to client progressively. Perfect for AI applications and real-time updates.',
    },
    {
      icon: <Sparkles className={iconClass} />,
      title: 'Next Generation Ready',
      description:
        'Built from the ground up for modern web applications. Deploy anywhere JavaScript runs.',
    },
  ]

  return (
    <div className={css({ minH: 'screen', bgGradient: 'to-b', gradientFrom: 'slate.900', gradientVia: 'slate.800', gradientTo: 'slate.900' })}>
      <section className={css({ position: 'relative', py: '20', px: '6', textAlign: 'center', overflow: 'hidden' })}>
        <div className={css({ position: 'absolute', inset: '0', bgGradient: 'to-r', gradientFrom: 'cyan.500/10', gradientVia: 'blue.500/10', gradientTo: 'purple.500/10' })}></div>
        <div className={css({ position: 'relative', maxW: '5xl', mx: 'auto' })}>
          <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6', mb: '6' })}>
            <img
              src="/tanstack-circle-logo.png"
              alt="TanStack Logo"
              className={css({ w: ['24', null, '32'], h: ['24', null, '32'] })}
            />
            <h1 className={css({ fontSize: ['6xl', null, '7xl'], fontWeight: 'black', color: 'white', letterSpacing: '-0.08em' })}>
              <span className={css({ color: 'gray.300' })}>TANSTACK</span>{' '}
              <span className={css({ bgGradient: 'to-r', gradientFrom: 'cyan.400', gradientTo: 'blue.400', bgClip: 'text', color: 'transparent' })}>
                START
              </span>
            </h1>
          </div>
          <p className={css({ fontSize: ['2xl', null, '3xl'], color: 'gray.300', mb: '4', fontWeight: 'light' })}>
            The framework for next generation AI applications
          </p>
          <p className={css({ fontSize: 'lg', color: 'gray.400', maxW: '3xl', mx: 'auto', mb: '8' })}>
            Full-stack framework powered by TanStack Router for React and Solid.
            Build modern applications with server functions, streaming, and type
            safety.
          </p>
          <div className={css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4' })}>
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noopener noreferrer"
              className={css({
                px: '8',
                py: '3',
                bg: 'cyan.500',
                color: 'white',
                fontWeight: 'semibold',
                rounded: 'lg',
                transition: 'colors',
                shadow: 'lg',
                shadowColor: 'cyan.500/50',
                _hover: { bg: 'cyan.600' }
              })}
            >
              Documentation
            </a>
            <p className={css({ color: 'gray.400', fontSize: 'sm', mt: '2' })}>
              Begin your TanStack Start journey by editing{' '}
              <code className={css({ px: '2', py: '1', bg: 'slate.700', rounded: 'DEFAULT', color: 'cyan.400' })}>
                /src/routes/index.tsx
              </code>
            </p>
          </div>
        </div>
      </section>

      <section className={css({ py: '16', px: '6', maxW: '7xl', mx: 'auto' })}>
        <div className={css({ display: 'grid', gridTemplateColumns: ['1', null, '2', '3'], gap: '6' })}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={css({
                bg: 'slate.800/50',
                backdropBlur: 'sm',
                borderWidth: '1px',
                borderColor: 'slate.700',
                rounded: 'xl',
                p: '6',
                transition: 'all 0.3s',
                _hover: {
                  borderColor: 'cyan.500/50',
                  shadow: 'lg',
                  shadowColor: 'cyan.500/10'
                }
              })}
            >
              <div className={css({ mb: '4' })}>{feature.icon}</div>
              <h3 className={css({ fontSize: 'xl', fontWeight: 'semibold', color: 'white', mb: '3' })}>
                {feature.title}
              </h3>
              <p className={css({ color: 'gray.400', lineHeight: 'relaxed' })}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
