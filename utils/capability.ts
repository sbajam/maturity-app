// Helpers for building/aggregating the capability tree and counting evidence per capability.
import type {
  Capability,
  CapabilityAssessment,
  ID,
} from "~/types"
import { average } from "~/utils/number"

export type CapabilityNode = Capability & {
  children: CapabilityNode[]
}

export function buildCapabilityTree(
  capabilities: Capability[],
): CapabilityNode[] {
  const map = new Map<ID, CapabilityNode>()

  for (const capability of capabilities) {
    map.set(capability.id, { ...capability, children: [] })
  }

  const roots: CapabilityNode[] = []

  for (const node of map.values()) {
    if (node.parentId === null) {
      roots.push(node)
      continue
    }

    const parent = map.get(node.parentId)

    if (parent)
      parent.children.push(node)
  }

  const sortNodes = (nodes: CapabilityNode[]) => {
    nodes.sort((a, b) => a.order - b.order)
    nodes.forEach(node => sortNodes(node.children))
  }

  sortNodes(roots)

  return roots
}

export function getLeafCapabilities(
  capabilities: Capability[],
): Capability[] {
  const parentIds = new Set(
    capabilities
      .map(item => item.parentId)
      .filter((id): id is ID => id !== null),
  )

  return capabilities.filter(
    item => !parentIds.has(item.id),
  )
}

export function aggregateParentAssessments(
  capabilities: Capability[],
  leafAssessments: CapabilityAssessment[],
): CapabilityAssessment[] {
  const tree = buildCapabilityTree(capabilities)
  const assessmentMap = new Map<ID, CapabilityAssessment>()

  for (const item of leafAssessments)
    assessmentMap.set(item.capabilityId, item)

  const aggregate = (
    node: CapabilityNode,
  ): CapabilityAssessment | null => {
    if (node.children.length === 0)
      return assessmentMap.get(node.id) ?? null

    const childResults = node.children
      .map(child => aggregate(child))
      .filter(
        (item): item is CapabilityAssessment =>
          item !== null,
      )

    if (!childResults.length)
      return null

    const scores = childResults.map(item => item.score)
    const levels = childResults.map(
      item => item.maturityLevel,
    )
    const confidences = childResults.map(
      item => item.confidence,
    )

    const result: CapabilityAssessment = {
      id: node.id,
      assessmentId: childResults[0].assessmentId,
      capabilityId: node.id,
      score: average(scores),
      maturityLevel: Math.round(average(levels)),
      confidence: average(confidences, 2),
      reasoning:
        "Aggregated from child capability assessments.",
      createdAt: childResults[0].createdAt,
      updatedAt: childResults[0].updatedAt,
    }

    assessmentMap.set(node.id, result)

    return result
  }

  tree.forEach(root => aggregate(root))

  return Array.from(assessmentMap.values())
}

export function countEvidenceForCapability(
  capabilityId: ID,
  mappings: { capabilityId: ID }[],
): number {
  return mappings.filter(
    item => item.capabilityId === capabilityId,
  ).length
}
