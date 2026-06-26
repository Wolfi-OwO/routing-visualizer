import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface NavButtonProps {
  to: string
  children: ReactNode
  className?: string
}

// Generic, domain-agnostic button that navigates to a route (per template <NavButton>).
export default function NavButton({ to, children, className }: NavButtonProps) {
  const navigate = useNavigate()
  return (
    <button type="button" onClick={() => navigate(to)} className={className}>
      {children}
    </button>
  )
}
