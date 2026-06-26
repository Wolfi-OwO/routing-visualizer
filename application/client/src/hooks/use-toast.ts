import { useContext } from 'react'
import { ToastContext } from '../context/toast-context.tsx'

// Convenience hook to raise toasts from anywhere in the app.
export function useToast() {
  return useContext(ToastContext)
}
