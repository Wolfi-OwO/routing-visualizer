import { api } from './client.ts'
import type { PacketStats } from '../../types/index.ts'

type CaptureState = { capturing: boolean; stats: PacketStats }

// Capture session — a single stateful resource at /api/capture.
// Start/stop is a PATCH on its `capturing` field (RESTful state transition).
export const capture = {
  get: () => api.get<CaptureState>('/capture'),
  start: () => api.patch<CaptureState>('/capture', { capturing: true }),
  stop: () => api.patch<CaptureState>('/capture', { capturing: false }),
}
