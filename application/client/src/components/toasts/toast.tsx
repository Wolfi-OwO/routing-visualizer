import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'
export interface ToastData {
  id: string
  type: ToastType
  message: string
}

const ICONS = { success: CheckCircle, error: AlertTriangle, info: Info }
const COLORS = {
  success: 'text-[var(--green)]',
  error: 'text-red-400',
  info: 'text-[var(--accent)]',
}

export default function Toast({ toast, onClose }: { toast: ToastData; onClose: (id: string) => void }) {
  const Icon = ICONS[toast.type]
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--bg-800)] border border-[var(--border)] shadow-lg text-xs text-[var(--text-primary)]">
      <Icon size={14} className={COLORS[toast.type]} />
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      >
        <X size={12} />
      </button>
    </div>
  )
}
