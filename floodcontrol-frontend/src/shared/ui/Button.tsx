import type { CSSProperties, ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  className?: string
  onClick?: () => void
  ariaLabel?: string
  style?: CSSProperties
}

export function Button({ children, className = '', onClick, ariaLabel, style }: ButtonProps) {
  return <button type="button" aria-label={ariaLabel} onClick={onClick} style={style} className={`cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${className}`}>{children}</button>
}
