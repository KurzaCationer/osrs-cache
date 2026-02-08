import { css } from '../styled-system/css'

interface AssetBrowserLayoutProps {
  title: string
  children: React.ReactNode
}

export function AssetBrowserLayout({
  title,
  children,
}: AssetBrowserLayoutProps) {
  return (
    <div className={css({ p: { base: '4', md: '8' } })}>
      <div className={css({ mb: '6' })}>
        <h1
          className={css({
            fontSize: '3xl',
            fontWeight: 'bold',
            textTransform: 'capitalize',
            color: 'text.main',
          })}
        >
          {title}
        </h1>
      </div>
      <div
        className={css({
          bg: 'bg.surface',
          p: '6',
          rounded: 'xl',
          border: '1px solid',
          borderColor: 'border.subtle',
        })}
      >
        {children}
      </div>
    </div>
  )
}
