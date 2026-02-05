import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Home, Menu, X } from 'lucide-react'
import { css } from '../styled-system/css'

const linkStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  p: '3',
  rounded: 'lg',
  transition: 'colors',
  mb: '2',
  _hover: { bg: 'bg.muted' }
})

const activeLinkStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  p: '3',
  rounded: 'lg',
  transition: 'colors',
  mb: '2',
  bg: 'primary.default',
  _hover: { bg: 'primary.muted' }
})

/**
 * The main application header component, featuring a navigation menu and app title.
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className={css({
        p: '4',
        display: 'flex',
        alignItems: 'center',
        bg: 'bg.surface',
        color: 'text.main',
        shadow: 'lg',
        borderBottom: '1px solid',
        borderColor: 'border.default'
      })}>
        <button
          onClick={() => setIsOpen(true)}
          className={css({
            p: '2',
            rounded: 'lg',
            transition: 'colors',
            _hover: { bg: 'bg.active' }
          })}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className={css({ ml: '4', fontSize: 'xl', fontWeight: 'semibold' })}>
          <Link to="/" className={css({ textDecoration: 'none', color: 'text.main' })}>
            OSRS Cache Viewer
          </Link>
        </h1>
      </header>

      <aside
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        className={css({
          position: 'fixed',
          top: '0',
          left: '0',
          h: 'full',
          w: '80',
          bg: 'bg.surface',
          color: 'text.main',
          shadow: '2xl',
          zIndex: '50',
          transition: 'transform 0.3s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid',
          borderColor: 'border.default'
        })}
      >
        <div className={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '4',
          borderBottomWidth: '1px',
          borderColor: 'border.default'
        })}>
          <h2 className={css({ fontSize: 'xl', fontWeight: 'bold' })}>Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className={css({
              p: '2',
              rounded: 'lg',
              transition: 'colors',
              _hover: { bg: 'bg.active' }
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
        </nav>
      </aside>
    </>
  )
}