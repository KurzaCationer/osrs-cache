import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { AssetSummaryTable } from '@kurza/ui-components'
import { css, cva } from '../styled-system/css'

import { fetchSummary, refreshCache } from '../integrations/osrs-cache-api'
import type { CacheMetadata } from '@kurza/osrs-cache-loader'

const updateButtonStyle = cva({
  base: {
    mt: '6',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    py: '2.5',
    px: '4',
    color: 'text.main',
    rounded: 'lg',
    fontSize: 'xs',
    fontWeight: 'bold',
    border: '1px solid',
    borderColor: 'border.default',
    transition: 'all',
  },
  variants: {
    disabled: {
      true: {
        bg: 'bg.muted',
        cursor: 'not-allowed',
        _hover: { bg: 'bg.muted' },
      },
      false: {
        bg: 'bg.active',
        cursor: 'pointer',
        _hover: { bg: 'border.default' },
      },
    },
  },
})

const summaryRowValue = cva({
  base: {
    fontWeight: 'medium',
    fontSize: 'sm',
  },
  variants: {
    isMono: {
      true: {
        color: 'secondary.default',
        fontFamily: 'mono',
        fontWeight: 'normal',
      },
      false: {
        color: 'text.main',
        fontFamily: 'sans',
      },
    },
    isLastChecked: {
      true: {
        fontSize: 'xs',
      },
    },
  },
})

const spinningIconStyle = cva({
  base: {
    animation: 'none',
  },
  variants: {
    refreshing: {
      true: { animation: 'spin 2s linear infinite' },
      false: { animation: 'none' },
    },
  },
})

const summaryRowStyle = cva({
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    py: '3',
    borderColor: 'border.subtle',
  },
  variants: {
    isLast: {
      true: { borderBottom: 'none' },
      false: { borderBottom: '1px solid' },
    },
  },
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await fetchSummary(),
})

export function Home() {
  const data = Route.useLoaderData()
  return <HomeContent data={data as CacheMetadata} />
}

export function HomeContent({
  data,
  isLoading = false,
}: {
  data: CacheMetadata
  isLoading?: boolean
}) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
     
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

  const build = data.builds[0]
    ? `Build #${data.builds[0].major}`
    : 'Unknown Build'
  const date = data.timestamp
    ? new Date(data.timestamp).toLocaleDateString()
    : 'Unknown Date'
  const lastChecked =
    data.lastCheckedAt && mounted
      ? new Date(data.lastCheckedAt).toLocaleString()
      : 'Never'

  return (
    <main
      className={css({
        minH: 'calc(100vh - 64px)',
        bg: 'bg.default',
        p: { base: '4', md: '8' },
        color: 'text.main',
      })}
    >
      <div className={css({ maxW: '6xl', mx: 'auto' })}>
        <header className={css({ mb: '10' })}>
          <div
            className={css({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '8',
            })}
          >
            <div className={css({ flex: '1', minW: '300px' })}>
              <h2
                className={css({
                  fontSize: '3xl',
                  fontWeight: 'bold',
                  mb: '2',
                })}
              >
                Cache Summary
              </h2>
              <p className={css({ color: 'text.muted' })}>
                Overview of assets loaded from the latest OpenRS2 OSRS cache.
              </p>
            </div>

            <div
              className={css({
                bg: 'bg.surface',
                p: '6',
                rounded: 'xl',
                border: '1px solid',
                borderColor: 'border.default',
                fontSize: 'sm',
                minW: { base: 'full', md: '400px' },
                boxShadow: 'sm',
              })}
            >
              <h3
                className={css({
                  fontSize: 'xs',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  color: 'text.muted',
                  mb: '4',
                  letterSpacing: 'wider',
                })}
              >
                Technical Summary
              </h3>

              <div
                className={css({ display: 'flex', flexDirection: 'column' })}
              >
                {isLoading ? (
                  <div
                    className={css({
                      py: '8',
                      display: 'flex',
                      justifyContent: 'center',
                    })}
                  >
                    <RefreshCw
                      className={css({
                        animation: 'spin 2s linear infinite',
                        color: 'text.dim',
                      })}
                      size={24}
                    />
                  </div>
                ) : (
                  <>
                    <SummaryRow label="Cache ID" value={data.id} isMono />
                    <SummaryRow label="Version" value={build} />
                    <SummaryRow
                      label="Timestamp"
                      value={mounted ? date : '---'}
                    />
                    <SummaryRow
                      label="Sync Status"
                      value={
                        data.isStale ? (
                          <span
                            className={css({
                              color: 'primary.default',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1.5',
                              fontWeight: 'bold',
                            })}
                          >
                            <AlertTriangle size={14} /> Update Available
                          </span>
                        ) : (
                          <span
                            className={css({
                              color: 'secondary.default',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1.5',
                              fontWeight: 'medium',
                            })}
                          >
                            <CheckCircle size={14} /> Synced
                          </span>
                        )
                      }
                    />
                    <SummaryRow
                      label="Last Checked"
                      value={lastChecked}
                      isLast
                    />
                  </>
                )}
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing || isLoading}
                className={updateButtonStyle({
                  disabled: refreshing || isLoading,
                })}
              >
                <RefreshCw
                  size={14}
                  className={spinningIconStyle({ refreshing })}
                />
                {refreshing ? 'Checking for updates...' : 'Check for Updates'}
              </button>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div
            className={css({
              py: '20',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4',
            })}
          >
            <RefreshCw
              className={css({
                animation: 'spin 3s linear infinite',
                color: 'text.dim',
              })}
              size={48}
            />
            <p className={css({ color: 'text.muted' })}>
              Loading cache data...
            </p>
          </div>
        ) : (
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
                  textDecoration: 'none',
                })}
              >
                <ExternalLink size={14} />
                Browse {name}
              </Link>
            )}
          />
        )}

        <footer
          className={css({
            mt: '12',
            p: '6',
            bg: 'bg.muted',
            rounded: 'xl',
            borderWidth: '1px',
            borderColor: 'border.subtle',
            display: 'flex',
            alignItems: 'center',
            gap: '4',
          })}
        >
          <RefreshCw
            className={css({ color: 'secondary.default' })}
            size={20}
          />
          <p className={css({ color: 'text.muted', fontSize: 'sm' })}>
            Data is fetched directly from the OpenRS2 Archive API using the
            `@kurza/osrs-cache-loader` package.
          </p>
        </footer>
      </div>
    </main>
  )
}

function SummaryRow({
  label,
  value,
  isMono = false,
  isLast = false,
}: {
  label: string
  value: React.ReactNode
  isMono?: boolean
  isLast?: boolean
}) {
  return (
    <div className={summaryRowStyle({ isLast })}>
      <span className={css({ color: 'text.muted', fontWeight: 'medium' })}>
        {label}
      </span>
      <span
        className={summaryRowValue({
          isMono,
          isLastChecked: label === 'Last Checked',
        })}
      >
        {value}
      </span>
    </div>
  )
}
