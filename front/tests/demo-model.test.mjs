import test from 'node:test'
import assert from 'node:assert/strict'
import { aggregateDemoTree, demoInitialState, demoLeaves, demoSourceTypes } from '../utils/demo-model.ts'
import { buildDemoContext } from '../utils/demo-export.ts'

const nodes = [
  { id: 'root', parentId: null, name: 'Root', sourceRow: 1 },
  { id: 'branch', parentId: 'root', name: 'Branch', sourceRow: 2 },
  { id: 'deep', parentId: 'branch', name: 'Deep', sourceRow: 3 },
  { id: 'leaf', parentId: 'deep', name: 'Leaf', sourceRow: 4 },
  { id: 'sibling', parentId: 'root', name: 'Sibling', sourceRow: 5 },
]

test('averages direct children through a four-level tree', () => {
  const result = aggregateDemoTree(nodes, { leaf: { score: 5, status: 'sufficient' }, sibling: { score: 3, status: 'sufficient' } })
  assert.equal(result.root?.score, 4)
  assert.equal(result.branch?.score, 5)
})
test('missing or out-of-range leaf scores propagate incomplete without becoming zero', () => {
  const result = aggregateDemoTree(nodes, { leaf: { score: null, status: 'insufficient' }, sibling: { score: 7, status: 'sufficient' } })
  assert.equal(result.root?.score, null)
  assert.equal(result.deep?.status, 'incomplete')
  assert.equal(result.sibling?.score, null)
})
test('fixture types and context contain provenance without generated results', () => {
  assert.equal(demoSourceTypes.length, 8)
  assert.ok(demoSourceTypes.some(item => item.value === 'custom'))
  const state = demoInitialState(); const enterprise = state.enterprises[0]
  const leaf = demoLeaves('v2-1')[0]
  const context = buildDemoContext(enterprise, { id: 'test', enterpriseId: enterprise.id, name: 'Sample', step: 2, sourceIds: [state.sources[0].id], leafIds: [leaf], scope: 'Demo', notes: '' }, state.sources)
  assert.match(context, /Demo \/ Simulated/)
  assert.match(context, /vendow-capabilities\.xlsx/)
  assert.match(context, /source row/)
  assert.match(context, /No LLM analysis/)
})
