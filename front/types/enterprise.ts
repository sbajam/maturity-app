// Enterprise entity type.
import type { BaseEntity } from "./common"

export type Enterprise = BaseEntity & {
  name: string

  description?: string

  industry: string

  country?: string

  businessModel?: string

  companySize?: string

  logo?: string
}