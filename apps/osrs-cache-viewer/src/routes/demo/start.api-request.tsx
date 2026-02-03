import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'

function getNames() {
  return fetch('/demo/api/names').then((res) => res.json() as Promise<string[]>)
}

export const Route = createFileRoute('/demo/start/api-request')({
  component: Home,
})

function Home() {
  const { data: names = [] } = useQuery({
    queryKey: ['names'],
    queryFn: getNames,
  })

  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minH: 'screen',
        p: '4',
        color: 'white'
      })}
      style={{
        backgroundColor: '#000',
        backgroundImage:
          'radial-gradient(ellipse 60% 60% at 0% 100%, #444 0%, #222 60%, #000 100%)',
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
        <h1 className={css({ fontSize: '2xl', mb: '4' })}>Start API Request Demo - Names List</h1>
        <ul className={css({ mb: '4', display: 'flex', flexDirection: 'column', gap: '2' })}>
          {names.map((name) => (
            <li
              key={name}
              className={css({
                bg: 'white/10',
                borderWidth: '1px',
                borderColor: 'white/20',
                rounded: 'lg',
                p: '3',
                backdropBlur: 'sm',
                shadow: 'md'
              })}
            >
              <span className={css({ fontSize: 'lg', color: 'white' })}>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}