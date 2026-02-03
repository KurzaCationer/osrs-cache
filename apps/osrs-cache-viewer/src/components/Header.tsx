import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Home,
  Menu,
  Network,
  SquareFunction,
  StickyNote,
  Table,
  X,
} from 'lucide-react'
import { css } from '../styled-system/css'

const linkStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  p: '3',
  rounded: 'lg',
  transition: 'colors',
  mb: '2',
  _hover: { bg: 'gray.800' }
})

const activeLinkStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  p: '3',
  rounded: 'lg',
  transition: 'colors',
  mb: '2',
  bg: 'cyan.600',
  _hover: { bg: 'cyan.700' }
})

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({})

  return (
    <>
      <header className={css({
        p: '4',
        display: 'flex',
        alignItems: 'center',
        bg: 'gray.800',
        color: 'white',
        shadow: 'lg'
      })}>
        <button
          onClick={() => setIsOpen(true)}
          className={css({
            p: '2',
            rounded: 'lg',
            transition: 'colors',
            _hover: { bg: 'gray.700' }
          })}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className={css({ ml: '4', fontSize: 'xl', fontWeight: 'semibold' })}>
          <Link to="/">
            <img
              src="/tanstack-word-logo-white.svg"
              alt="TanStack Logo"
              className={css({ h: '10' })}
            />
          </Link>
        </h1>
      </header>

      <aside
        className={css({
          position: 'fixed',
          top: '0',
          left: '0',
          h: 'full',
          w: '80',
          bg: 'gray.900',
          color: 'white',
          shadow: '2xl',
          zIndex: '50',
          transition: 'transform 0.3s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        })}
      >
        <div className={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '4',
          borderBottomWidth: '1px',
          borderColor: 'gray.700'
        })}>
          <h2 className={css({ fontSize: 'xl', fontWeight: 'bold' })}>Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className={css({
              p: '2',
              rounded: 'lg',
              transition: 'colors',
              _hover: { bg: 'gray.800' }
            })}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className={css({ flex: '1', p: '4', overflowY: 'auto' })}>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={linkStyle}
            activeProps={{ className: activeLinkStyle }}
          >
            <Home size={20} />
            <span className={css({ fontWeight: 'medium' })}>Home</span>
          </Link>

          {/* Demo Links Start */}

          <Link
            to="/demo/start/server-funcs"
            onClick={() => setIsOpen(false)}
            className={linkStyle}
            activeProps={{ className: activeLinkStyle }}
          >
            <SquareFunction size={20} />
            <span className={css({ fontWeight: 'medium' })}>Start - Server Functions</span>
          </Link>

          <Link
            to="/demo/start/api-request"
            onClick={() => setIsOpen(false)}
            className={linkStyle}
            activeProps={{ className: activeLinkStyle }}
          >
            <Network size={20} />
            <span className={css({ fontWeight: 'medium' })}>Start - API Request</span>
          </Link>

          <div className={css({ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' })}>
            <Link
              to="/demo/start/ssr"
              onClick={() => setIsOpen(false)}
              className={css({
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                gap: '3',
                p: '3',
                rounded: 'lg',
                transition: 'colors',
                mb: '2',
                _hover: { bg: 'gray.800' }
              })}
              activeProps={{
                className: css({
                  flex: '1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3',
                  p: '3',
                  rounded: 'lg',
                  transition: 'colors',
                  mb: '2',
                  bg: 'cyan.600',
                  _hover: { bg: 'cyan.700' }
                })
              }}
            >
              <StickyNote size={20} />
              <span className={css({ fontWeight: 'medium' })}>Start - SSR Demos</span>
            </Link>
            <button
              className={css({
                p: '2',
                rounded: 'lg',
                transition: 'colors',
                _hover: { bg: 'gray.800' }
              })}
              onClick={() =>
                setGroupedExpanded((prev) => ({
                  ...prev,
                  StartSSRDemo: !prev.StartSSRDemo,
                }))
              }
            >
              {groupedExpanded.StartSSRDemo ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          </div>
          {groupedExpanded.StartSSRDemo && (
            <div className={css({ display: 'flex', flexDirection: 'column', ml: '4' })}>
              <Link
                to="/demo/start/ssr/spa-mode"
                onClick={() => setIsOpen(false)}
                className={linkStyle}
                activeProps={{ className: activeLinkStyle }}
              >
                <StickyNote size={20} />
                <span className={css({ fontWeight: 'medium' })}>SPA Mode</span>
              </Link>

              <Link
                to="/demo/start/ssr/full-ssr"
                onClick={() => setIsOpen(false)}
                className={linkStyle}
                activeProps={{ className: activeLinkStyle }}
              >
                <StickyNote size={20} />
                <span className={css({ fontWeight: 'medium' })}>Full SSR</span>
              </Link>

              <Link
                to="/demo/start/ssr/data-only"
                onClick={() => setIsOpen(false)}
                className={linkStyle}
                activeProps={{ className: activeLinkStyle }}
              >
                <StickyNote size={20} />
                <span className={css({ fontWeight: 'medium' })}>Data Only</span>
              </Link>
            </div>
          )}

          <Link
            to="/demo/tanstack-query"
            onClick={() => setIsOpen(false)}
            className={linkStyle}
            activeProps={{ className: activeLinkStyle }}
          >
            <Network size={20} />
            <span className={css({ fontWeight: 'medium' })}>TanStack Query</span>
          </Link>

          <Link
            to="/demo/table"
            onClick={() => setIsOpen(false)}
            className={linkStyle}
            activeProps={{ className: activeLinkStyle }}
          >
            <Table size={20} />
            <span className={css({ fontWeight: 'medium' })}>TanStack Table</span>
          </Link>

          {/* Demo Links End */}
        </nav>
      </aside>
    </>
  )
}