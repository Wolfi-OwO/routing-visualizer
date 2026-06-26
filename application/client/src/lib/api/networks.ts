import { api } from './client.ts'
import type { NetworkTopology, NetworkNode, NetworkEdge } from '../../types/index.ts'

// Topologies — RESTful resource at /api/networks
export const network = {
  list: () => api.get<{ items: NetworkTopology[]; count: number }>('/networks'),
  getDefault: () => api.get<NetworkTopology>('/networks/default'),
  get: (id: string) => api.get<NetworkTopology>(`/networks/${id}`),
  create: (name: string, description?: string) =>
    api.post<NetworkTopology>('/networks', { name, description }),
  update: (id: string, data: Partial<NetworkTopology>) =>
    api.put<NetworkTopology>(`/networks/${id}`, data),
  delete: (id: string) => api.delete<void>(`/networks/${id}`),
  addNode: (topologyId: string, node: Omit<NetworkNode, 'id'>) =>
    api.post<NetworkNode>(`/networks/${topologyId}/nodes`, node),
  updateNode: (topologyId: string, nodeId: string, data: Partial<NetworkNode>) =>
    api.put<NetworkNode>(`/networks/${topologyId}/nodes/${nodeId}`, data),
  deleteNode: (topologyId: string, nodeId: string) =>
    api.delete<void>(`/networks/${topologyId}/nodes/${nodeId}`),
  addEdge: (topologyId: string, edge: Omit<NetworkEdge, 'id'>) =>
    api.post<NetworkEdge>(`/networks/${topologyId}/edges`, edge),
  updateEdge: (topologyId: string, edgeId: string, data: Partial<NetworkEdge>) =>
    api.put<NetworkEdge>(`/networks/${topologyId}/edges/${edgeId}`, data),
  deleteEdge: (topologyId: string, edgeId: string) =>
    api.delete<void>(`/networks/${topologyId}/edges/${edgeId}`),
}
