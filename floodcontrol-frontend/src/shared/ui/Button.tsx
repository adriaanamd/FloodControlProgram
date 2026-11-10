import type { CSSProperties, ReactNode } from "react"

type ButtonProps = {
  children: ReactNode
  className?: string
  onClick?: () => void
  ariaLabel?: string
  style?: CSSProperties
}

export function Button({
  children,
  className = "",
  onClick,
  ariaLabel,
  style,
}: ButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      style={style}
      className={`focus-ring cursor-pointer transition-colors ${className}`}
    >
      {children}
    </button>
  )
}
