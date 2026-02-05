import React from 'react'
import { css, cx } from './styled-system/css'

/**
 * Props for the Card component.
 */
interface CardProps {
  /** The content to display inside the card. */
  children: React.ReactNode
  /** Additional CSS classes to apply to the card container. */
  className?: string
}

/**
 * A generic container component for grouping related content.
 */
export const Card = ({ children, className }: CardProps) => {
  const cardStyles = css({
    bg: 'bg.surface',
    border: '1px solid',
    borderColor: 'border.default',
    rounded: 'xl',
    overflow: 'hidden',
    shadow: 'sm',
  })

  return (
    <div className={cx(cardStyles, className)}>
      {children}
    </div>
  )
}