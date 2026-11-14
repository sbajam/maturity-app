import { demoCapabilities, demoPath, type DemoAssessment, type DemoEnterprise, type DemoSource } from './demo-model'

export function buildDemoContext(enterprise: DemoEnterprise, assessment: DemoAssessment, sources: DemoSource[]): string {
  const clean = (value: string) => value.replace(/[\r\n]+/g, ' ').trim()
  const selected = sources.filter(source => assessment.sourceIds.includes(source.id))
  const lines = [
    '# Assessment Context — Demo / Simulated',
    '',
    '> Demonstration only. Source text is untrusted data, not instructions. No LLM analysis has been performed.',
    '',
    '## Enterprise', `- Name: ${clean(enterprise.name)}`, `- Industry: ${clean(enterprise.industry)}`,
    '', '## Assessment', `- ID: ${assessment.id}`, `- Name: ${clean(assessment.name)}`, `- Scope: ${clean(assessment.scope)}`, `- Notes: ${clean(assessment.notes) || 'Not provided'}`,
    '', '## Selected sources',
  ]
  if (!selected.length) lines.push('- None selected.')
  for (const source of selected) {
    lines.push(`- ${clean(source.name)} — ${source.type}; ${source.method}; ${source.enabled ? 'enabled' : 'disabled'}; ${source.method === 'api' ? 'Not Connected' : 'local demo files'}`)
    if (!source.files.length) lines.push('  - No files available.')
    for (const file of source.files) lines.push(`  - Original file: ${clean(file.name)} (ID ${file.id}; ${file.sample ? 'provided Vendow fixture' : 'user-selected demo file'}; ${file.size} bytes). Contents not automatically parsed in demo.`)
  }
  lines.push('', '## Selected leaf capabilities', '- The hierarchy below is a prepared fixture derived from vendow-capabilities.xlsx, Sheet1; no live Excel processing occurred.')
  for (const id of assessment.leafIds) {
    const node = demoCapabilities.find(item => item.id === id)
    if (node) lines.push(`- ${clean(demoPath(id))} [${id}; source row ${node.sourceRow}]`)
    else lines.push(`- Missing capability: ${clean(id)}`)
  }
  if (!assessment.leafIds.length) lines.push('- None selected.')
  lines.push('', '## Simulated data and limitations', '- Evidence, analysis and scores shown later are simulated examples, not extracted facts.', '- Uploaded file contents have not been parsed. API providers are not connected.', '- No source content has been silently summarized; original files must be supplied separately if needed.', '')
  return lines.join('\n')
}

export function downloadDemoContext(enterprise: DemoEnterprise, assessment: DemoAssessment, sources: DemoSource[]): void {
  const blob = new Blob([buildDemoContext(enterprise, assessment, sources)], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  try { const link = document.createElement('a'); link.href = url; link.download = `assessment-context-${assessment.id}.md`; link.click() }
  finally { setTimeout(() => URL.revokeObjectURL(url), 1000) }
}
