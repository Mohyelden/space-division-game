import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function PrimaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button className={`primary-btn ${className}`} {...props}>{children}</button>
}
