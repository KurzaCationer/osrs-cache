import React from 'react'
import { css, cx } from './styled-system/css'

/**
 * Props for the Loader component.
 */
interface LoaderProps {
  /** The size of the spinner in pixels. */
  size?: number
  /** Additional CSS classes to apply to the container. */
  className?: string
}

/**
 * A spinning SVG loader component for indicating background activity.
 */
export const Loader = ({ size = 24, className }: LoaderProps) => {
  const containerStyles = css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  })

  const spinnerStyles = css({
    animation: 'spin 1s linear infinite',
    color: 'primary.default',
  })

  return (
    <div className={cx(containerStyles, className)}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={spinnerStyles}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  )
}