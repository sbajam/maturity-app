import type { BaseEntity, ID } from "./common"

export type Capability = BaseEntity & {
  name: string

  description?: string

  parentId: ID | null

  level: number

  order: number
}