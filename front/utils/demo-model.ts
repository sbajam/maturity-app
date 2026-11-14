import capabilities from '../mock/vendow-capabilities.json'

export interface DemoCapability { id: string; parentId: string | null; name: string; sourceRow: number }
export interface DemoFile { id: string; name: string; url: string; sample: boolean; size: number }
export interface DemoSource { id: string; enterpriseId: string; name: string; type: DemoSourceType; method: 'file' | 'api'; enabled: boolean; files: DemoFile[] }
export interface DemoEnterprise { id: string; name: string; industry: string }
export interface DemoAssessment { id: string; enterpriseId: string; name: string; step: number; sourceIds: string[]; leafIds: string[]; scope: string; notes: string }
export interface DemoState { version: 1; enterprises: DemoEnterprise[]; sources: DemoSource[]; assessments: DemoAssessment[] }
export type DemoSourceType = 'clarity' | 'matomo' | 'support' | 'business_document' | 'capability_excel' | 'server_log' | 'event_log' | 'custom'

export const demoCapabilities: DemoCapability[] = capabilities
export const demoSourceTypes: { value: DemoSourceType; label: string }[] = [
  { value: 'clarity', label: 'Microsoft Clarity' }, { value: 'matomo', label: 'Matomo Analytics' },
  { value: 'support', label: 'Support Tickets' }, { value: 'business_document', label: 'Business Documentation' },
  { value: 'capability_excel', label: 'Capability Excel' }, { value: 'server_log', label: 'Server Logs' },
  { value: 'event_log', label: 'Event Logs' }, { value: 'custom', label: 'Custom' },
]

export function demoInitialState(): DemoState {
  return {
    version: 1,
    enterprises: [{ id: 'vendow', name: 'Vendow', industry: 'SaaS' }],
    sources: [
      { id: 'vendow-capabilities', enterpriseId: 'vendow', name: 'Vendow capability workbook', type: 'capability_excel', method: 'file', enabled: true, files: [{ id: 'vendow-xlsx', name: 'vendow-capabilities.xlsx', url: '/demo/fixtures/vendow-capabilities.xlsx', sample: true, size: 72102 }] },
      { id: 'vendow-document', enterpriseId: 'vendow', name: 'Vendow business document', type: 'business_document', method: 'file', enabled: true, files: [{ id: 'vendow-pdf', name: 'vendow-document.pdf', url: '/demo/fixtures/vendow-document.pdf', sample: true, size: 224103 }] },
    ],
    assessments: [],
  }
}

export function demoChildren(id: string | null): DemoCapability[] { return demoCapabilities.filter(item => item.parentId === id) }
export function demoLeaves(id: string): string[] {
  const children = demoChildren(id)
  return children.length ? children.flatMap(child => demoLeaves(child.id)) : [id]
}
export function demoPath(id: string): string {
  const path: string[] = []; let node = demoCapabilities.find(item => item.id === id)
  while (node) { path.unshift(node.name); node = node.parentId ? demoCapabilities.find(item => item.id === node?.parentId) : undefined }
  return path.join(' / ')
}
export interface DemoResult { score: number | null; status: 'sufficient' | 'insufficient' | 'not_selected' | 'complete' | 'incomplete' }
export function aggregateDemoTree(nodes: DemoCapability[], leafResults: Record<string, DemoResult>): Record<string, DemoResult> {
  const output: Record<string, DemoResult> = {}
  const visit = (node: DemoCapability): DemoResult => {
    const children = nodes.filter(item => item.parentId === node.id)
    if (!children.length) {
      const candidate = leafResults[node.id]
      const valid = candidate?.score != null && Number.isFinite(candidate.score) && candidate.score >= 1 && candidate.score <= 5
      const result: DemoResult = valid ? { score: candidate.score, status: 'sufficient' } : { score: null, status: candidate?.status === 'not_selected' ? 'not_selected' : 'insufficient' }
      output[node.id] = result; return result
    }
    const results = children.map(visit)
    const complete = results.every(item => item.score !== null)
    const result: DemoResult = complete ? { score: results.reduce((sum, item) => sum + (item.score ?? 0), 0) / results.length, status: 'complete' } : { score: null, status: 'incomplete' }
    output[node.id] = result; return result
  }
  nodes.filter(item => item.parentId === null).forEach(visit)
  return output
}

export function demoResults(selectedLeaves: string[], sourceIds: string[]): Record<string, DemoResult> {
  const leafResults: Record<string, DemoResult> = {}
  for (const node of demoCapabilities) {
    if (demoChildren(node.id).length) continue
    const index = selectedLeaves.indexOf(node.id)
    leafResults[node.id] = index < 0 ? { score: null, status: 'not_selected' } : index % 2 === 0 && sourceIds.length ? { score: 4, status: 'sufficient' } : { score: null, status: 'insufficient' }
  }
  return aggregateDemoTree(demoCapabilities, leafResults)
}
