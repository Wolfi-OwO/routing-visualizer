import { api } from './client.ts'

export interface TraceHop {
  step: number
  nodeId: string
  nodeName: string
  nodeType: string
  action: string
  detail: string
  firewallRule?: { priority: number; action: string; description: string }
  latencyMs: number
  edgeId?: string
}

export interface TraceResult {
  id: string
  success: boolean
  blocked: boolean
  blockedAt?: string
  blockedBy?: string
  dropType?: 'deny' | 'drop'
  path: string[]
  edgePath: string[]
  hops: TraceHop[]
  totalLatencyMs: number
  packet: {
    srcNodeId: string
    dstNodeId: string
    srcIp: string
    dstIp: string
    protocol: string
    srcPort?: number
    dstPort?: number
    ttl: number
  }
  timestamp: number
}

// Traces are a sub-resource of a topology: POST /api/networks/:id/traces
export const send = {
  trace: (params: {
    srcNodeId: string
    dstNodeId: string
    protocol: 'tcp' | 'udp' | 'icmp'
    dstPort?: number
    ttl?: number
    topologyId?: string
  }) => {
    const { topologyId = 'default', ...body } = params
    return api.post<TraceResult>(`/networks/${topologyId}/traces`, body)
  },
}
