import { api } from './client.ts'
import type { Packet } from '../../types/index.ts'

// Captured packets — collection at /api/packets
export const packets = {
  list: (since?: number, limit = 200) =>
    api.get<{ items: Packet[]; count: number }>('/packets', { params: { since, limit } }),
  getById: (id: number) => api.get<Packet>(`/packets/${id}`),
  clear: () => api.delete<void>('/packets'),
  streamUrl: () => '/api/packets/stream',
}
