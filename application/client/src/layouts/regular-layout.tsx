import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar.tsx'
import Footer from '../components/core/footer.tsx'

// Default layout for the app: sidebar navigation + page content + persistent footer.
export default function RegularLayout() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[var(--bg-950)]">
      {/* Sidebar + page content share the remaining height; the footer is always visible below. */}
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
