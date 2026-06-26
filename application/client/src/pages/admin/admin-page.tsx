import { Settings, Database, Activity } from 'lucide-react'
import { appConfig } from '../../config/index.ts'

// Minimal administration overview (rendered inside AdminLayout).
export default function AdminPage() {
  const cards = [
    { icon: Database, label: 'Database', value: 'MongoDB' },
    { icon: Activity, label: 'Health', value: '/api/ready · /api/live' },
    { icon: Settings, label: 'Version', value: `v${appConfig.version}` },
  ]
  return (
    <div className="p-6">
      <h1 className="text-lg font-bold text-[var(--text-primary)] mb-4">Administration</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 p-4 rounded-lg bg-[var(--bg-900)] border border-[var(--border)]">
            <Icon size={18} className="text-[var(--accent)]" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{label}</div>
              <div className="text-sm font-medium text-[var(--text-primary)]">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
