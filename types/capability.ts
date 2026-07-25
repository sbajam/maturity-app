// Capability entity type representing a node in the capability framework tree.
import type { BaseEntity, ID } from "./common"

export type Capability = BaseEntity & {
  name: string

  description?: string

  parentId: ID | null

  level: number

  order: number
}