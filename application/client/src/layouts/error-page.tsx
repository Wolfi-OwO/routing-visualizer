import { useRouteError, useNavigate, isRouteErrorResponse } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

// Rendered by the router whenever a route throws (errorElement).
export default function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  let title = 'Something went wrong'
  let message = 'An unexpected error occurred.'
  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    message = (error.data as { message?: string } | undefined)?.message ?? message
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-4 bg-[var(--bg-950)] text-center px-6">
      <AlertTriangle size={40} className="text-[var(--accent)]" />
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{title}</h1>
      <p className="text-sm text-[var(--text-secondary)] max-w-md">{message}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-md text-xs font-medium bg-[var(--bg-800)] text-[var(--text-primary)] hover:bg-[var(--bg-700)]"
        >
          Go back
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-md text-xs font-medium bg-[var(--accent)] text-white hover:opacity-90"
        >
          Home
        </button>
      </div>
    </div>
  )
}
