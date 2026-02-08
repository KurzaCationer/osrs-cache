import React from 'react'
import { css, cx } from './styled-system/css'

/**
 * Props for the Button component.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The visual variant of the button. */
  variant?: 'primary' | 'secondary' | 'outline'
}

/**
 * A standard button component with multiple style variants.
 */
export const Button = ({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) => {
  const buttonStyles = css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: '4',
    py: '2',
    rounded: 'md',
    fontWeight: 'medium',
    fontSize: 'sm',
    transition: 'all 0.2s',
    cursor: 'pointer',
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    ...(variant === 'primary' && {
      bg: 'primary.default',
      color: 'bg.default',
      _hover: { bg: 'primary.muted' },
    }),
    ...(variant === 'secondary' && {
      bg: 'secondary.default',
      color: 'text.main',
      _hover: { bg: 'secondary.muted' },
    }),
    ...(variant === 'outline' && {
      bg: 'transparent',
      border: '1px solid',
      borderColor: 'border.default',
      color: 'text.main',
      _hover: { bg: 'bg.muted', borderColor: 'border.subtle' },
    }),
  })

  return (
    <button className={cx(buttonStyles, className)} {...props}>
      {children}
    </button>
  )
}
